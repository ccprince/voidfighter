import { describe, expect, it } from 'vitest'
import { costWithoutPilot, costWithPilot } from '../cost'
import {
  Corvette,
  Gunship,
  Rating,
  ShipType,
  Snubfighter,
  Stat,
  WeaponArc,
} from '../model'
import { parsePrintable } from '../printable'

describe('Basic parsing', () => {
  it.each([
    {
      input: 'Simple (snubfighter) 11 (14):2:2d6:2d8:2d8:Repair,Shields',
      expected: Snubfighter({
        name: 'Simple',
        speed: 2,
        weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
        pilotBase: Rating.D8,
        upgrades: ['Repair', 'Shields'],
      }),
    },
    {
      input: 'Simple2 (gunship) 9 (10):1:2d8:2d6T:2d8:Ground Support,Repair',
      expected: Gunship({
        name: 'Simple2',
        speed: 1,
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Turret }],
        pilotBase: Rating.D8,
        upgrades: ['Ground Support', 'Repair'],
      }),
    },
    {
      input:
        'Simple3 (corvette) 20 (21):1:2d10:2d8,2d8T:2d6:Carrier,Reinforced Hull,Targeting Computer',
      expected: Corvette({
        name: 'Simple3',
        weaponsBase: [
          { firepower: Rating.D8, arc: WeaponArc.Front },
          { firepower: Rating.D8, arc: WeaponArc.Turret },
        ],
        pilotBase: Rating.D6,
        upgrades: ['Carrier', 'Reinforced Hull', 'Targeting Computer'],
      }),
    },
  ])('$0', ({ input, expected }) => {
    expect(parsePrintable(input)).toEqual(expected)
  })
})

describe('Ignores points', () => {
  it.each(['11 (14)', '22 (28)', 'ab (cd)', 'abcde', ''])('$0', (points) => {
    const input = `Simple (snubfighter) ${points}:2:2d6:2d8:2d8:Repair,Shields`
    const parsed = parsePrintable(input)
    expect(costWithoutPilot(parsed)).toEqual(11)
    expect(costWithPilot(parsed)).toEqual(14)
  })
})

describe('Ignores defense', () => {
  it.each(['2d8', '2d4', '123', ''])('$0', (defense) => {
    const input = `Simple2 (gunship) 9 (10):1:${defense}:2d6T:2d6:Ground Support,Repair`
    expect(parsePrintable(input).defense).toEqual(new Stat(Rating.D8))
  })
})

describe('Ignores case of ship type', () => {
  it.each([
    { inputType: 'snubfighter', expected: ShipType.Snubfighter },
    { inputType: 'Snubfighter', expected: ShipType.Snubfighter },
    { inputType: 'SNUBFiGhTeR', expected: ShipType.Snubfighter },
  ])('$0 $1', ({ inputType, expected }) => {
    const input = `Simple (${inputType}) 11 (14):2:2d6:2d8:2d8:Repair,Shields`
    expect(parsePrintable(input).shipType).toEqual(expected)
  })
})

describe('Ignores case of weapon arc', () => {
  it.each([
    { weapon: '2d8t', expected: WeaponArc.Turret },
    { weapon: '2d8r', expected: WeaponArc.Rear },
    { weapon: '2d8e', expected: WeaponArc.EnhancedTurret },
  ])('$0', ({ weapon, expected }) => {
    const input = `Simple3 (corvette) 20 (21):1:2d10:${weapon}:2d6:Carrier,Reinforced Hull,Targeting Computer`
    expect(parsePrintable(input).weapons[0].arc).toEqual(expected)
  })
})

describe('Ignores weapon modifier', () => {
  it.each(['+1', '+999', '+a'])('$0', (modifier) => {
    const input = `Simple (snubfighter) 11 (14):2:2d6:2d8${modifier}:2d8:Repair,Shields`
    expect(parsePrintable(input).weapons[0].firepower.modifier).toEqual(0)
  })
})

describe('Ignores pilot modifier', () => {
  it.each(['+1', '+999', '+a'])('$0', (modifier) => {
    const input = `Simple (snubfighter) 11 (14):2:2d6:2d8:2d8${modifier}:Repair,Shields`
    expect(parsePrintable(input).pilot!.modifier).toEqual(0)
  })
})

describe.todo('Ignores upgrade case')
describe.todo('Ignores upgrade spacing')

it('Alphabetizes upgrades', () => {
  const input = 'Simple (snubfighter) 11 (14):2:2d6:2d8:2d8:Shields,Repair'
  expect(parsePrintable(input).upgrades).toEqual(['Repair', 'Shields'])
})

it('Handles missing upgrades', () => {
  const input = 'Simple (snubfighter) 11 (14):2:2d6:2d8:2d8'
  expect(parsePrintable(input).upgrades).toEqual([])
})
