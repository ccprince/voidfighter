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
import { printableVersion } from '../printable'
import { validateShip } from '../validation'

type SampleCase = {
  ship: Ship
  costWithoutPilot: number
  costWithPilot: number
  printable: string
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
    printable:
      'Hellhound A (snubfighter) 12 (15):2:2d6+1:2d8:2d8:Repair,Shields,Torpedoes',
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
    printable:
      'Hellhound B (snubfighter) 12 (15):2:2d6+1:2d8:2d8:Fast,Repair,Shields',
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
    printable:
      'Manticore (snubfighter) 12 (15):2:2d6+1:2d6,2d6T:2d8:Repair,Shields,Torpedoes',
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
    printable:
      'Phoenix (snubfighter) 12 (15):3:2d6+1:2d6:2d8+1:Agile,Fast,Shields',
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
    printable: 'Gorgon (gunship) 12 (15):2:2d8:2d8+1:2d8:Targeting Computer',
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
    printable: 'Harpy (gunship) 12 (15):2:2d8:2d8:2d8:Ground Support,Transport',
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
    printable:
      'The Odyssey (gunship) 19 (24):2:2d8+1:2d10E:2d10:Death Flower,Decoy,Enhanced Turret,Fast,Fully Loaded,Shields',
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
    printable:
      'Auroch (corvette) 27 (30):1:2d10+1:2d10E,2d8T,2d8T:2d8:Fast,Enhanced Turret,Repair,Shields',
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
    printable:
      'Minotaur (corvette) 27 (30):1:2d10+1:2d10T,2d8T,2d8T:2d8:Fast,Reinforced Hull,Repair,Shields',
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
    printable:
      'Yellowjacket Swarmfighter (snubfighter) 9 (10):2:2d6:2d6:2d6+1:Agile,Maneuverable',
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
    printable:
      'Hornet Swarmfighter (snubfighter) 9 (10):2:2d6:2d6+1:2d6:Targeting Computer,Torpedoes',
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
    printable:
      'Wasp Swarmfighter (snubfighter) 13 (14):3:2d6:2d8:2d6+1:Agile,Maneuverable',
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
    printable:
      'Vespid - Advanced Swarmfighter (snubfighter) 14 (19):3:2d6+1:2d8:2d10+1:Agile,Maneuverable,Shields',
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
    printable:
      'Fire Beetle (gunship) 14 (17):2:2d8+1:2d8+1:2d8:Shields,Targeting Computer,Torpedoes,Transport',
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
    printable:
      'Scarab Shuttle (gunship) 12 (15):2:2d8+1:2d6:2d8:Decoy,ECM,Shields,Transport',
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
    printable:
      'Weta Warship (corvette) 30 (31):1:2d10+1:2d10,2d10T,2d10T:2d6:Carrier,Shields,Torpedoes,Tractor Beam',
  },
]

doShipTest('Ships of the Centauran Empire', ShipsOfTheCentauranEmpire)

//
// Ships of the Consolidated Federation
//

const ShipsofTheConsolidatedFederation: SampleCase[] = [
  {
    ship: Snubfighter({
      name: 'Rapier',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D8,
      upgrades: ['Fast', 'Maneuverable', 'Repair', 'Shields', 'Torpedoes'],
    }),
    costWithoutPilot: 12,
    costWithPilot: 15,
    printable:
      'Rapier (snubfighter) 12 (15):2:2d6+1:2d6:2d8:Fast,Maneuverable,Repair,Shields,Torpedoes',
  },
  {
    ship: Snubfighter({
      name: 'Longsword',
      speed: 2,
      weaponsBase: [
        { firepower: Rating.D8, arc: WeaponArc.Front },
        { firepower: Rating.D6, arc: WeaponArc.Rear },
      ],
      pilotBase: Rating.D8,
      upgrades: ['Repair', 'Shields', 'Tailgunner', 'Torpedoes'],
    }),
    costWithoutPilot: 15,
    costWithPilot: 18,
    printable:
      'Longsword (snubfighter) 15 (18):2:2d6+1:2d8,2d6R:2d8:Repair,Shields,Tailgunner,Torpedoes',
  },
  {
    ship: Snubfighter({
      name: 'Star Saber',
      speed: 3,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      pilotBase: Rating.D10,
      upgrades: ['Agile', 'Maneuverable', 'Repair', 'Shields'],
    }),
    costWithoutPilot: 15,
    costWithPilot: 20,
    printable:
      'Star Saber (snubfighter) 15 (20):3:2d6+1:2d8:2d10+1:Agile,Maneuverable,Repair,Shields',
  },
  {
    ship: Snubfighter({
      name: 'Dagger Drone',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D6,
      upgrades: ['Agile', 'Maneuverable', 'Targeting Computer'],
    }),
    costWithoutPilot: 10,
    costWithPilot: 11,
    printable:
      'Dagger Drone (snubfighter) 10 (11):2:2d6:2d6+1:2d6+1:Agile,Maneuverable,Targeting Computer',
  },
  {
    ship: Gunship({
      name: 'Claymore',
      speed: 2,
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Front },
        { firepower: Rating.D6, arc: WeaponArc.Turret },
        { firepower: Rating.D6, arc: WeaponArc.Turret },
      ],
      pilotBase: Rating.D8,
      upgrades: [
        'Ground Support',
        'Hard Point',
        'Shields',
        'Torpedoes',
        'Transport',
      ],
    }),
    costWithoutPilot: 21,
    costWithPilot: 24,
    printable:
      'Claymore (gunship) 21 (24):2:2d8+1:2d10,2d6T,2d6T:2d8:Ground Support,Hard Point,Shields,Torpedoes,Transport',
  },
  {
    ship: Corvette({
      name: 'Destrier',
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Turret },
        { firepower: Rating.D10, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.EnhancedTurret },
        { firepower: Rating.D8, arc: WeaponArc.EnhancedTurret },
      ],
      pilotBase: Rating.D6,
      upgrades: ['Enhanced Turret', 'Enhanced Turret', 'Hard Point', 'Shields'],
    }),
    costWithoutPilot: 33,
    costWithPilot: 34,
    printable:
      'Destrier (corvette) 33 (34):1:2d10+1:2d10T,2d10T,2d8E,2d8E:2d6:Enhanced Turret,Enhanced Turret,Hard Point,Shields',
  },
]

//
// Ignore this for now, because they all use the "High Tech" squadron trait, and that is not yet
// covered in the validations.
//
// doShipTest(
//   'Ships of the Consolidated Federation',
//   ShipsofTheConsolidatedFederation
// )

//
// Implementation
//

function doShipTest(name: string, cases: SampleCase[]) {
  describe(name, () => {
    describe('validates cleanly', () => {
      it.each(cases)('$ship.name', ({ ship }) => {
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

    describe('converts to printable', () => {
      it.each(cases)('$ship.name -> $printable', ({ ship, printable }) => {
        expect(printableVersion(ship)).toEqual(printable)
      })
    })
  })
}
