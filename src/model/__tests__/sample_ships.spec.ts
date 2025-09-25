import { describe, expect, it } from 'vitest'
import { costWithoutPilot, costWithPilot } from '../cost'
import {
  Corvette,
  Gunship,
  Rating,
  Ship,
  Snubfighter,
  SquadronTrait,
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
  //
  // This ship is illegal -- even with High Tech, it has one too many upgrades.
  //
  // {
  //   ship: Snubfighter({
  //     name: 'Rapier',
  //     speed: 2,
  //     weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
  //     pilotBase: Rating.D8,
  //     upgrades: ['Fast', 'Maneuverable', 'Repair', 'Shields', 'Torpedoes'],
  //     squadronTrait: SquadronTrait.HighTech,
  //   }),
  //   costWithoutPilot: 12,
  //   costWithPilot: 15,
  //   printable:
  //     'Rapier (snubfighter) 12 (15):2:2d6+1:2d6:2d8:Fast,Maneuverable,Repair,Shields,Torpedoes',
  // },
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
      squadronTrait: SquadronTrait.HighTech,
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
      squadronTrait: SquadronTrait.HighTech,
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
      squadronTrait: SquadronTrait.HighTech,
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
      squadronTrait: SquadronTrait.HighTech,
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
      squadronTrait: SquadronTrait.HighTech,
    }),
    costWithoutPilot: 33,
    costWithPilot: 34,
    printable:
      'Destrier (corvette) 33 (34):1:2d10+1:2d10T,2d10T,2d8E,2d8E:2d6:Enhanced Turret,Enhanced Turret,Hard Point,Shields',
  },
]

doShipTest(
  'Ships of the Consolidated Federation',
  ShipsofTheConsolidatedFederation
)

//
// Pirates and Scoundrels of the Sagittarian Frontier
//

const PiratesAndScoundrels: SampleCase[] = [
  {
    ship: Snubfighter({
      name: 'Wardog',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D8,
      upgrades: ['Shields', 'Targeting Computer'],
    }),
    costWithoutPilot: 9,
    costWithPilot: 12,
    printable:
      'Wardog (snubfighter) 9 (12):2:2d6+1:2d6+1:2d8:Shields,Targeting Computer',
  },
  {
    ship: Snubfighter({
      name: 'Star Eagle',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D8,
      upgrades: ['Shields', 'Torpedoes'],
    }),
    costWithoutPilot: 9,
    costWithPilot: 12,
    printable:
      'Star Eagle (snubfighter) 9 (12):2:2d6+1:2d6:2d8:Shields,Torpedoes',
  },
  {
    ship: Snubfighter({
      name: 'Novaburn',
      speed: 3,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D8,
    }),
    costWithoutPilot: 9,
    costWithPilot: 12,
    printable: 'Novaburn (snubfighter) 9 (12):3:2d6:2d6:2d8:',
  },
  {
    ship: Snubfighter({
      name: 'Pirate Snubfighter',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      pilotBase: Rating.D6,
    }),
    costWithoutPilot: 9,
    costWithPilot: 10,
    printable: 'Pirate Snubfighter (snubfighter) 9 (10):2:2d6:2d8:2d6:',
  },
  {
    ship: Snubfighter({
      name: 'Blastar Prototype Snubfighter',
      speed: 2,
      weaponsBase: [
        { firepower: Rating.D8, arc: WeaponArc.Front },
        { firepower: Rating.D6, arc: WeaponArc.Turret },
      ],
      pilotBase: Rating.D10,
      upgrades: ['Death Flower', 'Shields', 'Targeting Computer'],
    }),
    costWithoutPilot: 14, // Book says 19; swapped
    costWithPilot: 19, // Book says 14
    printable:
      'Blastar Prototype Snubfighter (snubfighter) 14 (19):2:2d6+1:2d8+1,2d6+1T:2d10:Death Flower,Shields,Targeting Computer',
  },
  {
    ship: Snubfighter({
      name: 'Rust Bucket',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D6,
    }),
    costWithoutPilot: 7, // Book says 8; swapped with other cost
    costWithPilot: 8, // Book says 7
    printable: 'Rust Bucket (snubfighter) 7 (8):2:2d6:2d6:2d6:',
  },
  {
    ship: Gunship({
      name: 'Gunboat',
      speed: 2,
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Front },
        { firepower: Rating.D6, arc: WeaponArc.Turret },
      ],
      pilotBase: Rating.D8,
      upgrades: ['ECM', 'Shields'],
    }),
    costWithoutPilot: 17, // Book says 20; swapped
    costWithPilot: 20, // Book says 17
    printable: 'Gunboat (gunship) 17 (20):2:2d8+1:2d10,2d6T:2d8:ECM,Shields',
  },
  {
    ship: Gunship({
      name: 'Light Freighter',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Turret }],
      pilotBase: Rating.D8,
      upgrades: ['Repair', 'Shields'],
    }),
    costWithoutPilot: 13,
    costWithPilot: 16,
    printable:
      'Light Freighter (gunship) 13 (16):2:2d8+1:2d8T:2d8:Repair,Shields',
  },
  {
    ship: Gunship({
      name: 'Bounty Hunter',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D10, arc: WeaponArc.Front }],
      pilotBase: Rating.D8,
      upgrades: ['Mining Charges', 'Shields'],
    }),
    costWithoutPilot: 15,
    costWithPilot: 18,
    printable:
      'Bounty Hunter (gunship) 15 (18):2:2d8+1:2d10:2d8:Mining Charges,Shields',
  },
  {
    ship: Gunship({
      name: 'The Star Griffin - Famous Smuggler',
      speed: 2,
      weaponsBase: [
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
      ],
      pilotBase: Rating.D10,
      upgrades: ['Agile', 'Maneuverable', 'Repair', 'Shields'],
    }),
    costWithoutPilot: 19,
    costWithPilot: 24,
    printable:
      'The Star Griffin - Famous Smuggler (gunship) 19 (24):2:2d8+1:2d8T,2d8T:2d10+1:Agile,Maneuverable,Repair,Shields',
  },
  {
    ship: Corvette({
      name: 'Pirate Sloop',
      weaponsBase: [
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
      ],
      pilotBase: Rating.D6,
      upgrades: ['Carrier', 'Hard Point', 'Shields'],
    }),
    costWithoutPilot: 28,
    costWithPilot: 29,
    printable:
      'Pirate Sloop (corvette) 28 (29):1:2d10+1:2d8T,2d8T,2d8T,2d8T:2d6:Carrier,Hard Point,Shields',
  },
  {
    ship: Corvette({
      name: 'Medium Freighter',
      pilotBase: Rating.D6,
      upgrades: ['ECM'],
    }),
    costWithoutPilot: 10,
    costWithPilot: 11,
    printable: 'Medium Freighter (corvette) 10 (11):1:2d10::2d6:ECM',
  },
]

