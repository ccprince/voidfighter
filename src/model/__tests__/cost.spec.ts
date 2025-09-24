import { describe, expect, it } from 'vitest'
import { costWithoutPilot } from '../cost.ts'
import { Corvette, Gunship, Rating, Snubfighter, WeaponArc } from '../model.ts'

describe('Cost without pilot', () => {
  describe('of a Snubfighter', () => {
    it.each([
      [{ speed: 2 }, 5],
      [{ speed: 3 }, 7],
    ])('$0 -> $1', (options, expected) => {
      expect(costWithoutPilot(Snubfighter(options))).toEqual(expected)
    })
  })

  describe('of a Gunship', () => {
    it.each([
      [{ speed: 1 }, 5],
      [{ speed: 2 }, 7],
    ])('$0 -> $1', (options, expected) => {
      expect(costWithoutPilot(Gunship(options))).toEqual(expected)
    })
  })

  describe('of a Corvette', () => {
    it.each([[{}, 9]])('$0 -> $1', (options, expected) => {
      expect(costWithoutPilot(Corvette(options))).toBe(expected)
    })
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
