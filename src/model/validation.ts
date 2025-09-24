import { Rating, Ship, ShipType, UPGRADES, Weapon, WeaponArc } from './model.ts'

export function validateShip(ship: Ship): string[] {
  return [
    validateSpeed(ship),
    validateDefense(ship),
    ...validateWeapons(ship),
    ...validateUpgrades(ship),
    validateUpgradeCount(ship),
  ].filter((x) => x !== null)
}

function validateSpeed(ship: Ship): string | null {
  const min = ship.shipType == ShipType.Snubfighter ? 2 : 1
  let max: number
  if (ship.shipType === ShipType.Corvette) max = 1
  else if (ship.shipType === ShipType.Gunship) max = 2
  else max = 3

  return ship.speed >= min && ship.speed <= max
    ? null
    : `Speed is ${ship.speed}, but must be between ${min} and ${max}`
}

function validateDefense(ship: Ship): string | null {
  if (
    ship.shipType === ShipType.Snubfighter &&
    ship.defense.rating !== Rating.D6
  )
    return `Defense is ${ship.defense.rating}, but defense for a Snubfighter must be 2d6`
  else if (
    ship.shipType === ShipType.Gunship &&
    ship.defense.rating !== Rating.D8
  )
    return `Defense is ${ship.defense.rating}, but defense for a Gunship must be 2d8`
  else if (
    ship.shipType === ShipType.Corvette &&
    ship.defense.rating !== Rating.D10
  )
    return `Defense is ${ship.defense.rating}, but defense for a Corvette must be 2d10`
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
        `${toCapital(ship.shipType)}s cannot have the ${upgrade} upgrade`
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

function validateUpgradeCount(ship: Ship): string | null {
  let max: number
  switch (ship.shipType) {
    case ShipType.Snubfighter:
      max = 3
      break
    case ShipType.Gunship:
      max = 4
      break
    case ShipType.Corvette:
      max = 5
      break
  }

  let extraMessage = ''
  if (ship.hasUpgrade('Fully Loaded')) {
    max++
    extraMessage = ' with Fully Loaded'
  }

  const upgradeCount = ship.upgrades.reduce(
    (acc, u) => acc + UPGRADES[u].slots,
    0
  )
  if (upgradeCount > max)
    return `${toCapital(ship.shipType)}s${extraMessage} may have at most ${max} upgrades`

  return null
}

function toCapital(s: string): string {
  return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase()
}
