import { describe, expect, it } from 'vitest'
import { Corvette, Gunship, Rating, Ship, ShipType, Snubfighter } from '../model.ts'
import { validateShip } from '../validation.ts'

describe('Validate speed', () => {
  describe('for valid ships', () => {
    it.each([
      Snubfighter({ speed: 3 }),
      Gunship({ speed: 2 }),
      Corvette(),
    ])('%s', (ship) => {
      expect(validateShip(ship)).toEqual([])
    })
  })

  describe('for invalid ships', () => {
    it.each([
      [Snubfighter(), 1, "Speed is 1, but must be between 2 and 3"],
      [Gunship(), 3, "Speed is 3, but must be between 1 and 2"],
      [Corvette(), 2, "Speed is 2, but must be between 1 and 1"],
    ])('$0, $1 -> $2', (ship, newSpeed, expected) => {
      ship.speed = newSpeed
      const errors = validateShip(ship)
      expect(errors).toContain(expected)
    })
  })
})

describe('Validate defense', () => {
  it.each([
    [ShipType.Snubfighter, 2, "Defense is 2d4, but defense for a Snubfighter must be 2d6"],
    [ShipType.Gunship, 2, "Defense is 2d4, but defense for a Gunship must be 2d8"],
    [ShipType.Corvette, 1, "Defense is 2d4, but defense for a Corvette must be 2d10"],
  ])('%0 -> %1', (shipType, speed, expected) => {
    let ship = new Ship("Testing", shipType, speed, Rating.D4)
    expect(validateShip(ship)).toContain(expected)
  })
})
