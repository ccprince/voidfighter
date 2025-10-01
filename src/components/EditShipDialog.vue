<script setup lang="ts">
import { costWithoutPilot, costWithPilot } from '@/model/cost'
import {
  Rating,
  ShipType,
  UPGRADES,
  WeaponArc,
  type UpgradeKeys,
  type WeaponBase,
} from '@/model/model'
import { getUpgradeCountLimit, validateShip } from '@/model/validation'
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useDisplay } from 'vuetify'
import {
  coalesceDuplicateUpgrades,
  rarityIcon,
  splitDuplicateUpgrade,
} from '../helpers'
import UpgradeSelector from './UpgradeSelector.vue'

const { xs } = useDisplay()

const props = defineProps(['ship'])
const emit = defineEmits(['update:ship', 'delete'])
const showChip = ref(true)

const localShip = ref(props.ship)
watch(props, () => {
  localShip.value = props.ship
})

const cost = computed(() => costWithoutPilot(localShip.value))
const costPlus = computed(() => costWithPilot(localShip.value))
const validPilots = computed(() => {
  let pilots = [Rating.D6, Rating.D8]
  if (localShip.value.shipType !== ShipType.Corvette) {
    pilots.push(Rating.D10)
  }
  return pilots
})
const minSpeed = computed(() =>
  localShip.value.shipType === ShipType.Snubfighter ? 2 : 1
)
const maxSpeed = computed(() => {
  switch (localShip.value.shipType) {
    case ShipType.Snubfighter:
      return 3
    case ShipType.Gunship:
      return 2
    case ShipType.Corvette:
      return 1
  }
})
const errors = computed(() => validateShip(localShip.value))

const dialog = ref(false)

const showDialog = () => {
  dialog.value = true
}
const closeDialog = () => {
  dialog.value = false
}

defineExpose({ showDialog, closeDialog })

function handleOK() {
  emit('update:ship', localShip.value.copy())
}

function handleDelete() {
  emit('delete')
}

function addWeapon() {
  const hasFront = localShip.value.weaponsBase.some(
    (w: WeaponBase) => w.arc === WeaponArc.Front
  )
  let arc: WeaponArc
  if (!hasFront) arc = WeaponArc.Front
  else arc = WeaponArc.Turret

  localShip.value.weaponsBase.push({
    firepower:
      localShip.value.shipType === ShipType.Corvette ? Rating.D8 : Rating.D6,
    arc,
  })
}

function shouldShowAddWeaponButton() {
  let max: number
  if (localShip.value.shipType === ShipType.Snubfighter) max = 2
  else if (localShip.value.shipType === ShipType.Gunship) max = 2
  else max = 3
  if (localShip.value.hasUpgrade('Hard Point')) max++

  return localShip.value.weapons.length < max
}

function shouldShowDeleteWeaponButton(index: number) {
  return (
    localShip.value.shipType === ShipType.Corvette ||
    localShip.value.shipType === ShipType.Gunship ||
    index > 0
  )
}

function deleteWeapon(index: number) {
  localShip.value.weaponsBase.splice(index, 1)
}

function validFirepowers(): Rating[] {
  if (localShip.value.shipType === ShipType.Snubfighter)
    return [Rating.D6, Rating.D8]
  else if (localShip.value.shipType === ShipType.Corvette)
    return [Rating.D8, Rating.D10]
  else return [Rating.D6, Rating.D8, Rating.D10]
}

function validArcs(index: number): WeaponArc[] {
  if (localShip.value.shipType !== ShipType.Snubfighter)
    return Object.values(WeaponArc)

  return index == 0 ? [WeaponArc.Front] : [WeaponArc.Rear, WeaponArc.Turret]
}

const occupiedUpgradeSlots = computed(() =>
  localShip.value.upgrades.reduce(
    (acc: number, u: UpgradeKeys) => acc + UPGRADES[u].slots,
    0
  )
)

function shouldShowAddUpgradeButton() {
  return occupiedUpgradeSlots.value < getUpgradeCountLimit(localShip.value)
}

const upgradeSelector = useTemplateRef('upgrade-selector')
async function addUpgrade() {
  const selections = (await upgradeSelector.value?.showDialog(
    localShip.value.upgrades,
    localShip.value.shipType,
    getUpgradeCountLimit(localShip.value) - occupiedUpgradeSlots.value
  )) as UpgradeKeys[]
  localShip.value.upgrades.push(...selections)
  localShip.value.upgrades.sort()
}

function deleteUpgrade(x: UpgradeKeys) {
  const idx = localShip.value.upgrades.indexOf(x)
  const newupgrades = localShip.value.upgrades.toSpliced(idx, 1)
  localShip.value.upgrades = newupgrades
}

