import { Corvette, Gunship, Rating, Snubfighter, WeaponArc } from '../model'

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
  upgradesBase: ['Death Flower'],
})

//
// Ships of the Void Tigers
//

const HellhoundA = Snubfighter({
  name: 'Hellhound A',
  speed: 2,
  weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
  upgradesBase: ['Repair', 'Shields', 'Torpedoes'],
  pilot: Rating.D8,
})
const HellhoundB = Snubfighter({
  name: 'Hellhound B',
  speed: 2,
  weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
  upgradesBase: ['Fast', 'Repair', 'Shields'],
  pilot: Rating.D8,
})
const Manticore = Snubfighter({
  name: 'Manticore',
  speed: 2,
  weaponsBase: [
    { firepower: Rating.D6, arc: WeaponArc.Front },
    { firepower: Rating.D6, arc: WeaponArc.Turret },
  ],
  upgradesBase: ['Repair', 'Shields', 'Torpedoes'],
  pilot: Rating.D8,
})
const Phoenix = Snubfighter({
  name: 'Phoenix',
  speed: 2,
  weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
  upgradesBase: ['Agile', 'Fast', 'Shields'],
  pilot: Rating.D8,
})
const Gorgon = Gunship({
  name: 'Gorgon',
  speed: 2,
  weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
  upgradesBase: ['Targeting Computer'],
  pilot: Rating.D8,
})
const Harpy = Gunship({
  name: 'Harpy',
  speed: 2,
  weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
  upgradesBase: ['Ground Support', 'Transport'],
  pilot: Rating.D8,
})
const TheOdyssey = Gunship({
  name: 'The Odyssey',
  speed: 2,
  weaponsBase: [{ firepower: Rating.D10, arc: WeaponArc.EnhancedTurret }],
  upgradesBase: ['Death Flower', 'Decoy', 'Fast', 'Fully Loaded', 'Shields'],
  pilot: Rating.D10,
})
const Auroch = Corvette({
  name: 'Auroch',
  weaponsBase: [
    { firepower: Rating.D10, arc: WeaponArc.Turret },
    { firepower: Rating.D8, arc: WeaponArc.Turret },
    { firepower: Rating.D8, arc: WeaponArc.Turret },
  ],
  pilot: Rating.D8,
})
const Minotaur = Corvette({
  name: 'Minotaur',
  weaponsBase: [
    { firepower: Rating.D10, arc: WeaponArc.Turret },
    { firepower: Rating.D8, arc: WeaponArc.Turret },
    { firepower: Rating.D8, arc: WeaponArc.Turret },
  ],
  upgradesBase: ['Fast', 'Reinforced Hull', 'Repair', 'Shields'],
  pilot: Rating.D8,
})
