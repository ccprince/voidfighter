<script setup lang="ts">
import { ref } from 'vue'
import ShipCard from './components/ShipCard.vue'
import {
  Corvette,
  Gunship,
  Rating,
  Snubfighter,
  WeaponArc,
} from './model/model'

const count = ref(0)
function updateCount() {
  count.value++
}

const snub = Snubfighter({ name: 'Testing', pilotBase: Rating.D8 })
const ship = ref(snub)

const squad = [
  Snubfighter({
    name: 'Hellhound A',
    speed: 2,
    weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
    upgrades: ['Repair', 'Shields', 'Torpedoes'],
    pilotBase: Rating.D8,
  }),
  Corvette({
    name: 'Auroch',
    weaponsBase: [
      { firepower: Rating.D10, arc: WeaponArc.EnhancedTurret },
      { firepower: Rating.D8, arc: WeaponArc.Turret },
      { firepower: Rating.D8, arc: WeaponArc.Turret },
    ],
    upgrades: ['Fast', 'Enhanced Turret', 'Repair', 'Shields'],
    pilotBase: Rating.D8,
  }),

  Gunship({
    name: 'Gorgon',
    speed: 2,
    weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
    upgrades: ['Targeting Computer'],
    pilotBase: Rating.D8,
  }),
  Corvette({
    name: 'Auroch',
    weaponsBase: [
      { firepower: Rating.D10, arc: WeaponArc.EnhancedTurret },
      { firepower: Rating.D8, arc: WeaponArc.Turret },
      { firepower: Rating.D8, arc: WeaponArc.Turret },
    ],
    upgrades: ['Fast', 'Enhanced Turret', 'Repair', 'Shields'],
    pilotBase: Rating.D8,
  }),

  Gunship({
    name: 'Gorgon',
    speed: 2,
    weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
    upgrades: ['Targeting Computer'],
    pilotBase: Rating.D8,
  }),
  Gunship({
    name: 'Gorgon',
    speed: 2,
    weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
    upgrades: ['Targeting Computer'],
    pilotBase: Rating.D8,
  }),
  Gunship({
    name: 'Gorgon',
    speed: 2,
    weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
    upgrades: ['Targeting Computer'],
    pilotBase: Rating.D8,
  }),
  Corvette({
    name: 'Auroch',
    weaponsBase: [
      { firepower: Rating.D10, arc: WeaponArc.EnhancedTurret },
      { firepower: Rating.D8, arc: WeaponArc.Turret },
      { firepower: Rating.D8, arc: WeaponArc.Turret },
    ],
    upgrades: ['Fast', 'Enhanced Turret', 'Repair', 'Shields'],
    pilotBase: Rating.D8,
  }),
]
function resetShip() {
  ship.value = Snubfighter({
    name: 'Reset!',
    weaponsBase: [
      { firepower: Rating.D6, arc: WeaponArc.Front },
      { firepower: Rating.D6, arc: WeaponArc.Rear },
    ],
    pilotBase: Rating.D6,
    upgrades: ['Tailgunner', 'Targeting Computer'],
  })
}

function handleEdit() {
  alert('Editing')
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Voidfighter Squadron Builder</v-app-bar-title>

      <v-btn icon>
        <v-icon>mdi-import</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main id="main" class="mt-12 pa-5">
      <h1>Squadron</h1>

      <v-sheet class="d-flex align-center border">
        <v-container>
          <v-row><b>Name:</b> XXX</v-row>
          <v-row><b>Squadron Trait:</b> XXX</v-row>
          <v-row><b>Leader Trait:</b> XXX</v-row>
        </v-container>
        <v-container class="justify-right">
          <v-row><b>Total points (without pilots):</b> XXX</v-row>
          <v-row><b>Total points (with pilots):</b> XXX</v-row>
        </v-container>
      </v-sheet>

      <v-btn color="primary">Edit Squadron</v-btn>

      <h1 class="mt-5">Ships</h1>
      <v-sheet class="d-flex flex-wrap align-start ga-3">
        <ShipCard v-for="s in squad" :ship="s" @edit="handleEdit"></ShipCard>
      </v-sheet>
      <v-btn color="primary">Add Ship</v-btn>
    </v-main>

    <v-footer>
      <v-sheet class="text-center w-100">
        <a
          href="https://www.ospreypublishing.com/us/voidfighter-9781472866448/"
        >
          Voidfighter
        </a>
        &nbsp;is a Science Fiction Dogfighting game by Casey Garske, and
        published by
        <a href="https://www.ospreypublishing.com/us/">Osprey Games</a>
      </v-sheet>
    </v-footer>
  </v-app>
</template>

<style scoped></style>
