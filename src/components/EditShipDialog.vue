<script setup lang="ts">
import { costWithoutPilot, costWithPilot } from '@/model/cost'
import { Rating, ShipType, WeaponArc } from '@/model/model'
import { validateShip } from '@/model/validation'
import { computed, ref, watch } from 'vue'

const props = defineProps(['ship'])
const emit = defineEmits(['update:ship', 'delete'])

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
  console.log(`maxSpeed -> shipType = ${localShip.value.shipType}`)
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
</script>

<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                label="Ship name"
                v-model="localShip.name"
                autofocus
              >
                <template #append>
                  Points: {{ cost }} ({{ costPlus }})
                </template>
              </v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-number-input
                label="Speed"
                v-model="localShip.speed"
                :min="minSpeed"
                :max="maxSpeed"
                control-variant="stacked"
              ></v-number-input>
            </v-col>
            <v-col>
              <v-text-field
                label="Defense"
                readonly
                :model-value="localShip.defense.rating"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-select
                label="Pilot"
                :items="validPilots"
                :model-value="localShip.pilot"
                @update:model-value="(p) => (localShip.pilotBase = p)"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <h2>Guns</h2>
          </v-row>
          <v-row>
            <v-col>
              <v-sheet>
                <v-row no-gutters v-for="(w, idx) in localShip.weapons">
                  <v-col class="pr-1 v-col-5">
                    <v-select
                      label="Firepower"
                      :items="[Rating.D6, Rating.D8, Rating.D10]"
                      :model-value="w.firepower"
                      @update:model-value="
                        (fp) => (localShip.weaponsBase[idx].firepower = fp)
                      "
                    ></v-select>
                  </v-col>
                  <v-col class="pl-1 pr-1">
                    <v-select
                      label="Arc"
                      :items="[
                        WeaponArc.Front,
                        WeaponArc.Rear,
                        WeaponArc.Turret,
                        WeaponArc.EnhancedTurret,
                      ]"
                      :model-value="w.arc"
                      @update:model-value="
                        (a) => (localShip.weaponsBase[idx].arc = a)
                      "
                    ></v-select>
                  </v-col>
                  <v-col class="pl-1 v-col-2">
                    <v-btn icon="mdi-delete-outline" rounded="lg"></v-btn>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </v-row>

          <v-row>
            <h2>Upgrades</h2>
          </v-row>
          <v-row>
            <v-col>
              <v-label>(Upgrades)</v-label>
            </v-col>
          </v-row>
          <v-row v-if="errors.length > 0">
            <v-col class="error">
              <ul>
                <li v-for="e in errors">{{ e }}</li>
              </ul>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" @click="handleDelete">Delete</v-btn>
        <v-spacer></v-spacer>

        <v-btn color="error" @click="closeDialog">Cancel</v-btn>
        <v-btn color="primary" @click="handleOK">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
