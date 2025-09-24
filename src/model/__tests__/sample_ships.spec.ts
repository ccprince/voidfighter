import { describe, expect, it } from 'vitest'
import { costWithoutPilot, costWithPilot } from '../cost'
import {
  Corvette,
  Gunship,
  Rating,
  Ship,
  Snubfighter,
  WeaponArc,
} from '../model'
import { validateShip } from '../validation'

type SampleCase = {
  ship: Ship
  costWithoutPilot: number
  costWithPilot: number
}

//
// Shipbuilding example
//

const LightningChaser = Snubfighter({
  name: 'Lightning Chaser',
  speed: 3,
  weaponsBase: [
    { firepower: Rating.D6, arc: WeaponArc.Front },
    { firepower: Rating.D6, arc: WeaponArc.Turret },
  ],
  upgrades: ['Death Flower', 'Fast', 'Stealth'],
})

describe('Shipbuilding example', () => {
  describe('validates cleanly', () => {
    it.each([{ ship: LightningChaser }])('$ship.name', ({ ship }) => {
      expect(validateShip(ship)).toEqual([])
    })
  })

  describe('calculates cost correctly', () => {
    it.each([{ ship: LightningChaser, cost: 14 }])(
      '$ship.name -> $cost',
      ({ ship, cost }) => {
        expect(costWithoutPilot(ship)).toEqual(cost)
        expect(costWithPilot(ship)).toEqual(cost)
      }
    )
  })
})

//
// Ships of the Void Tigers
//

const ShipsOfTheVoidTigers: SampleCase[] = [
  {
    ship: Snubfighter({
      name: 'Hellhound A',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Repair', 'Shields', 'Torpedoes'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 12,
    costWithPilot: 15,
  },
  {
    ship: Snubfighter({
      name: 'Hellhound B',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Fast', 'Repair', 'Shields'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 12,
    costWithPilot: 15,
  },
  {
    ship: Snubfighter({
      name: 'Manticore',
      speed: 2,
      weaponsBase: [
        { firepower: Rating.D6, arc: WeaponArc.Front },
        { firepower: Rating.D6, arc: WeaponArc.Turret },
      ],
      upgrades: ['Repair', 'Shields', 'Torpedoes'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 12,
    costWithPilot: 15,
  },
  {
    ship: Snubfighter({
      name: 'Phoenix',
      speed: 3,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      upgrades: ['Agile', 'Fast', 'Shields'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 12,
    costWithPilot: 15,
  },
  {
    ship: Gunship({
      name: 'Gorgon',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Targeting Computer'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 12,
    costWithPilot: 15,
  },
  {
    ship: Gunship({
      name: 'Harpy',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Ground Support', 'Transport'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 12,
    costWithPilot: 15,
  },
  {
    ship: Gunship({
      name: 'The Odyssey',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D10, arc: WeaponArc.EnhancedTurret }],
      upgrades: [
        'Death Flower',
        'Decoy',
        'Enhanced Turret',
        'Fast',
        'Fully Loaded',
        'Shields',
      ],
      pilotBase: Rating.D10,
    }),
    costWithoutPilot: 19, // Book says 18
    costWithPilot: 24, // Book says 23
  },
  {
    ship: Corvette({
      name: 'Auroch',
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.EnhancedTurret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
      ],
      upgrades: ['Fast', 'Enhanced Turret', 'Repair', 'Shields'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 27,
    costWithPilot: 30,
  },
  {
    ship: Corvette({
      name: 'Minotaur',
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
      ],
      upgrades: ['Fast', 'Reinforced Hull', 'Repair', 'Shields'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 27,
    costWithPilot: 30,
  },
]

doShipTest('Ships of the Void Tigers', ShipsOfTheVoidTigers)

//
// Ships of the Centauran Empire
//

const ShipsOfTheCentauranEmpire: SampleCase[] = [
  {
    ship: Snubfighter({
      name: 'Yellowjacket Swarmfighter',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      upgrades: ['Agile', 'Maneuverable'],
      pilotBase: Rating.D6,
    }),
    costWithoutPilot: 9,
    costWithPilot: 10,
  },
  {
    ship: Snubfighter({
      name: 'Hornet Swarmfighter',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      upgrades: ['Targeting Computer', 'Torpedoes'],
      pilotBase: Rating.D6,
    }),
    costWithoutPilot: 9,
    costWithPilot: 10,
  },
  {
    ship: Snubfighter({
      name: 'Wasp Swarmfighter',
      speed: 3,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Agile', 'Maneuverable'],
      pilotBase: Rating.D6,
    }),
    costWithoutPilot: 13,
    costWithPilot: 14,
  },
  {
    ship: Snubfighter({
      name: 'Vespid - Advanced Swarmfighter',
      speed: 3,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Agile', 'Maneuverable', 'Shields'],
      pilotBase: Rating.D10,
    }),
    costWithoutPilot: 14,
    costWithPilot: 19,
  },
  {
    ship: Gunship({
      name: 'Fire Beetle',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Shields', 'Targeting Computer', 'Torpedoes', 'Transport'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 14,
    costWithPilot: 17,
  },
  {
    ship: Gunship({
      name: 'Scarab Shuttle',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      upgrades: ['Decoy', 'ECM', 'Shields', 'Transport'],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 12,
    costWithPilot: 15,
  },
  {
    ship: Corvette({
      name: 'Weta Warship',
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Front },
        { firepower: Rating.D10, arc: WeaponArc.Turret },
        { firepower: Rating.D10, arc: WeaponArc.Turret },
      ],
      upgrades: ['Carrier', 'Shields', 'Torpedoes', 'Tractor Beam'],
      pilotBase: Rating.D6,
    }),
    costWithoutPilot: 30,
    costWithPilot: 31,
  },
]

doShipTest('Ships of the Centauran Empire', ShipsOfTheCentauranEmpire)

function doShipTest(name: string, cases: SampleCase[]) {
  describe(name, () => {
    describe('validates cleanly', () => {
      it.each(ShipsOfTheCentauranEmpire)('$ship.name', ({ ship }) => {
        expect(validateShip(ship)).toEqual([])
      })
    })

    describe('calculates cost correctly', () => {
      it.each(cases)(
        '$ship.name -> $costWithoutPilot ($costWithPilot)',
        ({ ship, costWithoutPilot: baseCost, costWithPilot: fullCost }) => {
          expect(costWithoutPilot(ship)).toEqual(baseCost)
          expect(costWithPilot(ship)).toEqual(fullCost)
        }
      )
    })
  })
}
