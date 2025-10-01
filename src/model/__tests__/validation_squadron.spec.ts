import { describe, expect, it } from 'vitest'
import { costWithPilot } from '../cost'
import { Gunship, Rating, Ship, Snubfighter, WeaponArc } from '../model'
import { validateSquadron } from '../validation'

describe('Number of ships in the squadron', () => {
  function buildShips(n: number): Ship[] {
    let ships: Ship[] = []
    for (let i = 0; i < n; i++) {
      ships.push(
        Snubfighter({
          weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
        })
      )
    }
    return ships
  }
  it('must be at least four', () => {
    const [squadronResults, perShipResults] = validateSquadron(buildShips(3))
    expect(squadronResults).toEqual([
      'A squadron must contain at least four ships',
    ])
    expect(perShipResults).toEqual([[], [], []])
  })
  it('must be at most sixteen', () => {
    const [squadronResults, perShipResults] = validateSquadron(buildShips(17))
    expect(squadronResults).toEqual([
      'A squadron must contain at most 16 ships',
    ])
    expect(perShipResults).toHaveLength(17)
    for (const psr of perShipResults) {
      expect(psr).toEqual([])
    }
  })
  it("doesn't cause an error at zero", () => {
    expect(validateSquadron([])).toEqual([[], []])
  })
})

describe('Squadron must be 50% snubfighters by points', () => {
  const snub6 = Snubfighter({
    speed: 1,
    weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
    pilotBase: Rating.D6,
  })
  const gun24 = Gunship({
    speed: 2,
    weaponsBase: [
      { firepower: Rating.D10, arc: WeaponArc.Front },
      { firepower: Rating.D8, arc: WeaponArc.Rear },
    ],
    pilotBase: Rating.D10,
    upgrades: ['Tailgunner', 'Fast'],
  })

  describe('(precondition - points check)', () => {
    it.each([
      { ship: snub6, expected: 6 },
      { ship: gun24, expected: 24 },
    ])('$ship -> $expected points', ({ ship, expected }) => {
      expect(costWithPilot(ship)).toEqual(expected)
    })
  })

  it.each([
    { squadron: [gun24, gun24, gun24, gun24], valid: false },
    { squadron: [snub6, snub6, snub6, gun24], valid: false },
    { squadron: [snub6, snub6, snub6, snub6, gun24], valid: true },
  ])('%o', ({ squadron, valid }) => {
    expect(validateSquadron(squadron)).toEqual(
      valid
        ? [[], [[], [], [], [], []]]
        : [
            ['A squadron must contain at least 50% snubfighters, by points'],
            [[], [], [], []],
          ]
    )
  })
})

describe('Rarity of upgrades', () => {
  it('accepts three ships with the same Uncommon upgrade', () => {
    const covertShip = Snubfighter({
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      upgrades: ['Stealth'],
    })
    const overtShip = Snubfighter({
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
    })
    expect(
      validateSquadron([covertShip, covertShip, covertShip, overtShip])
    ).toEqual([[], new Array(4).fill([])])
  })

  it('rejects four ships with the same Uncommon upgrade', () => {
    const covertShip = Snubfighter({
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      upgrades: ['Stealth'],
    })
    const [squadronResults, perShipResults] = validateSquadron([
      covertShip,
      covertShip,
      covertShip,
      covertShip,
    ])
    expect(squadronResults).toEqual([])
    expect(perShipResults).toHaveLength(4)
    for (const psr of perShipResults) {
      expect(psr).toEqual(['At most three ships can carry the Stealth upgrade'])
    }
  })

  it('accepts ships with different Rare upgrades', () => {
    const ships = [
      Snubfighter({
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
        upgrades: ['Stealth'],
      }),
      Snubfighter({
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
        upgrades: ['Death Flower'],
      }),
      Snubfighter({
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
        upgrades: ['Emergency Teleporter'],
      }),
      Gunship({
        upgrades: ['Mining Charges'],
      }),
    ]
    expect(validateSquadron(ships)).toEqual([[], new Array(4).fill([])])
  })

  it('rejects two ships with the same Rare upgrade', () => {
    const ships = [
      Snubfighter({
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
        upgrades: ['Death Flower'],
      }),
      Snubfighter({
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
        upgrades: ['Death Flower'],
      }),
      Snubfighter({
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
        upgrades: ['Emergency Teleporter'],
      }),
      Snubfighter({
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      }),
    ]

    const [squadronResults, perShipResults] = validateSquadron(ships)
    expect(squadronResults).toEqual([])
    expect(perShipResults).toEqual([
      ['At most one ship can carry the Death Flower upgrade'],
      ['At most one ship can carry the Death Flower upgrade'],
      [],
      [],
    ])
  })

  it('allows four Enhanced Turrets spread across three ships', () => {
    const twoTurrets = Gunship({
      upgrades: ['Enhanced Turret', 'Enhanced Turret'],
    })
    const oneTurret = Gunship({ upgrades: ['Enhanced Turret'] })
    const [squadronResults, perShipResults] = validateSquadron([
      twoTurrets,
      oneTurret,
      oneTurret,
    ])
    for (const psr of perShipResults) {
      expect(psr).toEqual([])
    }
  })
})
