import { Rating, Ship, ShipType } from './model.ts'

export function validateShip(ship: Ship): string[] {
  return [
    validateSpeed(ship),
    validateDefense(ship),
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