const processedUpgrades = computed(() => {
  return coalesceDuplicateUpgrades(localShip.value.upgrades).map((x) =>
    splitDuplicateUpgrade(x)
  )
})
</script>

<template>
  <v-dialog
    v-model="dialog"
    scrollable
    :fullscreen="xs"
    max-width="550"
    persistent
  >
    <v-card>
      <v-card-title>
        {{ localShip.name }} &mdash; Points: {{ cost }} ({{
          costPlus
        }})</v-card-title
      >
      <v-card-subtitle>{{ localShip.shipType }}</v-card-subtitle>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                label="Ship name"
                v-model="localShip.name"
                autofocus
                hide-details
              >
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="4">
              <v-number-input
                label="Speed"
                v-model="localShip.speed"
                :min="minSpeed"
                :max="maxSpeed"
                control-variant="stacked"
                hide-details
              ></v-number-input>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                label="Defense"
                readonly
                :model-value="localShip.defense.rating"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-select
                label="Pilot"
                :items="validPilots"
                :model-value="localShip.pilot"
                @update:model-value="(p) => (localShip.pilotBase = p)"
                hide-details
              ></v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-divider opacity="30"></v-divider>
          </v-row>

          <v-row class="">
            <h2>Guns</h2>
          </v-row>
          <v-row>
            <v-col>
              <v-sheet>
                <v-row
                  no-gutters
                  v-for="(w, idx) in localShip.weapons"
                  class="mb-3"
                >
                  <v-col class="mr-sm-1" cols="10" sm="3" order="1">
                    <v-select
                      label="Firepower"
                      :items="validFirepowers()"
                      :model-value="w.firepower"
                      @update:model-value="
                        (fp) => (localShip.weaponsBase[idx].firepower = fp)
                      "
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col class="" cols="10" sm="6" order="3" order-sm="2">
                    <v-select
                      label="Arc"
                      :items="validArcs(idx)"
                      :model-value="w.arc"
                      @update:model-value="
                        (a) => (localShip.weaponsBase[idx].arc = a)
                      "
                      hide-details
                    ></v-select>
                  </v-col>
                  <v-col
                    class="pl-1 pl-sm-0"
                    cols="2"
                    sm="2"
                    align-self="center"
                    order="2"
                    order-sm="3"
                  >
                    <v-btn
                      class="ml-1 ml-s-2"
                      icon="mdi-delete"
                      rounded="lg"
                      color="error"
                      variant="outlined"
                      v-if="shouldShowDeleteWeaponButton(idx)"
                      @click="deleteWeapon(idx)"
                    ></v-btn>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>

          <v-row class="mt-0 mb-2">
            <v-btn
              :disabled="!shouldShowAddWeaponButton()"
              color="primary"
              @click="addWeapon"
              >Add</v-btn
            >
          </v-row>

          <v-row>
            <v-divider opacity="30"></v-divider>
          </v-row>

          <v-row>
            <h2>Upgrades</h2>
          </v-row>
          <v-row>
            <v-col>
              <div class="d-flex ga-2 flex-wrap">
                <v-chip
                  v-for="{ upgrade, count } in processedUpgrades"
                  :key="upgrade"
                  :prepend-icon="rarityIcon(upgrade)"
                  size="large"
                >
                  {{ upgrade }}<span v-if="count > 1">&nbsp;x{{ count }}</span>
                  <template #append>
                    <v-icon
                      icon="mdi-close-circle"
                      class="v-icon--end"
                      @click="deleteUpgrade(upgrade)"
                    ></v-icon>
                  </template>
                </v-chip>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-btn
              color="primary"
              @click="addUpgrade"
              :disabled="!shouldShowAddUpgradeButton()"
            >
              Add</v-btn
            >
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-container>
          <v-row
            v-if="errors.length > 0"
            class="bg-red-lighten-4 pl-2 pr-2 pt-0 pb-0"
          >
            <v-col>
              <ul>
                <li v-for="e in errors">{{ e }}</li>
              </ul>
            </v-col>
          </v-row>
          <v-row>
            <v-btn color="error" @click="handleDelete">Delete</v-btn>
            <v-spacer></v-spacer>

            <v-btn color="error" @click="closeDialog">Cancel</v-btn>
            <v-btn color="primary" @click="handleOK" variant="flat">OK</v-btn>
          </v-row>
        </v-container>
      </v-card-actions>
    </v-card>

    <UpgradeSelector ref="upgrade-selector" />
  </v-dialog>
</template>
