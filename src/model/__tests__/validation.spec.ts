import { describe, expect, it } from 'vitest'
import {
  Corvette,
  Gunship,
  Rating,
  Ship,
  ShipType,
  Snubfighter,
  WeaponArc,
} from '../model.ts'
import { validateShip } from '../validation.ts'

describe('Validate speed', () => {
  describe('for valid ships', () => {
    it.each([
      Snubfighter({
        speed: 3,
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      }),
      Gunship({ speed: 2 }),
      Corvette(),
    ])('%s', (ship) => {
      expect(validateShip(ship)).toEqual([])
    })
  })

  describe('for invalid ships', () => {
    it.each([
      [Snubfighter(), 1, 'Speed is 1, but must be between 2 and 3'],
      [Gunship(), 3, 'Speed is 3, but must be between 1 and 2'],
      [Corvette(), 2, 'Speed is 2, but must be between 1 and 1'],
    ])('$0, $1 -> $2', (ship, newSpeed, expected) => {
      ship.speed = newSpeed
      const errors = validateShip(ship)
      expect(errors).toContain(expected)
    })
  })
})

describe('Validate defense', () => {
  it.each([
    [
      ShipType.Snubfighter,
      2,
      'Defense is 2d4, but defense for a Snubfighter must be 2d6',
    ],
    [
      ShipType.Gunship,
      2,
      'Defense is 2d4, but defense for a Gunship must be 2d8',
    ],
    [
      ShipType.Corvette,
      1,
      'Defense is 2d4, but defense for a Corvette must be 2d10',
    ],
  ])('%0 -> %1', (shipType, speed, expected) => {
    let ship = new Ship('Testing', shipType, speed, Rating.D4)
    expect(validateShip(ship)).toContain(expected)
  })
})

