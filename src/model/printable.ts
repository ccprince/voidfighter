import { costWithoutPilot, costWithPilot } from './cost.ts'
import {
  defenseRatingByType,
  Rating,
  Ship,
  ShipType,
  Weapon,
  WeaponArc,
  type UpgradeKeys,
  type WeaponBase,
} from './model.ts'

export function printableVersion(ship: Ship): string {
  const nameBlock = `${ship.name} (${ship.shipType.toString().toLowerCase()}) ${costWithoutPilot(ship)} (${costWithPilot(ship)})`
  const weaponBlock = ship.weapons.map(formatWeapon).join(',')
  const upgradesBlock = ship.upgrades.join(',')

  return `${nameBlock}:${ship.speed}:${ship.defense}:${weaponBlock}:${ship.pilot}:${upgradesBlock}`
}

export function formatWeapon(w: Weapon): string {
  let arc: string
  if (w.arc === WeaponArc.Turret) arc = 'T'
  else if (w.arc === WeaponArc.EnhancedTurret) arc = 'E'
  else if (w.arc === WeaponArc.Rear) arc = 'R'
  else arc = ''

  return `${w.firepower}${arc}`
}

export function parsePrintable(input: string): Ship {
  const [
    nameAndTypeBlock,
    speedBlock,
    ,
    weaponsBlock,
    pilotBlock,
    upgradesBlock,
  ] = input.split(':')
  const [name, shipType] = parseNameAndType(nameAndTypeBlock)
  const speed = parseInt(speedBlock)
  const weapons = parseWeapons(weaponsBlock)
  const pilotRating = extractRating(pilotBlock)
  const upgrades = upgradesBlock
    ? (upgradesBlock.split(',') as UpgradeKeys[])
    : []
  upgrades.sort()

  return new Ship(
    name,
    shipType,
    speed,
    defenseRatingByType(shipType),
    weapons,
    pilotRating,
    upgrades,
    null
  )
}

function parseNameAndType(block: string): [string, ShipType] {
  const openIndex = block.indexOf('(')
  const closeIndex = block.indexOf(')')
  const name = block.substring(0, openIndex).trim()
  const shipTypeStr = block.slice(openIndex + 1, closeIndex).toUpperCase()
  return [name, shipTypeStr.toUpperCase() as ShipType]
}

function extractRating(s: String): Rating {
  const dIndex = s.toLowerCase().indexOf('d')
  const value = parseInt(s.substring(dIndex + 1))
  switch (value) {
    case 6:
      return Rating.D6
    case 8:
      return Rating.D8
    default:
      return Rating.D10
  }
}

function parseWeapons(w: string): WeaponBase[] {
  if (!w) return []

  return w.split(',').map((s) => {
    const firepower = extractRating(s)
    let arc: WeaponArc
    switch (s.slice(-1).toUpperCase()) {
      case 'T':
        arc = WeaponArc.Turret
        break
      case 'E':
        arc = WeaponArc.EnhancedTurret
        break
      case 'R':
        arc = WeaponArc.Rear
        break
      default:
        arc = WeaponArc.Front
    }
    return { firepower, arc }
  })
}
