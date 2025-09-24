export enum ShipType {
  Snubfighter = "SNUBFIGHTER",
  Gunship = "GUNSHIP",
  Corvette = "CORVETTE",
}

export class Weapon {

}

export enum Rarity {
  Common = "COMMON",
  Uncommon = "UNCOMMON",
  Rare = "RARE",
}

export class Upgrade {
  constructor(
    public readonly name: string,
    public readonly classes: ShipType[],
    public readonly rarity: Rarity,
    public readonly cost: number = 1,
    public readonly slots: number = 1,
  ) { }
}

const UPGRADES = {
  "Shields": new Upgrade("Shields", [ShipType.Snubfighter, ShipType.Gunship, ShipType.Corvette], Rarity.Common)
}
type UpgradesType = typeof UPGRADES
type UpgradeKeys = keyof UpgradesType


export enum Rating {
  D4 = "2d4",
  D6 = "2d6",
  D8 = "2d8",
  D10 = "2d10",
  D12 = "2d12",
}

export class Stat {
  constructor(
    public readonly rating: Rating,
    public readonly modifier: number = 0
  ) { }

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
    public weapons: Weapon[] = [],
    public upgrades: UpgradeKeys[] = []
  ) { }

  get defense(): Stat {
    return new Stat(this.defenseBase, this.hasUpgrade('Shields') ? 1 : 0)
  }

  protected hasUpgrade(name: UpgradeKeys): boolean {
    return this.upgrades.includes(name)
  }
}

type SnubfighterOptions = {
  name?: string,
  speed?: number,
  weapons?: Weapon[],
  upgrades?: UpgradeKeys[],
}

export function Snubfighter({ name = "Snubfighter", speed = 2, weapons = [], upgrades = [] }: SnubfighterOptions = {}) {
  return new Ship(name, ShipType.Snubfighter, speed, Rating.D6, weapons, upgrades)
}


type GunshipOptions = {
  name?: string,
  speed?: number,
  weapons?: Weapon[],
  upgrades?: UpgradeKeys[],
}

export function Gunship({ name = "Gunship", speed = 1, weapons = [], upgrades = [] }: GunshipOptions = {}) {
  return new Ship(name, ShipType.Gunship, speed, Rating.D8, weapons, upgrades)
}

type CorvetteOptions = {
  name?: string,
  weapons?: Weapon[],
  upgrades?: UpgradeKeys[],
}

export function Corvette({ name = "Corvette", weapons = [], upgrades = [] }: CorvetteOptions = {}): Ship {
  return new Ship(name, ShipType.Corvette, 1, Rating.D10, weapons, upgrades)
}
