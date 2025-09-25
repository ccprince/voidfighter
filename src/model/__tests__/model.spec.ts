import { describe, expect, it } from 'vitest'
import {
  Corvette,
  Gunship,
  Rating,
  Snubfighter,
  SquadronTrait,
  Stat,
  Weapon,
  WeaponArc,
} from '../model.ts'

describe('Defense stat', () => {
  it.each([
    { ship: Snubfighter(), expected: new Stat(Rating.D6) },
    { ship: Gunship(), expected: new Stat(Rating.D8) },
    { ship: Corvette(), expected: new Stat(Rating.D10) },
    {
      ship: Corvette({ upgrades: ['Shields'] }),
      expected: new Stat(Rating.D10, 1),
    },
    {
      ship: Corvette({ squadronTrait: SquadronTrait.Rugged }),
      expected: new Stat(Rating.D10, 1),
    },
    {
      ship: Corvette({
        squadronTrait: SquadronTrait.Rugged,
        upgrades: ['Shields'],
      }),
      expected: new Stat(Rating.D10, 2),
    },
  ])('$ship.shipType -> $expected', ({ ship, expected }) => {
    expect(ship.defense).toEqual(expected)
  })
})

describe('Pilot stat', () => {
  it.each([
    { ship: Gunship({ pilotBase: Rating.D8 }), expected: new Stat(Rating.D8) },
    {
      ship: Gunship({ pilotBase: Rating.D8, upgrades: ['Agile'] }),
      expected: new Stat(Rating.D8, 1),
    },
    { ship: Gunship(), expected: null },
    {
      ship: Gunship({
        pilotBase: Rating.D8,
        squadronTrait: SquadronTrait.Hotshots,
      }),
      expected: new Stat(Rating.D8, 1),
    },
  ])('$ship -> $expected', ({ ship, expected }) => {
    expect(ship.pilot).toEqual(expected)
  })
})

describe('Stat', () => {
  it.each([
    [new Stat(Rating.D8), '2d8'],
    [new Stat(Rating.D10, -1), '2d10-1'],
    [new Stat(Rating.D12, 2), '2d12+2'],
  ])('$1', (stat, expected) => {
    expect(stat.toString()).toEqual(expected)
  })
})

describe('Weapons', () => {
  it('converts ratings to stats', () => {
    let ship = Corvette({
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Front },
        { firepower: Rating.D10, arc: WeaponArc.Rear },
      ],
    })
    expect(ship.weapons).toEqual([
      new Weapon(new Stat(Rating.D10), WeaponArc.Front),
      new Weapon(new Stat(Rating.D10), WeaponArc.Rear),
    ])
  })

  it('adds bonus for Targeting Computer', () => {
    let ship = Corvette({
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Front },
        { firepower: Rating.D10, arc: WeaponArc.Rear },
      ],
      upgrades: ['Targeting Computer'],
    })
    expect(ship.weapons).toEqual([
      new Weapon(new Stat(Rating.D10, 1), WeaponArc.Front),
      new Weapon(new Stat(Rating.D10, 1), WeaponArc.Rear),
    ])
  })

  it('adds bonus for Berserker Intelligence trait', () => {
    let ship = Corvette({
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Front },
        { firepower: Rating.D10, arc: WeaponArc.Rear },
      ],
      squadronTrait: SquadronTrait.BersekerIntelligence,
    })
    expect(ship.weapons).toEqual([
      new Weapon(new Stat(Rating.D10, 1), WeaponArc.Front),
      new Weapon(new Stat(Rating.D10, 1), WeaponArc.Rear),
    ])
  })

  it('adds both TC and BI bonuses', () => {
    let ship = Corvette({
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Front },
        { firepower: Rating.D10, arc: WeaponArc.Rear },
      ],
      upgrades: ['Targeting Computer'],
      squadronTrait: SquadronTrait.BersekerIntelligence,
    })
    expect(ship.weapons).toEqual([
      new Weapon(new Stat(Rating.D10, 2), WeaponArc.Front),
      new Weapon(new Stat(Rating.D10, 2), WeaponArc.Rear),
    ])
  })
})
