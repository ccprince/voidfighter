export enum ShipType {
  Snubfighter = 'SNUBFIGHTER',
  Gunship = 'GUNSHIP',
  Corvette = 'CORVETTE',
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
  Front = 'FRONT',
  Rear = 'REAR',
  Turret = 'TURRET',
  EnhancedTurret = 'ENHANCED_TURRET',
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

export class Ship {
  constructor(
    public name: string,
    public readonly shipType: ShipType,
    public speed: number,
    protected readonly defenseBase: Rating,
    protected weaponsBase: WeaponBase[] = [],
    protected pilotBase: Rating | null = null,
    public upgrades: UpgradeKeys[] = []
  ) {}

  get defense(): Stat {
    return new Stat(this.defenseBase, this.hasUpgrade('Shields') ? 1 : 0)
  }

  get weapons(): Weapon[] {
    const modifier = this.hasUpgrade('Targeting Computer') ? 1 : 0
    return this.weaponsBase.map(
      (b) => new Weapon(new Stat(b.firepower, modifier), b.arc)
    )
  }

  public hasUpgrade(name: UpgradeKeys): boolean {
    return this.upgrades.includes(name)
  }
}

type SnubfighterOptions = {
  name?: string
  speed?: number
  weaponsBase?: WeaponBase[]
  pilot?: Rating | null
  upgrades?: UpgradeKeys[]
}

export function Snubfighter({
  name = 'Snubfighter',
  speed = 2,
  weaponsBase = [],
  pilot = null,
  upgrades = [],
}: SnubfighterOptions = {}) {
  return new Ship(
    name,
    ShipType.Snubfighter,
    speed,
    Rating.D6,
    weaponsBase,
    pilot,
    upgrades
  )
}

type GunshipOptions = {
  name?: string
  speed?: number
  weaponsBase?: WeaponBase[]
  pilot?: Rating | null
  upgrades?: UpgradeKeys[]
}

export function Gunship({
  name = 'Gunship',
  speed = 1,
  weaponsBase = [],
  pilot = null,
  upgrades = [],
}: GunshipOptions = {}) {
  return new Ship(
    name,
    ShipType.Gunship,
    speed,
    Rating.D8,
    weaponsBase,
    pilot,
    upgrades
  )
}

type CorvetteOptions = {
  name?: string
  weaponsBase?: WeaponBase[]
  pilot?: Rating | null
  upgrades?: UpgradeKeys[]
}

export function Corvette({
  name = 'Corvette',
  weaponsBase = [],
  pilot = null,
  upgrades = [],
}: CorvetteOptions = {}): Ship {
  return new Ship(
    name,
    ShipType.Corvette,
    1,
    Rating.D10,
    weaponsBase,
    pilot,
    upgrades
  )
}