doShipTest(
  'Pirates and Scoundrels of the Sagittarian Frontier',
  PiratesAndScoundrels
)

//
// Ships of the Children of Ra
//

const ChildrenOfRa: SampleCase[] = [
  {
    ship: Snubfighter({
      name: 'Copperhead',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D8,
      upgrades: ['Agile', 'Maneuverable', 'Fast'],
    }),
    costWithoutPilot: 10,
    costWithPilot: 13,
    printable:
      'Copperhead (snubfighter) 10 (13):2:2d6:2d6:2d8+1:Agile,Maneuverable,Fast',
  },
  {
    ship: Snubfighter({
      name: 'King Cobra',
      speed: 3,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      pilotBase: Rating.D10,
      upgrades: ['Agile', 'Maneuverable', 'Fast'],
    }),
    costWithoutPilot: 14,
    costWithPilot: 19,
    printable:
      'King Cobra (snubfighter) 14 (19):3:2d6:2d8:2d10+1:Agile,Maneuverable,Fast',
  },
  {
    ship: Snubfighter({
      name: 'Black Mamba',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D10,
      upgrades: ['Agile', 'Fast', 'Fully Loaded', 'Maneuverable', 'Stealth'],
    }),
    costWithoutPilot: 12, // Book says 17; swapped
    costWithPilot: 17, // Book says 12
    printable:
      'Black Mamba (snubfighter) 12 (17):2:2d6:2d6:2d10+1:Agile,Fast,Fully Loaded,Maneuverable,Stealth',
  },
  {
    ship: Gunship({
      name: 'Python',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      pilotBase: Rating.D8,
      upgrades: ['Decoy', 'ECM', 'Torpedoes', 'Transport'],
    }),
    costWithoutPilot: 14,
    costWithPilot: 17,
    printable:
      'Python (gunship) 14 (17):2:2d8:2d8:2d8:Decoy,ECM,Torpedoes,Transport',
  },
  {
    ship: Gunship({
      name: 'Hognose',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D10, arc: WeaponArc.Front }],
      pilotBase: Rating.D8,
      upgrades: ['Shields', 'Targeting Computer', 'Torpedoes'],
    }),
    costWithoutPilot: 16,
    costWithPilot: 19,
    printable:
      'Hognose (gunship) 16 (19):2:2d8+1:2d10+1:2d8:Shields,Targeting Computer,Torpedoes',
  },
  {
    ship: Corvette({
      name: 'Converted Civilian Ship',
      weaponsBase: [
        { firepower: Rating.D8, arc: WeaponArc.Front },
        { firepower: Rating.D8, arc: WeaponArc.Rear },
      ],
      pilotBase: Rating.D6,
      upgrades: ['Tailgunner'],
    }),
    costWithoutPilot: 18,
    costWithPilot: 19,
    printable:
      'Converted Civilian Ship (corvette) 18 (19):1:2d10:2d8,2d8R:2d6:Tailgunner',
  },
]

doShipTest('Ships of the Children of Ra', ChildrenOfRa)

//
// Ships of the Celestial Chorus
//

