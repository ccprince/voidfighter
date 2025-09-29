export enum ShipType {
  Snubfighter = 'SNUBFIGHTER',
  Gunship = 'GUNSHIP',
  Corvette = 'CORVETTE',
}

export function defenseRatingByType(t: ShipType): Rating {
  switch (t) {
    case ShipType.Snubfighter:
      return Rating.D6
    case ShipType.Gunship:
      return Rating.D8
    case ShipType.Corvette:
      return Rating.D10
  }
}

export class Weapon {
  constructor(
    public readonly firepower: Stat,
    public readonly arc: WeaponArc
  ) {}
}

export type WeaponBase = {
  firepower: Rating
  arc: WeaponArc
}

export enum WeaponArc {
  Front = 'Front',
  Rear = 'Rear',
  Turret = 'Turret',
  EnhancedTurret = 'Enhanced Turret',
}

export enum Rarity {
  Common = 'COMMON',
  Uncommon = 'UNCOMMON',
  Rare = 'RARE',
}

export class Upgrade {
  constructor(
    public readonly name: string,
    public readonly classes: ShipType[],
    public readonly rarity: Rarity,
    public readonly cost: number = 1,
    public readonly slots: number = 1
  ) {}
}

export const UPGRADES = {
  Agile: new Upgrade(
    'Agile',
    [ShipType.Snubfighter, ShipType.Gunship],
    Rarity.Common
  ),
  Carrier: new Upgrade(
    'Carrier',
    [ShipType.Gunship, ShipType.Corvette],
    Rarity.Rare
  ),
  'Death Flower': new Upgrade(
    'Death Flower',
    [ShipType.Snubfighter, ShipType.Gunship],
    Rarity.Rare
  ),
  Decoy: new Upgrade(
    'Decoy',
    [ShipType.Gunship, ShipType.Corvette],
    Rarity.Uncommon
  ),
  ECM: new Upgrade(
    'ECM',
    [ShipType.Gunship, ShipType.Corvette],
    Rarity.Uncommon
  ),
  'Emergency Teleporter': new Upgrade(
    'Emergency Teleporter',
    [ShipType.Snubfighter, ShipType.Gunship],
    Rarity.Rare
  ),
  'Enhanced Turret': new Upgrade(
    'Enhanced Turret',
    [ShipType.Gunship, ShipType.Corvette],
    Rarity.Uncommon
  ),
  Fast: new Upgrade(
    'Fast',
    [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette],
    Rarity.Common
  ),
  'Fully Loaded': new Upgrade(
    'Fully Loaded',
    [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette],
    Rarity.Common,
    1,
    0
  ),
  'Ground Support': new Upgrade(
    'Ground Support',
    [ShipType.Gunship],
    Rarity.Uncommon
  ),
  'Hard Point': new Upgrade(
    'Hard Point',
    [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette],
    Rarity.Common
  ),
  Maneuverable: new Upgrade(
    'Maneuverable',
    [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette],
    Rarity.Common
  ),
  'Mining Charges': new Upgrade(
    'Mining Charges',
    [ShipType.Gunship, ShipType.Corvette],
    Rarity.Rare
  ),
  'Reinforced Hull': new Upgrade(
    'Reinforced Hull',
    [ShipType.Corvette],
    Rarity.Rare
  ),
  Repair: new Upgrade(
    'Repair',
    [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette],
    Rarity.Common
  ),
  Shields: new Upgrade(
    'Shields',
    [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette],
    Rarity.Common
  ),
  Stealth: new Upgrade(
    'Stealth',
    [ShipType.Snubfighter, ShipType.Gunship],
    Rarity.Uncommon
  ),
  Tailgunner: new Upgrade(
    'Tailgunner',
    [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette],
    Rarity.Common
  ),
  'Targeting Computer': new Upgrade(
    'Targeting Computer',
    [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette],
    Rarity.Common
  ),
  Torpedoes: new Upgrade(
    'Torpedoes',
    [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette],
    Rarity.Common
  ),
  'Tractor Beam': new Upgrade(
    'Tractor Beam',
    [ShipType.Corvette],
    Rarity.Rare,
    0
  ),
  Transport: new Upgrade('Transport', [ShipType.Gunship], Rarity.Uncommon, 0),
}
type UpgradesType = typeof UPGRADES
export type UpgradeKeys = keyof UpgradesType

export enum Rating {
  D4 = '2d4',
  D6 = '2d6',
  D8 = '2d8',
  D10 = '2d10',
  D12 = '2d12',
}

