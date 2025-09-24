import { Rating, Ship, ShipType, Weapon, WeaponArc } from './model.ts'

export function validateShip(ship: Ship): string[] {
  return [
    validateSpeed(ship),
    validateDefense(ship),
    ...validateWeapons(ship),
  ].filter(x => x !== null)
}

function validateSpeed(ship: Ship): string | null {
  const min = ship.shipType == ShipType.Snubfighter ? 2 : 1
  let max: number
  if (ship.shipType === ShipType.Corvette)
    max = 1
  else if (ship.shipType === ShipType.Gunship)
    max = 2
  else
    max = 3

  return ship.speed >= min && ship.speed <= max ? null : `Speed is ${ship.speed}, but must be between ${min} and ${max}`
}

function validateDefense(ship: Ship): string | null {
  if (ship.shipType === ShipType.Snubfighter && ship.defense.rating !== Rating.D6)
    return `Defense is ${ship.defense.rating}, but defense for a Snubfighter must be 2d6`
  else if (ship.shipType === ShipType.Gunship && ship.defense.rating !== Rating.D8)
    return `Defense is ${ship.defense.rating}, but defense for a Gunship must be 2d8`
  else if (ship.shipType === ShipType.Corvette && ship.defense.rating !== Rating.D10)
    return `Defense is ${ship.defense.rating}, but defense for a Corvette must be 2d10`
  else
    return null
}

function validateWeapons(ship: Ship): string[] {
  switch (ship.shipType) {
    case ShipType.Snubfighter:
      return validateSnubfighterWeapons(ship)
    case ShipType.Gunship:
      return validateGunshipWeapons(ship)
    case ShipType.Corvette:
      return validateCorvetteWeapons(ship)
  }
}

function validateSnubfighterWeapons(ship: Ship): string[] {
  if (ship.weapons.length < 1)
    return ["Snubfighters must carry at least one weapon"]
  else if (ship.weapons.length > 2)
    return ["Snubfighters may not carry more than two weapons"]

  let results: string[] = []

  if (countByRating(ship.weapons, Rating.D10) > 0)
    results.push("Snubfighters may not carry 2d10 weapons")
  if (countByRating(ship.weapons, Rating.D8) > 1)
    results.push("Snubfighters may only carry one 2d8 weapon")

  if (ship.weapons[0].arc !== WeaponArc.Front)
    results.push("A Snubfighter's first weapon must fire forward")
  if (ship.weapons.length === 2 && ship.weapons[1].arc === WeaponArc.Front)
    results.push("A Snubfighter's second weapon must not fire forward")

  return results
}

function validateGunshipWeapons(ship: Ship): string[] {
  let results: string[] = []

  if (ship.weapons.length > 2)
    results.push('Gunships may not carry more than two weapons')
  if (countByRating(ship.weapons, Rating.D10) > 1)
    results.push('Gunships may not carry more than one 2d10 weapon')

  return results
}

function validateCorvetteWeapons(ship: Ship): string[] {
  let results: string[] = []

  if (ship.weapons.length > 3)
    results.push('Corvettes may not carry more than three weapons')
  if (countByRating(ship.weapons, Rating.D6) > 0)
    results.push('Corvettes may not carry 2d6 weapons')

  return results
}

function countByRating(weapons: Weapon[], rating: Rating): number {
  return weapons.filter(w => w.firepower.rating === rating).length
}
