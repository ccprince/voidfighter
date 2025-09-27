<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import EditShipDialog from './components/EditShipDialog.vue'
import ShipCard from './components/ShipCard.vue'
import {
  Corvette,
  Gunship,
  Rating,
  Ship,
  Snubfighter,
  WeaponArc,
} from './model/model'

interface ShipRecord {
  id: number
  ship: Ship
}

const squad = ref([
  {
    id: 1,
    ship: Snubfighter({
      name: 'Hellhound A',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Repair', 'Shields', 'Torpedoes'],
      pilotBase: Rating.D8,
    }) as Ship,
  },
  {
    id: 2,
    ship: Corvette({
      name: 'Auroch',
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.EnhancedTurret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
      ],
      upgrades: ['Fast', 'Enhanced Turret', 'Repair', 'Shields'],
      pilotBase: Rating.D8,
    }) as Ship,
  },
  {
    id: 3,
    ship: Gunship({
      name: 'Gorgon',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Targeting Computer'],
      pilotBase: Rating.D8,
    }) as Ship,
  },
  {
    id: 4,
    ship: Corvette({
      name: 'Auroch',
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.EnhancedTurret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
      ],
      upgrades: ['Fast', 'Enhanced Turret', 'Repair', 'Shields'],
      pilotBase: Rating.D8,
    }) as Ship,
  },
  {
    id: 5,
    ship: Gunship({
      name: 'Gorgon',
      speed: 2,
      weaponsBase: [{ firepower: Rating.D8, arc: WeaponArc.Front }],
      upgrades: ['Targeting Computer'],
      pilotBase: Rating.D8,
    }) as Ship,
  },
  {
    id: 6,
    ship: Corvette({
      name: 'Auroch',
      weaponsBase: [
        { firepower: Rating.D10, arc: WeaponArc.EnhancedTurret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
        { firepower: Rating.D8, arc: WeaponArc.Turret },
      ],
      upgrades: ['Fast', 'Enhanced Turret', 'Repair', 'Shields'],
      pilotBase: Rating.D8,
    }) as Ship,
  },
])

const editShipDialog = useTemplateRef('edit-ship-dialog')
const shipToEdit = ref(Corvette())
const shipIdToEdit = ref(0)

function handleEdit(record: ShipRecord) {
  console.log(`handleEdit: ship = ${JSON.stringify(record.ship)}`)
  shipToEdit.value = record.ship.copy()
  shipIdToEdit.value = record.id
  editShipDialog.value?.showDialog()
}

function handleUpdateShip(ship: Ship) {
  console.log(`handleUpdateShip: ${JSON.stringify(ship)}`)

  const newSquad = squad.value.map((r) => {
    if (r.id === shipIdToEdit.value) {
      return { id: r.id, ship }
    }
    return r
  })
  squad.value = newSquad

  editShipDialog.value?.closeDialog()
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

      <v-sheet class="d-flex align-center border mb-3 pa-3">
        <v-container>
          <v-row><b>Name:&nbsp;</b> XXX</v-row>
          <v-row><b>Squadron Trait:&nbsp;</b> XXX</v-row>
          <v-row><b>Leader Trait:&nbsp;</b> XXX</v-row>
        </v-container>
        <v-container class="justify-right">
          <v-row><b>Total points (without pilots):&nbsp;</b> XXX</v-row>
          <v-row><b>Total points (with pilots):&nbsp;</b> XXX</v-row>
        </v-container>
      </v-sheet>

      <h1 class="mt-5">Ships</h1>
      <v-sheet class="d-flex flex-wrap align-start ga-3">
        <ShipCard
          v-for="r in squad"
          key="r.id"
          :ship="r.ship as Ship"
          @edit="handleEdit(r as ShipRecord)"
        ></ShipCard>
      </v-sheet>
      <v-btn color="primary">Add Ship</v-btn>

      <EditShipDialog
        ref="edit-ship-dialog"
        :ship="shipToEdit"
        @update:ship="handleUpdateShip"
      ></EditShipDialog>
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
