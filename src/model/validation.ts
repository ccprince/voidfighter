import { coalesceDuplicateUpgrades, splitDuplicateUpgrade } from '@/helpers.ts'
import { costWithoutPilot, costWithPilot } from './cost.ts'
import {
  Rarity,
  Rating,
  Ship,
  ShipType,
  SquadronTrait,
  UPGRADES,
  Weapon,
  WeaponArc,
  type UpgradeKeys,
} from './model.ts'

export function validateShip(ship: Ship): string[] {
  return [
    validateSpeed(ship),
    validateDefense(ship),
    ...validateWeapons(ship),
    ...validateUpgrades(ship),
    validateUpgradeCount(ship),
    validatePilot(ship),
    validateCost(ship),
  ].filter((x) => x != null)
}

const SPEED_LIMITS = {
  [ShipType.Snubfighter]: [2, 3] as const,
  [ShipType.Gunship]: [1, 2] as const,
  [ShipType.Corvette]: [1, 1] as const,
}

function validateSpeed(ship: Ship): string | null {
  const [min, max] = SPEED_LIMITS[ship.shipType]
  return ship.speed >= min && ship.speed <= max
    ? null
    : `Speed is ${ship.speed}, but must be between ${min} and ${max}`
}

const LEGAL_DEFENSE = {
  [ShipType.Snubfighter]: Rating.D6 as const,
  [ShipType.Gunship]: Rating.D8 as const,
  [ShipType.Corvette]: Rating.D10 as const,
}

function validateDefense(ship: Ship): string | null {
  if (ship.defense.rating !== LEGAL_DEFENSE[ship.shipType])
    return `Defense is ${ship.defense.rating}, but defense for a ${formatShipType(ship.shipType)} must be ${LEGAL_DEFENSE[ship.shipType]}`
  else return null
}

function validateWeapons(ship: Ship): string[] {
  switch (ship.shipType) {
    case ShipType.Snubfighter:
      return validateSnubfighterWeapons(ship)
    case ShipType.Gunship:
      return validateGunshipWeapons(ship)
    case ShipType.Corvette:
      return validateCorvetteWeapons(ship)
  }
}

function validateSnubfighterWeapons(ship: Ship): string[] {
  if (ship.weapons.length < 1)
    return ['Snubfighters must carry at least one weapon']
  else if (ship.weapons.length > 2 && !ship.hasUpgrade('Hard Point'))
    return ['Snubfighters may not carry more than two weapons']
  else if (ship.hasUpgrade('Hard Point') && ship.weapons.length > 3)
    return [
      'Snubfighters with Hard Point may not carry more than three weapons',
    ]

  let results: string[] = []

  if (countWeaponsByRating(ship.weapons, Rating.D10) > 0)
    results.push('Snubfighters may not carry 2d10 weapons')
  if (countWeaponsByRating(ship.weapons, Rating.D8) > 1)
    results.push('Snubfighters may only carry one 2d8 weapon')

  if (ship.weapons[0].arc !== WeaponArc.Front)
    results.push("A Snubfighter's first weapon must fire forward")
  ship.weapons.slice(1).forEach((w) => {
    if (w.arc === WeaponArc.Front)
      results.push("A Snubfighter's secondary weapons must not fire forward")
  })

  return results
}

function validateGunshipWeapons(ship: Ship): string[] {
  let results: string[] = []

  if (ship.weapons.length > 2 && !ship.hasUpgrade('Hard Point'))
    results.push('Gunships may not carry more than two weapons')
  else if (ship.hasUpgrade('Hard Point') && ship.weapons.length > 3)
    results.push(
      'Gunships with Hard Point may not carry more than three weapons'
    )

  if (countWeaponsByRating(ship.weapons, Rating.D10) > 1)
    results.push('Gunships may not carry more than one 2d10 weapon')
  results.push(...checkWeaponsByArc(ship.weapons))

  return results
}

function validateCorvetteWeapons(ship: Ship): string[] {
  let results: string[] = []

  if (ship.weapons.length > 3 && !ship.hasUpgrade('Hard Point'))
    results.push('Corvettes may not carry more than three weapons')
  else if (ship.hasUpgrade('Hard Point') && ship.weapons.length > 4)
    results.push(
      'Corvettes with Hard Point may not carry more than four weapons'
    )

  if (countWeaponsByRating(ship.weapons, Rating.D6) > 0)
    results.push('Corvettes may not carry 2d6 weapons')
  results.push(...checkWeaponsByArc(ship.weapons))

  return results
}

function countWeaponsByRating(weapons: Weapon[], rating: Rating): number {
  return weapons.filter((w) => w.firepower.rating === rating).length
}

function checkWeaponsByArc(weapons: Weapon[]): string[] {
  let result: string[] = []
  let frontCount = 0
  let rearCount = 0
  weapons.forEach((w) => {
    if (w.arc === WeaponArc.Front) frontCount++
    else if (w.arc === WeaponArc.Rear) rearCount++
  })

  if (frontCount > 1)
    result.push('Ships may not have more than one front-firing weapon')
  if (rearCount > 1)
    result.push('Ships may not have more than one rear-firing weapon')

  return result
}