export class Stat {
  constructor(
    public readonly rating: Rating,
    public readonly modifier: number = 0
  ) {}

  toString(): string {
    let s = this.rating.toString()
    if (this.modifier > 0) {
      s += `+${this.modifier}`
    } else if (this.modifier < 0) {
      s += this.modifier
    }
    return s
  }
}

export enum SquadronTrait {
  BersekerIntelligence = 'Berserker Intelligence',
  Bioships = 'Bioships',
  HighTech = 'High Tech',
  Hotshots = 'Hotshots',
  ImperialNumbers = 'Imperial Numbers',
  RedundantSystems = 'Redundant System',
  Rugged = 'Rugged',
  Ruthless = 'Ruthless',
  ScrappyUnderdogs = 'Scrappy Underdogs',
}

export class Ship {
  constructor(
    public name: string,
    public readonly shipType: ShipType,
    public speed: number,
    protected readonly defenseBase: Rating,
    protected weaponsBase: WeaponBase[] = [],
    protected pilotBase: Rating | null = null,
    public upgrades: UpgradeKeys[] = [],
    public squadronTrait: SquadronTrait | null = null
  ) {
    upgrades.sort()
  }

  get defense(): Stat {
    const shieldsBonus = this.hasUpgrade('Shields') ? 1 : 0
    const ruggedBonus = this.squadronTrait === SquadronTrait.Rugged ? 1 : 0
    return new Stat(this.defenseBase, shieldsBonus + ruggedBonus)
  }

  get pilot(): Stat | null {
    if (this.pilotBase == null) return null

    const agileBonus = this.hasUpgrade('Agile') ? 1 : 0
    const hotshotsBonus = this.squadronTrait === SquadronTrait.Hotshots ? 1 : 0
    return new Stat(this.pilotBase, agileBonus + hotshotsBonus)
  }

  get weapons(): Weapon[] {
    const targetingComputerBonus = this.hasUpgrade('Targeting Computer') ? 1 : 0
    const berserkerBonus =
      this.squadronTrait === SquadronTrait.BersekerIntelligence ? 1 : 0
    return this.weaponsBase.map(
      (b) =>
        new Weapon(
          new Stat(b.firepower, targetingComputerBonus + berserkerBonus),
          b.arc
        )
    )
  }

  public hasUpgrade(name: UpgradeKeys): boolean {
    return this.upgrades.includes(name)
  }

  public copy(): Ship {
    return new Ship(
      this.name,
      this.shipType,
      this.speed,
      this.defenseBase,
      this.weaponsBase.map((wb) => ({ firepower: wb.firepower, arc: wb.arc })),
      this.pilotBase,
      [...this.upgrades],
      this.squadronTrait
    )
  }
}

type SnubfighterOptions = {
  name?: string
  speed?: number
  weaponsBase?: WeaponBase[]
  pilotBase?: Rating | null
  upgrades?: UpgradeKeys[]
  squadronTrait?: SquadronTrait | null
}

export function Snubfighter({
  name = 'Snubfighter',
  speed = 2,
  weaponsBase = [],
  pilotBase = null,
  upgrades = [],
  squadronTrait = null,
}: SnubfighterOptions = {}) {
  return new Ship(
    name,
    ShipType.Snubfighter,
    speed,
    Rating.D6,
    weaponsBase,
    pilotBase,
    upgrades,
    squadronTrait
  )
}

type GunshipOptions = {
  name?: string
  speed?: number
  weaponsBase?: WeaponBase[]
  pilotBase?: Rating | null
  upgrades?: UpgradeKeys[]
  squadronTrait?: SquadronTrait | null
}

export function Gunship({
  name = 'Gunship',
  speed = 1,
  weaponsBase = [],
  pilotBase = null,
  upgrades = [],
  squadronTrait = null,
}: GunshipOptions = {}) {
  return new Ship(
    name,
    ShipType.Gunship,
    speed,
    Rating.D8,
    weaponsBase,
    pilotBase,
    upgrades,
    squadronTrait
  )
}

type CorvetteOptions = {
  name?: string
  weaponsBase?: WeaponBase[]
  pilotBase?: Rating | null
  upgrades?: UpgradeKeys[]
  squadronTrait?: SquadronTrait | null
}

export function Corvette({
  name = 'Corvette',
  weaponsBase = [],
  pilotBase = null,
  upgrades = [],
  squadronTrait = null,
}: CorvetteOptions = {}): Ship {
  return new Ship(
    name,
    ShipType.Corvette,
    1,
    Rating.D10,
    weaponsBase,
    pilotBase,
    upgrades,
    squadronTrait
  )
}
