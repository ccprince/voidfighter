<script setup lang="ts">
import { UPGRADES, type ShipType, type UpgradeKeys } from '@/model/model'
import { computed, ref } from 'vue'
import { rarityIcon } from '../helpers'

const dialog = ref(false)
const validUpgrades = ref<UpgradeKeys[]>([])
const selections = ref<UpgradeKeys[]>([])
const limit = ref(0)
const actualLimit = computed(
  () => limit.value + (selections.value.includes('Fully Loaded') ? 2 : 0)
)
let resolve: ((value: UpgradeKeys[]) => void) | null = null

const showDialog = (
  current: UpgradeKeys[],
  shipType: ShipType,
  maxAllowed: number
) => {
  validUpgrades.value = Object.entries(UPGRADES)
    .filter(
      ([key, value]) =>
        value.classes.includes(shipType) &&
        (!current.includes(key as UpgradeKeys) || key == 'Enhanced Turret')
    )
    .map(([key]) => key as UpgradeKeys)
  selections.value = []
  limit.value = maxAllowed
  dialog.value = true
  return new Promise((res) => {
    resolve = res
  })
}

const handleOK = () => {
  dialog.value = false
  if (resolve != null) resolve(selections.value)
}

const closeDialog = () => {
  dialog.value = false
  if (resolve != null) resolve([])
}

defineExpose({ showDialog, closeDialog })

function handleUpdateSelections(newSelections: UpgradeKeys[]) {
  console.log(newSelections)
  if (actualLimit.value == 1) {
    selections.value = newSelections.length > 0 ? newSelections.slice(-1) : []
  } else if (newSelections.length <= actualLimit.value) {
    selections.value = newSelections
  }
}

const title = computed(() => {
  let upTo = 'an'
  let plural = ''
  if (actualLimit.value > 1) {
    upTo = `up to ${actualLimit.value}`
    plural = 's'
  }
  return `Select ${upTo} Upgrade${plural}`
})
</script>

<template>
  <v-dialog v-model="dialog" max-width="300" scrollable>
    <v-card :title="title">
      <v-card-text>
        <v-list
          select-strategy="leaf"
          :selected="selections"
          density="compact"
          @update:selected="handleUpdateSelections"
        >
          <v-list-item v-for="u in validUpgrades" :value="u">
            <template #prepend
              ><v-icon size="large">{{ rarityIcon(u) }}</v-icon></template
            >
            <v-list-item-title>{{ u }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="handleOK" variant="flat">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
