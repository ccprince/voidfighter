import {
  Rating,
  Ship,
  UPGRADES,
  Weapon,
  WeaponArc,
  type UpgradeKeys,
} from './model.ts'

export function costWithoutPilot(ship: Ship): number {
  return (
    speedCost(ship.speed) +
    defenseCost(ship.defense.rating) +
    weaponsCost(ship.weapons) +
    upgradesCost(ship.upgrades)
  )
}
function speedCost(speed: number): number {
  if (speed == 1) return 1
  else if (speed == 2) return 3
  else if (speed == 3) return 5
  else return 0
}

function defenseCost(defense: Rating): number {
  if (defense == Rating.D6) return 2
  else if (defense == Rating.D8) return 4
  else if (defense == Rating.D10) return 8
  else return 0
}

function weaponsCost(weapons: Weapon[]): number {
  function cost(w: Weapon): number {
    let cost = w.arc === WeaponArc.EnhancedTurret ? 1 : 0
    if (w.firepower.rating === Rating.D6) cost += 2
    else if (w.firepower.rating === Rating.D8) cost += 4
    else cost += 6
    return cost
  }
  return weapons.reduce((acc, w) => acc + cost(w), 0)
}

function upgradesCost(upgrades: UpgradeKeys[]): number {
  return upgrades.reduce(
    (acc: number, key: UpgradeKeys) => acc + UPGRADES[key].cost,
    0
  )
}
