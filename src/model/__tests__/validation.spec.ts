import { describe, expect, it } from 'vitest'
import { Corvette, Gunship, Rating, Ship, ShipType, Snubfighter, WeaponArc } from '../model.ts'
import { validateShip } from '../validation.ts'

describe('Validate speed', () => {
  describe('for valid ships', () => {
    it.each([
      Snubfighter({ speed: 3, weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }] }),
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

describe('Validate weapons', () => {
  describe('Snubfighter', () => {
    it('requires at least one weapon', () => {
      const ship = Snubfighter({ weaponsBase: [] })
      let errors = validateShip(ship)
      expect(validateShip(ship)).toContain("Snubfighters must carry at least one weapon")
    })

    it('rejects more than two weapons', () => {
      const ship = Snubfighter({ weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }, { firepower: Rating.D6, arc: WeaponArc.Rear }, { firepower: Rating.D6, arc: WeaponArc.Turret }] })
      expect(validateShip(ship)).toContain("Snubfighters may not carry more than two weapons")
    })

    describe('requires the first weapon to fire front', () => {
      it.each([WeaponArc.Rear, WeaponArc.Turret, WeaponArc.EnhancedTurret])
        ('%0', (arc) => {
          const ship = Snubfighter({ weaponsBase: [{ firepower: Rating.D6, arc: arc }] })
          expect(validateShip(ship)).toContain("A Snubfighter's first weapon must fire forward")
        })
    })

    it('requires the second weapon to not fire front', () => {
      const ship = Snubfighter({ weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }, { firepower: Rating.D6, arc: WeaponArc.Front }] })
      expect(validateShip(ship)).toContain("A Snubfighter's second weapon must not fire forward")
    })

    it('rejects 2d10 weapons', () => {
      const ship = Snubfighter({ weaponsBase: [{ firepower: Rating.D10, arc: WeaponArc.Front }] })
      expect(validateShip(ship)).toContain("Snubfighters may not carry 2d10 weapons")
    })

    it('allows only 1 2d8 weapon', () => {
      const ship = Snubfighter({ weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }, { firepower: Rating.D8, arc: WeaponArc.Rear }] })
      expect(validateShip(ship)).toContain("Snubfighters may only carry one 2d8 weapon")
    })
  })

  describe('Gunship', () => {
    it('rejects more than two weapons', () => {
      const ship = Gunship({ weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }, { firepower: Rating.D6, arc: WeaponArc.Rear }, { firepower: Rating.D6, arc: WeaponArc.Turret }] })
      expect(validateShip(ship)).toContain("Gunships may not carry more than two weapons")
    })

    it('allows only 1 2d10 weapon', () => {
      const ship = Gunship({ weaponsBase: [{ firepower: Rating.D10, arc: WeaponArc.Front }, { firepower: Rating.D10, arc: WeaponArc.Rear }] })
      expect(validateShip(ship)).toContain("Gunships may not carry more than one 2d10 weapon")
    })
  })

  describe('Corvette', () => {
    it('rejects more than three weapons', () => {
      const ship = Corvette({ weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }, { firepower: Rating.D8, arc: WeaponArc.Rear }, { firepower: Rating.D8, arc: WeaponArc.Turret }, { firepower: Rating.D8, arc: WeaponArc.Turret }] })
      expect(validateShip(ship)).toContain("Corvettes may not carry more than three weapons")
    })

    it('rejects 2d6 weapons', () => {
      const ship = Corvette({ weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }] })
      expect(validateShip(ship)).toContain("Corvettes may not carry 2d6 weapons")
    })
  })
})
