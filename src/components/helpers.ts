import { Rarity, type UpgradeKeys, UPGRADES } from '@/model/model'

export function rarityIcon(u: UpgradeKeys): string {
  if (UPGRADES[u].rarity === Rarity.Rare) return 'mdi-alpha-r-circle-outline'
  else if (UPGRADES[u].rarity === Rarity.Uncommon)
    return 'mdi-alpha-u-circle-outline'
  else return 'mdi-alpha-c-circle-outline'
}
