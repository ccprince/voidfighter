import { Rarity, type UpgradeKeys, UPGRADES } from '@/model/model'

export function rarityIcon(u: UpgradeKeys): string {
  if (UPGRADES[u].rarity === Rarity.Rare) return 'mdi-alpha-r-circle-outline'
  else if (UPGRADES[u].rarity === Rarity.Uncommon)
    return 'mdi-alpha-u-circle-outline'
  else return 'mdi-alpha-c-circle-outline'
}

export function formatUpgrades(
  upgrades: UpgradeKeys[] | string[],
  spaceReplacement: string = ' '
): string {
  const unbreakable = upgrades.map((u) => u.replaceAll(' ', spaceReplacement))
  return unbreakable.join(', ')
}

export function coalesceDuplicateUpgrades(upgrades: UpgradeKeys[]): string[] {
  let result: string[] = []

  if (upgrades.length > 0) {
    result.push(upgrades[0])
    for (const u of upgrades.slice(1)) {
      const lastResult = result[result.length - 1]
      if (lastResult.startsWith(u)) {
        const idx = lastResult.lastIndexOf('x')
        const count = idx > 0 ? parseInt(lastResult.slice(idx + 1)) : 1
        result[result.length - 1] = `${u} x${count + 1}`
      } else {
        result.push(u)
      }
    }
  }

  return result
}

export function expandDuplicateUpgrades(
  upgrades: string[] | UpgradeKeys[]
): UpgradeKeys[] {
  return upgrades
    .map((u) => {
      const { upgrade: justUpgrade, count } = splitDuplicateUpgrade(u)
      return new Array(count).fill(justUpgrade)
    })
    .flat()
}

export type SplitUpgrade = {
  upgrade: UpgradeKeys
  count: number
}

export function splitDuplicateUpgrade(
  upgrade: string | UpgradeKeys
): SplitUpgrade {
  const idx = upgrade.toLowerCase().lastIndexOf('x')
  if (idx < 0 || !/[\d+]/.test(upgrade)) {
    return { upgrade: upgrade as UpgradeKeys, count: 1 }
  }

  const count = parseInt(upgrade.slice(idx + 1))
  const trimmed = upgrade.slice(0, idx - 1)
  return { upgrade: trimmed as UpgradeKeys, count }
}
