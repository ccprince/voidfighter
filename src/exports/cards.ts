import { coalesceDuplicateUpgrades, formatUpgrades } from '@/helpers'
import { costWithoutPilot, costWithPilot } from '@/model/cost'
import { ShipType, SquadronTrait, type Ship } from '@/model/model'
import { formatWeapon } from '@/model/printable'
import jsPDF, { type TextOptionsLight } from 'jspdf'

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

  drawSquadronCard(doc, squadronName, squadronTrait, leaderTrait, ships)
  for (const s of ships) {
    doc.addPage()
    drawShipCard(doc, squadronName ?? 'Unnamed Squadron', s)
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
    0.25 + points(calculateHeight(nameFontSize, traitsFontSize) + 2)
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
  drawColumns(doc, boxTop, 2.75, 2)
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
    0.25 + points(calculateHeight(nameFontSize)),
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
  const lineHeight = points(calculateHeight(fontSize))
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

function drawShipCard(doc: jsPDF, squadronName: string, ship: Ship) {
  const shipNameFontSize = 14
  const shipTypeFontSize = 10
  const statsFontSize = 12
  const upgradesFontSize = 11
  const locationsFontSize = 10

  const statsHeaderTopLine =
    0.25 + points(calculateHeight(shipNameFontSize, shipTypeFontSize) + 4)
  const statsTopLine =
    statsHeaderTopLine + points(calculateHeight(statsFontSize) + 3)
  const statsBottomLine =
    statsTopLine +
    points(calculateHeight(statsFontSize * ship.weapons.length) + 2)
  const statsHeaderTopText = statsHeaderTopLine + points(2)
  const statsTopText =
    statsHeaderTopText + points(calculateHeight(statsFontSize) + 3)
  const upgradesTop = statsBottomLine + points(4)
  const locationsTopLine =
    2.75 - points(calculateHeight(locationsFontSize) * 2 + 4)
  const locationsTextTop = locationsTopLine + points(2)

  drawBoxes(
    doc,
    statsHeaderTopLine,
    statsTopLine,
    statsBottomLine,
    locationsTopLine
  )
  drawHeader(doc, squadronName, ship, shipNameFontSize, shipTypeFontSize)
  drawStats(doc, ship, statsFontSize, statsHeaderTopText, statsTopText)
  drawUpgrades(doc, ship, upgradesFontSize, upgradesTop)
  drawLocations(doc, locationsFontSize, locationsTextTop)
}

function drawBoxes(
  doc: jsPDF,
  statsHeaderTopLine: number,
  statsTopLine: number,
  statsBottomLine: number,
  locationsTopLine: number
) {
  doc.setFillColor('#d7deeb')
  doc.rect(
    0.25,
    statsHeaderTopLine,
    4.5,
    statsTopLine - statsHeaderTopLine,
    'F'
  )
  doc.rect(0.25, locationsTopLine, 4.5, 2.75 - locationsTopLine, 'F')

  doc.rect(0.25, statsHeaderTopLine, 4.5, 2.75 - statsHeaderTopLine)
  doc.line(0.25, statsTopLine, 4.75, statsTopLine)
  drawColumns(doc, statsHeaderTopLine, statsBottomLine, 4)
  doc.line(0.25, statsBottomLine, 4.75, statsBottomLine)

  doc.line(0.25, locationsTopLine, 4.75, locationsTopLine)
  drawColumns(doc, locationsTopLine, 2.75, 5)
}

function drawColumns(doc: jsPDF, top: number, bottom: number, count: number) {
  const columnWidth = 4.5 / count
  for (let x = 0.25 + columnWidth; x < 4.75; x += columnWidth) {
    doc.line(x, top, x, bottom)
  }
}

function drawHeader(
  doc: jsPDF,
  squadronName: string,
  ship: Ship,
  shipNameFontSize: number,
  shipTypeFontSize: number
) {
  doc.setTextColor('#000000')
  doc.setFontSize(shipNameFontSize)
  doc.setFont('helvetica', 'bolditalic')
  doc.text(ship.name.toUpperCase(), 0.25, 0.25, {
    align: 'left',
    baseline: 'top',
  })
  doc.setFont('helvetica', 'bold')
  doc.text(`${costWithoutPilot(ship)} (${costWithPilot(ship)})`, 4.75, 0.25, {
    align: 'right',
    baseline: 'top',
  })

  doc.setFontSize(shipTypeFontSize)
  doc.setTextColor('#444444')
  doc.setFont('helvetica', 'italic')
  doc.text(
    `${ship.shipType.toUpperCase()} — ${squadronName.toUpperCase()}`,
    0.25,
    0.25 + points(14 * 1.15),
    {
      align: 'left',
      baseline: 'top',
    }
  )
}

function drawStats(
  doc: jsPDF,
  ship: Ship,
  statsFontSize: number,
  headerTextTop: number,
  textTop: number
) {
  doc.setFontSize(statsFontSize)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor('#000000')
  drawTextColumns(doc, ['Spd', 'Def', 'FP', 'Plt'], headerTextTop)
  doc.setFont('helvetica', 'normal')
  drawTextColumns(
    doc,
    [
      ship.speed.toString(),
      ship.defense.toString(),
      ship.weapons.map((w) => formatWeapon(w)),
      ship.pilot?.toString() ?? '-',
    ],
    textTop
  )
}

function drawUpgrades(doc: jsPDF, ship: Ship, fontSize: number, top: number) {
  doc.setFontSize(fontSize)
  doc.setFont('helvetica', 'italic')
  const joined = formatUpgrades(
    coalesceDuplicateUpgrades(ship.upgrades),
    '\xa0'
  )
  const wrapped = doc.splitTextToSize(joined, 4.125)
  doc.text(wrapped, 2.5, top, { align: 'center', baseline: 'top' })
}

function drawLocations(doc: jsPDF, fontSize: number, textTop: number) {
  doc.setFontSize(fontSize)
  doc.setFont('helvetica', 'italic')
  drawTextColumns(
    doc,
    [
      ['Crew', '(2/12)'],
      ['Engine', '(3/11)'],
      ['Weapon', '(4/10)'],
      ['Systems', '(5/9)'],
      ['Structure', '(6/8)'],
    ],
    textTop
  )
}

function drawTextColumns(
  doc: jsPDF,
  text: (string | string[])[],
  location: number
) {
  const columnWidth = 4.5 / text.length
  for (let i = 0; i < text.length; i++) {
    const x = 0.25 + columnWidth / 2 + i * columnWidth
    doc.text(text[i], x, location, {
      align: 'center',
      baseline: 'top',
    } as TextOptionsLight)
  }
}

function points(x: number): number {
  return x / 72.0
}

function calculateHeight(...lines: number[]): number {
  const sum = lines.reduce((a, l) => a + l, 0)
  return sum * 1.15
}
