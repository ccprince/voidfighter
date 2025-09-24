import { describe, expect, it } from 'vitest'
import { costWithoutPilot, costWithPilot } from '../cost.ts'
import { Corvette, Gunship, Rating, Snubfighter, WeaponArc } from '../model.ts'

describe('Cost without pilot', () => {
  it.each([
    { ship: Snubfighter({ speed: 2 }), expected: 5 },
    { ship: Snubfighter({ speed: 3 }), expected: 7 },
    { ship: Gunship({ speed: 1 }), expected: 5 },
    { ship: Gunship({ speed: 2 }), expected: 7 },
    { ship: Corvette(), expected: 9 },
  ])('$ship -> $expected', ({ ship, expected }) => {
    expect(costWithoutPilot(ship)).toEqual(expected)
  })
})

describe('Cost with pilot', () => {
  it.each([
    { pilot: Rating.D6, expected: 6 },
    { pilot: Rating.D8, expected: 8 },
    { pilot: Rating.D10, expected: 10 },
    { pilot: null, expected: 5 },
  ])('$pilot -> $expected', ({ pilot, expected }) => {
    const ship = Gunship({ pilotBase: pilot })
    expect(costWithPilot(ship)).toEqual(expected)
  })
})

describe('Cost with weapons', () => {
  it.each([
    [
      Gunship({
        speed: 1,
        weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      }),
      9,
    ],
    [
      Gunship({
        speed: 1,
        weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Turret }],
      }),
      9,
    ],
    [
      Gunship({
        speed: 1,
        weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.EnhancedTurret }],
      }),
      10,
    ],
    [
      Corvette({
        weaponsBase: [
          { firepower: Rating.D10, arc: WeaponArc.Front },
          { firepower: Rating.D8, arc: WeaponArc.Rear },
          { firepower: Rating.D8, arc: WeaponArc.EnhancedTurret },
        ],
      }),
      24,
    ],
  ])('%o -> %d', (ship, expected) => {
    expect(costWithoutPilot(ship)).toEqual(expected)
  })
})

describe('Cost with upgrades', () => {
  it.each([
    { ship: Corvette({ upgrades: ['Shields'] }), cost: 10 },
    { ship: Corvette({ upgrades: ['Shields', 'Maneuverable'] }), cost: 11 },
    {
      ship: Corvette({
        upgrades: ['Shields', 'Maneuverable', 'Tractor Beam', 'Transport'],
      }),
      cost: 11,
    },
    { ship: Corvette({ upgrades: ['Tractor Beam', 'Transport'] }), cost: 9 },
  ])('$ship -> $cost', ({ ship, cost }) => {
    expect(costWithoutPilot(ship)).toEqual(cost)
  })
})
