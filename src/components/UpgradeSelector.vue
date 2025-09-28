<script setup lang="ts">
import { UPGRADES, type ShipType, type UpgradeKeys } from '@/model/model'
import { ref } from 'vue'
import { rarityIcon } from './helpers'

const dialog = ref(false)
const validUpgrades = ref<UpgradeKeys[]>([])
const selections = ref<UpgradeKeys[]>([])
let resolve: ((value: UpgradeKeys[]) => void) | null = null

const showDialog = (current: UpgradeKeys[], shipType: ShipType) => {
  validUpgrades.value = Object.entries(UPGRADES)
    .filter(
      ([key, value]) =>
        value.classes.includes(shipType) &&
        (!current.includes(key as UpgradeKeys) || key == 'Enhanced Turret')
    )
    .map(([key]) => key as UpgradeKeys)
  selections.value = []
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
</script>

<template>
  <v-dialog v-model="dialog" max-width="300" scrollable>
    <v-card>
      <v-card-title>Choose Upgrade</v-card-title>

      <v-card-text>
        <v-list
          select-strategy="leaf"
          v-model:selected="selections"
          density="compact"
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
        <v-btn color="primary" @click="handleOK">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