const CelestialChorus: SampleCase[] = [
  {
    ship: Snubfighter({
      name: 'Cherubim',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D6,
      upgrades: ['Agile', 'Torpedoes'],
    }),
    costWithoutPilot: 9,
    costWithPilot: 10,
    printable: 'Cherubim (snubfighter) 9 (10):2:2d6:2d6:2d6+1:Agile,Torpedoes',
  },
  {
    ship: Snubfighter({
      name: 'Angel',
      speed: 3,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D6,
      upgrades: ['Agile', 'Maneuverable'],
    }),
    costWithoutPilot: 11,
    costWithPilot: 12,
    printable: 'Angel (snubfighter) 11 (12):3:2d6:2d6:2d6+1:Agile,Maneuverable',
  },
  {
    ship: Snubfighter({
      name: 'Nephilim',
      speed: 2,
      weaponsBase: [
        { firepower: Rating.D8, arc: WeaponArc.Front },
        { firepower: Rating.D6, arc: WeaponArc.Turret },
      ],
      pilotBase: Rating.D6,
      upgrades: ['Shields', 'Targeting Computer', 'Torpedoes'],
    }),
    costWithoutPilot: 14,
    costWithPilot: 15,
    printable:
      'Nephilim (snubfighter) 14 (15):2:2d6+1:2d8+1,2d6+1T:2d6:Shields,Targeting Computer,Torpedoes',
  },
  //
  // This ship is illegal, because only Corvettes are allowed Reinforced Hull
  //
  // {
  //   ship: Gunship({
  //     name: 'Seraphim',
  //     speed: 2,
  //     weaponsBase: [{ firepower: Rating.D10, arc: WeaponArc.Front }],
  //     pilotBase: Rating.D6,
  //     upgrades: ['Shields', 'Reinforced Hull', 'Torpedoes', 'Transport'],
  //   }),
  //   costWithoutPilot: 16,
  //   costWithPilot: 17,
  //   printable:
  //     'Seraphim (gunship) 16 (17):2:2d8+1:2d10:2d6:Shields,Reinforced Hull,Torpedoes,Transport',
  // },
  {
    ship: Corvette({
      name: 'Leviathan',
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.Front },
        { firepower: Rating.D10, arc: WeaponArc.Turret },
        { firepower: Rating.D10, arc: WeaponArc.Rear },
      ],
      pilotBase: Rating.D6,
      upgrades: ['Carrier', 'Shields', 'Tailgunner'],
    }),
    costWithoutPilot: 30,
    costWithPilot: 31, // Book says 29
    printable:
      'Leviathan (corvette) 30 (31):1:2d10+1:2d10,2d10T,2d10R:2d6:Carrier,Shields,Tailgunner',
  },
]

doShipTest('Ships of the Celestial Chorus', CelestialChorus)

//
// Ships of the Cnidarians
//

const Cnidarians: SampleCase[] = [
  {
    ship: Snubfighter({
      name: 'Squid',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D6,
    }),
    costWithoutPilot: 7,
    costWithPilot: 8,
    printable: 'Squid (snubfighter) 7 (8):2:2d6:2d6:2d6:',
  },
  {
    ship: Snubfighter({
      name: 'Barracuda',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D6,
      upgrades: ['Agile', 'Shields', 'Targeting Computer'],
    }),
    costWithoutPilot: 10,
    costWithPilot: 11,
    printable:
      'Barracuda (snubfighter) 10 (11):2:2d6+1:2d6+1:2d6+1:Agile,Shields,Targeting Computer',
  },
  {
    ship: Gunship({
      name: 'Devil Ray',
      speed: 2,
      weaponsBase: [
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
      ],
      pilotBase: Rating.D8,
      upgrades: ['Carrier', 'ECM', 'Shields', 'Torpedoes'],
    }),
    costWithoutPilot: 19,
    costWithPilot: 22,
    printable:
      'Devil Ray (gunship) 19 (22):2:2d8+1:2d8T,2d8T:2d8:Carrier,ECM,Shields,Torpedoes',
  },
  {
    ship: Corvette({
      name: 'Architeuthis',
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.EnhancedTurret },
        { firepower: Rating.D10, arc: WeaponArc.EnhancedTurret },
      ],
      pilotBase: Rating.D8,
      upgrades: [
        'Fast',
        'Enhanced Turret',
        'Enhanced Turret',
        'Maneuverable',
        'Reinforced Hull',
      ],
    }),
    costWithoutPilot: 26,
    costWithPilot: 29,
    printable:
      'Architeuthis (corvette) 26 (29):1:2d10:2d10E,2d10E:2d8:Fast,Enhanced Turret,Enhanced Turret,Maneuverable,Reinforced Hull',
  },
  {
    ship: Corvette({
      name: "Man O'War",
      weaponsBase: [{ firepower: Rating.D10, arc: WeaponArc.EnhancedTurret }],
      pilotBase: Rating.D6,
      upgrades: ['Carrier', 'Fast', 'Enhanced Turret', 'Shields'],
    }),
    costWithoutPilot: 19, // Book says 20; swapped
    costWithPilot: 20, // Book says 19
    printable:
      "Man O'War (corvette) 19 (20):1:2d10+1:2d10E:2d6:Carrier,Fast,Enhanced Turret,Shields",
  },
]

doShipTest('Ships of the Cnidarians', Cnidarians)

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
