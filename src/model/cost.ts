import { Rating, Ship } from './model.ts'

export function costWithoutPilot(ship: Ship): number {
  return speedCost(ship.speed) + defenseCost(ship.defense.rating)
}
function speedCost(speed: number): number {
  if (speed == 1)
    return 1
  else if (speed == 2)
    return 3
  else if (speed == 3)
    return 5
  else
    return 0
}

function defenseCost(defense: Rating): number {
  if (defense == Rating.D6)
    return 2
  else if (defense == Rating.D8)
    return 4
  else if (defense == Rating.D10)
    return 6
  else
    return 0
}
