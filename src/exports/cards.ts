import { costWithoutPilot, costWithPilot } from '@/model/cost'
import { ShipType, SquadronTrait, type Ship } from '@/model/model'
import jsPDF from 'jspdf'
import {
  calculateHeight,
  drawColumns,
  drawShipCard,
  points,
  type FontSizes,
  type Landmarks,
} from './common'

export function exportAsPdfCards(
  squadronName: string | null,
  squadronTrait: SquadronTrait | null,
  leaderTrait: string | null,
  ships: Ship[]
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: [5, 3],
  })

  doc.setLineWidth(points(1))
  doc.setDrawColor('#444444')

  const dimensions = {
    startX: 0.25,
    startY: 0.25,
    width: 4.5,
  }

  const fontSizes: FontSizes = {
    shipName: 14,
    shipType: 10,
    stats: 12,
    upgrades: 11,
    locations: 10,
  }

  drawSquadronCard(doc, squadronName, squadronTrait, leaderTrait, ships)
  for (const s of ships) {
    doc.addPage()
    const landmarks = calculateLandmarks(0.25, fontSizes, s.weapons.length)
    drawShipCard(
      doc,
      s,
      squadronName ?? 'Unnamed Squadron',
      dimensions,
      fontSizes,
      landmarks
    )
  }

  doc.save((squadronName ?? 'squadron') + '.pdf')
}

function drawSquadronCard(
  doc: jsPDF,
  name: string | null,
  trait: SquadronTrait | null,
  leaderTrait: string | null,
  ships: Ship[]
) {
  const nameFontSize = 14
  const traitsFontSize = 10
  const shipsFontSize = 12

  const shipBoxTop =
    0.25 + calculateHeight(nameFontSize, traitsFontSize) + points(2)
  const shipTextTop = shipBoxTop + points(2)

  drawSquadronBoxes(doc, shipBoxTop)
  drawSquadronHeader(
    doc,
    name ?? 'Unnamed squadron',
    trait,
    leaderTrait,
    ships,
    nameFontSize,
    traitsFontSize
  )
  drawShipList(doc, ships, shipsFontSize, shipTextTop)
}

function drawSquadronBoxes(doc: jsPDF, boxTop: number) {
  doc.rect(0.25, boxTop, 4.5, 2.75 - boxTop)
  drawColumns(doc, { startX: 0.25, startY: 0.25, width: 4.5 }, boxTop, 2.75, 2)
}

function drawSquadronHeader(
  doc: jsPDF,
  name: string,
  trait: SquadronTrait | null,
  leaderTrait: string | null,
  ships: Ship[],
  nameFontSize: number,
  traitsFontSize: number
) {
  doc.setFont('helvetica', 'bolditalic')
  doc.setFontSize(nameFontSize)
  doc.text(name.toUpperCase(), 0.25, 0.25, { align: 'left', baseline: 'top' })

  doc.setFont('helvetica', 'bold')
  const totalWithoutPilots = ships.reduce((a, s) => a + costWithoutPilot(s), 0)
  const totalWithPilots = ships.reduce((a, s) => a + costWithPilot(s), 0)
  doc.text(`${totalWithoutPilots} (${totalWithPilots})`, 4.75, 0.25, {
    align: 'right',
    baseline: 'top',
  })

  const traitLine: string[] = []
  if (trait) {
    traitLine.push(trait.toUpperCase())
  }
  if (leaderTrait) {
    traitLine.push(leaderTrait.toUpperCase())
  }
  doc.setFontSize(traitsFontSize)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor('#444444')
  doc.text(
    `TRAITS: ${traitLine.join(', ') || 'none'}`.toUpperCase(),
    0.25,
    0.25 + calculateHeight(nameFontSize),
    {
      align: 'left',
      baseline: 'top',
    }
  )
}

function drawShipList(
  doc: jsPDF,
  ships: Ship[],
  fontSize: number,
  top: number
) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(fontSize)
  const headers = Object.values(ShipType).map((t) => t.toUpperCase() + 'S:')
  const formatted = [
    filterAndFormat(ships, ShipType.Snubfighter),
    filterAndFormat(ships, ShipType.Gunship),
    filterAndFormat(ships, ShipType.Corvette),
  ]

  doc.saveGraphicsState()
  doc.rect(0.25, top, 2.25, 2.75 - top, null)
  doc.clip()
  doc.discardPath()

  const padding = points(2)
  let header = true
  let column = 0
  let row = 0
  let currentType = 0
  let n = 0
  let shipsPlaced = 0
  const lineHeight = calculateHeight(fontSize)
  while (shipsPlaced < ships.length) {
    if (header && formatted[currentType].length == 0) {
      currentType++
      continue
    }

    if (atEndOfFirstColumn(header, column, row)) {
      column++
      row = 0
      header = true
      doc.restoreGraphicsState()
      doc.saveGraphicsState()
      doc.rect(2.5, top, 2.25, 2.75 - top, null)
      doc.clip()
      doc.discardPath()
      continue
    }

    if (header) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor('#000000')
      doc.text(
        headers[currentType],
        0.25 + padding + column * 2.25,
        top + padding + row * lineHeight,
        { align: 'left', baseline: 'top' }
      )
      header = false
    } else {
      doc.setFont('helvetica', 'normal')
      doc.text(
        formatted[currentType][n],
        0.25 + padding * 6 + column * 2.25,
        top + padding + row * lineHeight,
        { align: 'left', baseline: 'top' }
      )
      n++
      shipsPlaced++

      if (n == formatted[currentType].length) {
        n = 0
        currentType++
        header = true
      }
    }
    row++
  }

  doc.restoreGraphicsState()
}

function atEndOfFirstColumn(
  header: boolean,
  currentColumn: number,
  currentRow: number
): boolean {
  return (currentColumn == 0 && header && currentRow >= 8) || currentRow > 9
}

function filterAndFormat(ships: Ship[], type: ShipType): string[] {
  return ships
    .filter((s) => s.shipType === type)
    .map((s) => `${s.name} - ${costWithoutPilot(s)} (${costWithPilot(s)})`)
    .toSorted()
}

function calculateLandmarks(
  startY: number,
  fontSizes: FontSizes,
  numberOfWeapons: number
): Landmarks {
  const statsHeaderTopLine =
    0.25 + calculateHeight(fontSizes.shipName, fontSizes.shipType) + points(4)
  const statsTopLine =
    statsHeaderTopLine + calculateHeight(fontSizes.stats) + points(3)
  const statsBottomLine =
    statsTopLine +
    calculateHeight(fontSizes.stats * Math.max(numberOfWeapons, 1)) +
    points(2)
  const statsHeaderTopText = statsHeaderTopLine + points(2)
  const statsTopText =
    statsHeaderTopText + calculateHeight(fontSizes.stats) + points(3)
  const upgradesTop = statsBottomLine + points(4)
  const locationsTopLine =
    2.75 - calculateHeight(fontSizes.locations, fontSizes.locations) - points(4)
  const locationsTextTop = locationsTopLine + points(2)

  return {
    headerTextTop: 0.25,
    statsHeaderTopLine,
    statsTopLine,
    statsBottomLine,
    statsHeaderTopText,
    statsTextTop: statsTopText,
    upgradesTop,
    locationsTopLine,
    locationsTextTop,
    bottomLine: 2.75,
  }
}