function validateUpgrades(ship: Ship): string[] {
  let results: string[] = []

  const grouped = Map.groupBy(ship.upgrades, (u) => u)
  let enhancedTurretUpgradeCount = 0
  grouped.forEach((group, upgrade) => {
    if (upgrade === 'Enhanced Turret') enhancedTurretUpgradeCount = group.length
    else if (group.length > 1)
      results.push(
        `Ships cannot have more than one copy of the ${upgrade} upgrade`
      )
  })

  ship.upgrades.forEach((upgrade) => {
    if (!UPGRADES[upgrade].classes.includes(ship.shipType)) {
      results.push(
        `${formatShipType(ship.shipType)}s cannot have the ${upgrade} upgrade`
      )
    }
  })

  let enhancedTurretCount = 0
  let hasTailGun = false
  ship.weapons.forEach((weapon) => {
    if (weapon.arc === WeaponArc.EnhancedTurret) enhancedTurretCount++
    if (weapon.arc === WeaponArc.Rear) hasTailGun = true
  })

  if (hasTailGun && !ship.hasUpgrade('Tailgunner')) {
    results.push(
      'The ship must have a Tailgunner upgrade for its rear-facing weapon'
    )
  }

  if (enhancedTurretCount > enhancedTurretUpgradeCount)
    results.push(
      'The ship must have an Enhanced Turret upgrade for each of its weapons with enhanced turrets'
    )

  return results
}

const UPGRADE_LIMIT = {
  [ShipType.Snubfighter]: 3,
  [ShipType.Gunship]: 4,
  [ShipType.Corvette]: 5,
}

export function getUpgradeCountLimit(ship: Ship): number {
  let max = UPGRADE_LIMIT[ship.shipType]
  if (ship.hasUpgrade('Fully Loaded')) max++
  if (ship.squadronTrait === SquadronTrait.HighTech) max++

  return max
}

function validateUpgradeCount(ship: Ship): string | null {
  let max = getUpgradeCountLimit(ship)
  let extraMessage = ''
  let extras: string[] = []
  if (ship.hasUpgrade('Fully Loaded')) {
    extras.push('Fully Loaded')
  }
  if (ship.squadronTrait === SquadronTrait.HighTech) {
    extras.push('High Tech')
  }
  if (extras.length > 0) extraMessage = ` with ${extras.join(' and ')}`

  const usedUpgradeSlots = ship.upgrades.reduce(
    (acc, u) => acc + UPGRADES[u].slots,
    0
  )
  if (usedUpgradeSlots > max)
    return `${formatShipType(ship.shipType)}s${extraMessage} may have at most ${max} upgrades`

  return null
}

function validatePilot(ship: Ship): string | null {
  let valid = [Rating.D6, Rating.D8]
  let message = '2d6 or 2d8'
  if (
    ship.shipType === ShipType.Snubfighter ||
    ship.shipType === ShipType.Gunship
  ) {
    valid.push(Rating.D10)
    message = '2d6, 2d8, or 2d10'
  }

  const result =
    ship.pilot == null || valid.includes(ship.pilot.rating)
      ? null
      : `The pilot stat for a ${formatShipType(ship.shipType)} must be ${message}`
  return result
}

const MAX_COST = {
  [ShipType.Snubfighter]: 14,
  [ShipType.Gunship]: 20,
  [ShipType.Corvette]: 30,
}

function validateCost(ship: Ship): string | null {
  if (ship.squadronTrait === SquadronTrait.HighTech) return null

  const shipCost = costWithoutPilot(ship)
  return shipCost > MAX_COST[ship.shipType]
    ? `The ship's non-pilot cost (${shipCost}) exceeds the maximum for a ${formatShipType(ship.shipType)} (${MAX_COST[ship.shipType]})`
    : null
}

export function validateSquadron(ships: Ship[]): [string[], string[][]] {
  let results: string[] = []
  let perShipResults: string[][] = ships.map((s) => [])

  let snubfighterPoints = 0
  let totalPoints = 0
  for (const s of ships) {
    const cost = costWithPilot(s)
    totalPoints += cost
    if (s.shipType === ShipType.Snubfighter) snubfighterPoints += cost
  }
  if (snubfighterPoints * 2 < totalPoints)
    results.push('A squadron must contain at least 50% snubfighters, by points')

  if (ships.length < 4 && ships.length > 0)
    results.push('A squadron must contain at least four ships')
  if (ships.length > 16)
    results.push('A squadron must contain at most 16 ships')

  const shipsWithUpgrade = new Map<UpgradeKeys, number[]>()
  for (let i = 0; i < ships.length; i++) {
    const upgrades = coalesceDuplicateUpgrades(ships[i].upgrades).map(
      (u) => splitDuplicateUpgrade(u)!.upgrade
    )
    for (const u of upgrades) {
      if (!shipsWithUpgrade.get(u)) {
        shipsWithUpgrade.set(u, [i])
      } else {
        shipsWithUpgrade.get(u)!.push(i)
      }
    }
  }

  const addMessage = (message: string, shipIndices: number[]) => {
    for (const i of shipIndices) perShipResults[i].push(message)
  }

  shipsWithUpgrade.forEach((s, u) => {
    if (UPGRADES[u].rarity === Rarity.Rare && s.length > 1) {
      addMessage(`At most one ship can carry the ${u} upgrade`, s)
    }
    if (UPGRADES[u].rarity === Rarity.Uncommon && s.length > 3)
      addMessage(`At most three ships can carry the ${u} upgrade`, s)
  })

  return [results, perShipResults]
}

function formatShipType(t: ShipType): string {
  return (
    t.toString().substring(0, 1).toUpperCase() +
    t.toString().substring(1).toLowerCase()
  )
}