describe('Validate weapons', () => {
  describe('requires Enhanced Turret upgrades', () => {
    it.each([
      [
        Gunship({
          weaponsBase: [
            { firepower: Rating.D8, arc: WeaponArc.EnhancedTurret },
          ],
        }),
      ],
      [
        Corvette({
          weaponsBase: [
            { firepower: Rating.D8, arc: WeaponArc.EnhancedTurret },
            { firepower: Rating.D8, arc: WeaponArc.EnhancedTurret },
          ],
        }),
      ],
      [
        Corvette({
          weaponsBase: [
            { firepower: Rating.D8, arc: WeaponArc.EnhancedTurret },
            { firepower: Rating.D8, arc: WeaponArc.EnhancedTurret },
          ],
          upgrades: ['Enhanced Turret'],
        }),
      ],
    ])('%o', (ship) => {
      expect(validateShip(ship)).contains(
        'The ship must have an Enhanced Turret upgrade for each of its weapons with enhanced turrets'
      )
    })
  })

  it('requires a Tailgunner upgrade', () => {
    const ship = Gunship({
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Rear }],
    })
    expect(validateShip(ship)).contains(
      'The ship must have a Tailgunner upgrade for its rear-facing weapon'
    )
  })

  describe('Snubfighter', () => {
    it('requires at least one weapon', () => {
      const ship = Snubfighter({ weaponsBase: [] })
      let errors = validateShip(ship)
      expect(validateShip(ship)).toContain(
        'Snubfighters must carry at least one weapon'
      )
    })

    it('rejects more than two weapons', () => {
      const ship = Snubfighter({
        weaponsBase: [
          { firepower: Rating.D6, arc: WeaponArc.Front },
          { firepower: Rating.D6, arc: WeaponArc.Rear },
          { firepower: Rating.D6, arc: WeaponArc.Turret },
        ],
      })
      expect(validateShip(ship)).toContain(
        'Snubfighters may not carry more than two weapons'
      )
    })

    it('rejects more than three weapons with Hard Point', () => {
      const ship = Snubfighter({
        weaponsBase: [
          { firepower: Rating.D6, arc: WeaponArc.Front },
          { firepower: Rating.D6, arc: WeaponArc.Rear },
          { firepower: Rating.D6, arc: WeaponArc.Turret },
          { firepower: Rating.D6, arc: WeaponArc.Turret },
        ],
        upgrades: ['Hard Point'],
      })
      expect(validateShip(ship)).toContain(
        'Snubfighters with Hard Point may not carry more than three weapons'
      )
    })

    describe('requires the first weapon to fire front', () => {
      it.each([WeaponArc.Rear, WeaponArc.Turret, WeaponArc.EnhancedTurret])(
        '$0',
        (arc) => {
          const ship = Snubfighter({
            weaponsBase: [{ firepower: Rating.D6, arc: arc }],
          })
          expect(validateShip(ship)).toContain(
            "A Snubfighter's first weapon must fire forward"
          )
        }
      )
    })

    describe('requires other weapons to not fire front', () => {
      // Update 'requires the second weapon to not fire front' so that it handles more than two.
      it.each([
        Snubfighter({
          weaponsBase: [
            { firepower: Rating.D6, arc: WeaponArc.Front },
            { firepower: Rating.D6, arc: WeaponArc.Front },
          ],
        }),
        Snubfighter({
          weaponsBase: [
            { firepower: Rating.D6, arc: WeaponArc.Front },
            { firepower: Rating.D6, arc: WeaponArc.Turret },
            { firepower: Rating.D6, arc: WeaponArc.Front },
          ],
          upgrades: ['Hard Point'],
        }),
      ])('%o', (ship) => {
        expect(
          expect(validateShip(ship)).toEqual([
            "A Snubfighter's secondary weapons must not fire forward",
          ])
        )
      })
    })

    it('rejects 2d10 weapons', () => {
      const ship = Snubfighter({
        weaponsBase: [{ firepower: Rating.D10, arc: WeaponArc.Front }],
      })
      expect(validateShip(ship)).toContain(
        'Snubfighters may not carry 2d10 weapons'
      )
    })

    it('allows only 1 2d8 weapon', () => {
      const ship = Snubfighter({
        weaponsBase: [
          { firepower: Rating.D8, arc: WeaponArc.Front },
          { firepower: Rating.D8, arc: WeaponArc.Rear },
        ],
      })
      expect(validateShip(ship)).toContain(
        'Snubfighters may only carry one 2d8 weapon'
      )
    })
  })

  describe('Gunship', () => {
    it('rejects more than two weapons', () => {
      const ship = Gunship({
        weaponsBase: [
          { firepower: Rating.D6, arc: WeaponArc.Front },
          { firepower: Rating.D6, arc: WeaponArc.Rear },
          { firepower: Rating.D6, arc: WeaponArc.Turret },
        ],
      })
      expect(validateShip(ship)).toContain(
        'Gunships may not carry more than two weapons'
      )
    })

    it('rejects more than four weapons with Hard Point', () => {
      const ship = Gunship({
        weaponsBase: [
          { firepower: Rating.D6, arc: WeaponArc.Front },
          { firepower: Rating.D6, arc: WeaponArc.Rear },
          { firepower: Rating.D6, arc: WeaponArc.Turret },
          { firepower: Rating.D6, arc: WeaponArc.Turret },
        ],
        upgrades: ['Hard Point', 'Tailgunner'],
      })
      expect(validateShip(ship)).toEqual([
        'Gunships with Hard Point may not carry more than three weapons',
      ])
    })

    it('allows only 1 2d10 weapon', () => {
      const ship = Gunship({
        weaponsBase: [
          { firepower: Rating.D10, arc: WeaponArc.Front },
          { firepower: Rating.D10, arc: WeaponArc.Rear },
        ],
      })
      expect(validateShip(ship)).toContain(
        'Gunships may not carry more than one 2d10 weapon'
      )
    })

    it('rejects more than one front weapon', () => {
      const ship = Gunship({
        weaponsBase: [
          { firepower: Rating.D10, arc: WeaponArc.Front },
          { firepower: Rating.D10, arc: WeaponArc.Front },
        ],
      })
      expect(validateShip(ship)).toContain(
        'Ships may not have more than one front-firing weapon'
      )
    })

    it('rejects more than one rear weapon', () => {
      const ship = Gunship({
        weaponsBase: [
          { firepower: Rating.D10, arc: WeaponArc.Rear },
          { firepower: Rating.D10, arc: WeaponArc.Rear },
        ],
      })
      expect(validateShip(ship)).toContain(
        'Ships may not have more than one rear-firing weapon'
      )
    })
  })

  describe('Corvette', () => {
    it('rejects more than three weapons', () => {
      const ship = Corvette({
        weaponsBase: [
          { firepower: Rating.D8, arc: WeaponArc.Front },
          { firepower: Rating.D8, arc: WeaponArc.Rear },
          { firepower: Rating.D8, arc: WeaponArc.Turret },
          { firepower: Rating.D8, arc: WeaponArc.Turret },
        ],
      })
      expect(validateShip(ship)).toContain(
        'Corvettes may not carry more than three weapons'
      )
    })

    it('rejects more than five weapons with Hard Point', () => {
      const ship = Corvette({
        weaponsBase: [
          { firepower: Rating.D8, arc: WeaponArc.Front },
          { firepower: Rating.D8, arc: WeaponArc.Rear },
          { firepower: Rating.D8, arc: WeaponArc.Turret },
          { firepower: Rating.D8, arc: WeaponArc.Turret },
          { firepower: Rating.D8, arc: WeaponArc.Turret },
        ],
        upgrades: ['Hard Point', 'Tailgunner'],
      })
      expect(validateShip(ship)).toEqual([
        'Corvettes with Hard Point may not carry more than four weapons',
      ])
    })

    it('rejects 2d6 weapons', () => {
      const ship = Corvette({
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      })
      expect(validateShip(ship)).toContain(
        'Corvettes may not carry 2d6 weapons'
      )
    })

    it('rejects more than one front weapon', () => {
      const ship = Corvette({
        weaponsBase: [
          { firepower: Rating.D10, arc: WeaponArc.Front },
          { firepower: Rating.D10, arc: WeaponArc.Front },
        ],
      })
      expect(validateShip(ship)).toContain(
        'Ships may not have more than one front-firing weapon'
      )
    })
    it('rejects more than one rear weapon', () => {
      const ship = Corvette({
        weaponsBase: [
          { firepower: Rating.D10, arc: WeaponArc.Rear },
          { firepower: Rating.D10, arc: WeaponArc.Rear },
        ],
      })
      expect(validateShip(ship)).toContain(
        'Ships may not have more than one rear-firing weapon'
      )
    })
  })
})

