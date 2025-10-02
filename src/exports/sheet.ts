import { coalesceDuplicateUpgrades, formatUpgrades } from '@/helpers'
import { costWithoutPilot, costWithPilot } from '@/model/cost'
import type { Ship, SquadronTrait } from '@/model/model'
import jsPDF from 'jspdf'
import {
  calculateHeight,
  drawShipCard,
  points,
  type FontSizes,
  type Landmarks,
} from './common'

export function exportAsPdfSheet(
  squadronName: string | null,
  squadronTrait: SquadronTrait | null,
  leaderTrait: string | null,
  ships: Ship[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'in',
    format: [8.5, 11],
  })

  doc.setLineWidth(points(1))
  doc.setDrawColor('#444444')
  const fontSizes: FontSizes = {
    shipName: 12,
    shipType: 10,
    stats: 10,
    upgrades: 10,
    locations: 9,
  }
  const pageHeaderFontSize = 20
  const pageSubHeaderFontSize = 14
  drawPageHeader(
    doc,
    squadronName,
    squadronTrait,
    leaderTrait,
    ships,
    pageHeaderFontSize,
    pageSubHeaderFontSize
  )

  let width = 3.625
  let x = 0.5
  const topY =
    0.5 +
    points(
      calculateHeight(
        pageHeaderFontSize,
        pageSubHeaderFontSize,
        pageSubHeaderFontSize
      ) + 4
    )

  let page = 1
  let y = topY
  for (const ship of ships) {
    const joinedUpgrades = formatUpgrades(
      coalesceDuplicateUpgrades(ship.upgrades),
      '\xa0'
    )
    doc.setFontSize(fontSizes.upgrades)
    const upgrades = doc.splitTextToSize(joinedUpgrades, width)
    let landmarks = calculateLandmarks(
      y,
      fontSizes,
      ship.weapons.length,
      upgrades.length
    )

    if (landmarks.bottomLine > 10.5) {
      if (x < 4.25) {
        x = 8.0 - width
        y = page === 1 ? topY : 0.5
      } else {
        doc.addPage()
        page++
        doc.setFont('helvetica', 'bolditalic')
        doc.setFontSize(pageHeaderFontSize)
        doc.text(squadronName?.toUpperCase() ?? 'UNNAMED SQUADRON', 0.5, 0.5, {
          align: 'left',
          baseline: 'top',
        })
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(12)
        doc.text(`Page ${page}`, 8.0, 0.5, { align: 'right', baseline: 'top' })
        x = 0.5
        y = 0.5 + points(calculateHeight(pageHeaderFontSize) + 4)
      }
      landmarks = calculateLandmarks(
        y,
        fontSizes,
        ship.weapons.length,
        upgrades.length
      )
    }

    const dimensions = { startX: x, startY: y, width }
    doc.line(x, y, x + width, y)
    drawShipCard(doc, ship, null, dimensions, fontSizes, landmarks, true)
    y = landmarks.bottomLine + 0.25
  }

  doc.save((squadronName ?? 'squadron') + '.pdf')
}

function calculateLandmarks(
  startY: number,
  fontSize: FontSizes,
  numberOfWeapons: number,
  linesOfUpgrades: number
): Landmarks {
  const headerTextTop = startY + points(2)
  const statsHeaderTopLine =
    headerTextTop +
    points(calculateHeight(fontSize.shipName, fontSize.shipType) + 4)
  const statsTopLine =
    statsHeaderTopLine + points(calculateHeight(fontSize.stats) + 3)
  const statsBottomLine =
    statsTopLine +
    points(calculateHeight(fontSize.stats * Math.max(numberOfWeapons, 1)) + 2)
  const statsHeaderTopText = statsHeaderTopLine + points(2)
  const statsTopText =
    statsHeaderTopText + points(calculateHeight(fontSize.stats) + 3)
  const upgradesTop = statsBottomLine + points(4)
  const locationsTopLine =
    upgradesTop +
    points(
      calculateHeight(fontSize.upgrades * Math.max(linesOfUpgrades, 1)) + 2
    )
  const locationsTextTop = locationsTopLine + points(2)
  const bottomLine =
    locationsTextTop + points(calculateHeight(fontSize.locations) * 2 + 2)

  return {
    headerTextTop,
    statsHeaderTopLine,
    statsTopLine,
    statsBottomLine,
    statsHeaderTopText,
    statsTextTop: statsTopText,
    upgradesTop,
    locationsTopLine,
    locationsTextTop,
    bottomLine,
  }
}

function drawPageHeader(
  doc: jsPDF,
  squadronName: string | null,
  squadronTrait: SquadronTrait | null,
  leaderTrait: string | null,
  ships: Ship[],
  headerFontSize: number,
  subHeaderFontSize: number
) {
  doc.setFontSize(headerFontSize)
  doc.setFont('helvetica', 'bolditalic')
  doc.text(squadronName?.toUpperCase() ?? 'UNNAMED SQUADRON', 0.5, 0.5, {
    align: 'left',
    baseline: 'top',
  })

  doc.setFont('helvetica', 'bold')
  const totalWithoutPilots = ships.reduce((a, s) => a + costWithoutPilot(s), 0)
  const totalWithPilots = ships.reduce((a, s) => a + costWithPilot(s), 0)
  doc.text(`${totalWithoutPilots} (${totalWithPilots})`, 8.0, 0.5, {
    align: 'right',
    baseline: 'top',
  })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(subHeaderFontSize)
  const subHeaderTextTop = 0.5 + points(calculateHeight(headerFontSize))
  doc.text(
    `SQUADRON TRAIT: ${squadronTrait?.toUpperCase() ?? 'NONE'}`,
    0.5,
    subHeaderTextTop,
    { align: 'left', baseline: 'top' }
  )
  doc.text(
    `LEADER TRAIT: ${leaderTrait?.toUpperCase() ?? 'NONE'}`,
    0.5,
    subHeaderTextTop + points(calculateHeight(subHeaderFontSize)),
    {
      align: 'left',
      baseline: 'top',
    }
  )
}
