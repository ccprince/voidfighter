import { coalesceDuplicateUpgrades, formatUpgrades } from '@/helpers'
import { costWithoutPilot, costWithPilot } from '@/model/cost'
import type { Ship } from '@/model/model'
import { formatWeapon } from '@/model/printable'
import type jsPDF from 'jspdf'
import type { TextOptionsLight } from 'jspdf'

export function points(x: number): number {
  return x / 72.0
}

export function calculateHeight(...lines: number[]): number {
  const sum = lines.reduce((a, l) => a + l, 0)
  return sum * 1.15
}

export type Dimensions = {
  startX: number
  startY: number
  width: number
}

export type Landmarks = {
  headerTextTop: number
  statsHeaderTopLine: number
  statsTopLine: number
  statsBottomLine: number
  statsHeaderTopText: number
  statsTextTop: number
  upgradesTop: number
  locationsTopLine: number
  locationsTextTop: number
  bottomLine: number
}

export type FontSizes = {
  shipName: number
  shipType: number
  stats: number
  upgrades: number
  locations: number
}

export function drawShipCard(
  doc: jsPDF,
  ship: Ship,
  squadronName: string | null,
  dimensions: Dimensions,
  fontSizes: FontSizes,
  landmarks: Landmarks,
  drawEnclosure: boolean = false
) {
  drawBoxes(doc, dimensions, landmarks, drawEnclosure)
  drawHeader(
    doc,
    dimensions,
    landmarks,
    fontSizes,
    squadronName,
    ship,
    drawEnclosure ? points(2) : 0
  )
  drawStats(
    doc,
    ship,
    dimensions,
    fontSizes,
    landmarks.statsHeaderTopText,
    landmarks.statsTextTop
  )
  drawUpgrades(doc, ship, dimensions, fontSizes.upgrades, landmarks.upgradesTop)
  drawLocations(
    doc,
    dimensions,
    fontSizes.locations,
    landmarks.locationsTextTop
  )
}

export function drawBoxes(
  doc: jsPDF,
  dimensions: Dimensions,
  {
    statsHeaderTopLine,
    statsTopLine,
    statsBottomLine,
    locationsTopLine,
    bottomLine,
  }: Landmarks,
  drawEnclosure: boolean = false
) {
  const { startX, startY, width } = dimensions
  doc.setFillColor('#d7deeb')
  doc.rect(
    startX,
    statsHeaderTopLine,
    width,
    statsTopLine - statsHeaderTopLine,
    'F'
  )
  doc.rect(startX, locationsTopLine, width, bottomLine - locationsTopLine, 'F')

  if (drawEnclosure) {
    doc.rect(startX, startY, width, bottomLine - startY)
  }
  doc.rect(startX, statsHeaderTopLine, width, bottomLine - statsHeaderTopLine)
  doc.line(startX, statsTopLine, startX + width, statsTopLine)
  drawColumns(doc, dimensions, statsHeaderTopLine, statsBottomLine, 4)
  doc.line(startX, statsBottomLine, startX + width, statsBottomLine)

  doc.line(startX, locationsTopLine, startX + width, locationsTopLine)
  drawColumns(doc, dimensions, locationsTopLine, bottomLine, 5)
}

export function drawColumns(
  doc: jsPDF,
  { startX, width }: Dimensions,
  top: number,
  bottom: number,
  count: number
) {
  const columnWidth = width / count
  for (let x = startX + columnWidth; x < width; x += columnWidth) {
    doc.line(x, top, x, bottom)
  }
}

export function drawHeader(
  doc: jsPDF,
  dimensions: Dimensions,
  { headerTextTop }: Landmarks,
  fontSizes: FontSizes,
  squadronName: string | null,
  ship: Ship,
  padding: number
) {
  const { startX, startY, width } = dimensions
  doc.setTextColor('#000000')
  doc.setFontSize(fontSizes.shipName)
  doc.setFont('helvetica', 'bolditalic')
  doc.text(ship.name.toUpperCase(), startX + padding, headerTextTop, {
    align: 'left',
    baseline: 'top',
  })
  doc.setFont('helvetica', 'bold')
  doc.text(
    `${costWithoutPilot(ship)} (${costWithPilot(ship)})`,
    startX + width - padding,
    headerTextTop,
    {
      align: 'right',
      baseline: 'top',
    }
  )

  doc.setFontSize(fontSizes.shipType)
  doc.setTextColor('#444444')
  doc.setFont('helvetica', 'italic')
  doc.text(
    `${ship.shipType.toUpperCase()}${squadronName ? ' — ' + squadronName.toUpperCase() : ''}`,
    startX + padding,
    headerTextTop + points(14 * 1.15),
    {
      align: 'left',
      baseline: 'top',
    }
  )
}

export function drawStats(
  doc: jsPDF,
  ship: Ship,
  dimensions: Dimensions,
  fontSizes: FontSizes,
  headerTextTop: number,
  textTop: number
) {
  doc.setFontSize(fontSizes.stats)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor('#000000')
  drawTextColumns(doc, dimensions, ['Spd', 'Def', 'FP', 'Plt'], headerTextTop)
  doc.setFont('helvetica', 'normal')
  drawTextColumns(
    doc,
    dimensions,
    [
      ship.speed.toString(),
      ship.defense.toString(),
      ship.weapons.map((w) => formatWeapon(w)),
      ship.pilot?.toString() ?? '-',
    ],
    textTop
  )
}

export function drawLocations(
  doc: jsPDF,
  dimensions: Dimensions,
  fontSize: number,
  textTop: number
) {
  doc.setFontSize(fontSize)
  doc.setFont('helvetica', 'italic')
  drawTextColumns(
    doc,
    dimensions,
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

export function drawUpgrades(
  doc: jsPDF,
  ship: Ship,
  { startX, width }: Dimensions,
  fontSize: number,
  top: number
) {
  doc.setFontSize(fontSize)
  doc.setFont('helvetica', 'italic')
  const joined = formatUpgrades(
    coalesceDuplicateUpgrades(ship.upgrades),
    '\xa0'
  )
  const wrapped = doc.splitTextToSize(joined, width - 0.375)
  doc.text(wrapped, startX + width / 2, top, {
    align: 'center',
    baseline: 'top',
  })
}

export function drawTextColumns(
  doc: jsPDF,
  { startX, width }: Dimensions,
  text: (string | string[])[],
  location: number
) {
  const columnWidth = width / text.length
  for (let i = 0; i < text.length; i++) {
    const x = startX + columnWidth / 2 + i * columnWidth
    doc.text(text[i], x, location, {
      align: 'center',
      baseline: 'top',
    } as TextOptionsLight)
  }
}
