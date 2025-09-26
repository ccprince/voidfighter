import { costWithoutPilot, costWithPilot } from './cost.ts'
import { Ship, Weapon, WeaponArc } from './model.ts'

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