describe('Upgrades', () => {
  describe('are limited by ship type', () => {
    it.each([
      {
        ship: Snubfighter({
          upgrades: ['Fast', 'Hard Point', 'Maneuverable', 'Repair'],
        }),
        expected: 'Snubfighters may have at most 3 upgrades',
      },
      {
        ship: Gunship({
          upgrades: ['Fast', 'Hard Point', 'Maneuverable', 'Repair', 'Shields'],
        }),
        expected: 'Gunships may have at most 4 upgrades',
      },
      {
        ship: Corvette({
          upgrades: [
            'Fast',
            'Hard Point',
            'Maneuverable',
            'Repair',
            'Shields',
            'Torpedoes',
          ],
        }),
        expected: 'Corvettes may have at most 5 upgrades',
      },
    ])('$ship.shipType', ({ ship, expected }) => {
      expect(validateShip(ship)).contains(expected)
    })
  })

  describe('can have extra upgrades with Fully Loaded', () => {
    it.each([
      Snubfighter({
        weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
        upgrades: ['Fully Loaded', 'Fast', 'Maneuverable', 'Repair', 'Shields'],
      }),
      Gunship({
        upgrades: [
          'Fully Loaded',
          'Agile',
          'Death Flower',
          'Decoy',
          'ECM',
          'Repair',
        ],
      }),
      Corvette({
        upgrades: [
          'Fully Loaded',
          'Carrier',
          'Decoy',
          'ECM',
          'Repair',
          'Shields',
          'Torpedoes',
        ],
      }),
    ])('$0', (ship) => {
      expect(validateShip(ship)).toHaveLength(0)
    })
  })

  describe('are limited by ship type and Fully Loaded upgrade', () => {
    it.each([
      {
        ship: Snubfighter({
          weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
          upgrades: [
            'Fully Loaded',
            'Fast',
            'Maneuverable',
            'Repair',
            'Shields',
            'Torpedoes',
          ],
        }),
        message: 'Snubfighters with Fully Loaded may have at most 4 upgrades',
      },
      {
        ship: Gunship({
          upgrades: [
            'Fully Loaded',
            'Agile',
            'Death Flower',
            'Decoy',
            'ECM',
            'Repair',
            'Targeting Computer',
          ],
        }),
        message: 'Gunships with Fully Loaded may have at most 5 upgrades',
      },
      {
        ship: Corvette({
          upgrades: [
            'Fully Loaded',
            'Carrier',
            'Decoy',
            'ECM',
            'Repair',
            'Shields',
            'Torpedoes',
            'Mining Charges',
          ],
        }),
        message: 'Corvettes with Fully Loaded may have at most 6 upgrades',
      },
    ])('$ship.shipType', ({ ship, message }) => {
      expect(validateShip(ship)).toEqual([message])
    })
  })

  it('cannot contain duplicates', () => {
    const ship = Corvette({ upgrades: ['Fast', 'Fast'] })
    expect(validateShip(ship)).contains(
      'Ships cannot have more than one copy of the Fast upgrade'
    )
  })

  it('can contain multiple Enhanced Turrets', () => {
    const ship = Corvette({ upgrades: ['Enhanced Turret', 'Enhanced Turret'] })
    expect(validateShip(ship)).toEqual([])
  })

  describe('may only contain upgrades for its type', () => {
    it.each([
      {
        ship: Snubfighter({ upgrades: ['Carrier'] }),
        message: 'Snubfighters cannot have the Carrier upgrade',
      },
      {
        ship: Gunship({ upgrades: ['Reinforced Hull'] }),
        message: 'Gunships cannot have the Reinforced Hull upgrade',
      },
      {
        ship: Corvette({ upgrades: ['Agile'] }),
        message: 'Corvettes cannot have the Agile upgrade',
      },
    ])('$ship.shipType', ({ ship, message }) => {
      expect(validateShip(ship)).toContain(message)
    })
  })
})
