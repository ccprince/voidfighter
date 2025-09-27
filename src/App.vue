<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import AddShipDialog from './components/AddShipDialog.vue'
import ConfirmDelete from './components/ConfirmDelete.vue'
import EditShipDialog from './components/EditShipDialog.vue'
import ShipCard from './components/ShipCard.vue'
import { costWithoutPilot, costWithPilot } from './model/cost'
import {
  Corvette,
  Gunship,
  Rating,
  Ship,
  ShipType,
  Snubfighter,
  SquadronTrait,
  WeaponArc,
} from './model/model'

//
// Edit squadron
//

const squadronName = ref('Screaming Firehawks')
const squadronTrait = ref<SquadronTrait>(SquadronTrait.BersekerIntelligence)
const leaderTrait = ref('Ace')
const validLeaderTraits = [
  'Ace',
  'Disciplined',
  'Hive Mind',
  'Inspiring',
  'Lucky',
  'Mystical Adept',
  'Need for Speed',
  'Tactician',
]

//
// Edit ships
//

interface ShipRecord {
  id: number
  ship: Ship
}

const squad = ref<ShipRecord[]>([
  {
    id: 999,
    ship: Corvette({ upgrades: ['Carrier', 'Decoy'] }),
  },
])

function handleSquadronTrait() {
  for (const record of squad.value) {
    record.ship.squadronTrait = squadronTrait.value
  }
}

const editShipDialog = useTemplateRef('edit-ship-dialog')
const confirmDeleteDialog = useTemplateRef('confirm-delete-dialog')
const shipToEdit = ref(Corvette())
const shipIdToEdit = ref(0)

let nextId = 1
function handleAddShip(t: ShipType) {
  let ship: Ship
  if (t === ShipType.Snubfighter) {
    ship = Snubfighter({
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
    })
  } else if (t === ShipType.Gunship) {
    ship = Gunship()
  } else {
    ship = Corvette()
  }

  const record = { id: nextId, ship }
  nextId++
  squad.value.push(record)
  handleEdit(record)
}

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

function handleDelete(r: ShipRecord) {
  doDelete(r.ship.name, r.id)
}

async function handleDeleteFromEdit() {
  if (await doDelete(shipToEdit.value.name, shipIdToEdit.value)) {
    editShipDialog.value?.closeDialog()
  }
}

async function doDelete(name: string, id: number) {
  const deleteIt = await confirmDeleteDialog.value?.showDialog(name)
  if (deleteIt) {
    const newSquad = squad.value.filter((r) => r.id !== id)
    squad.value = newSquad
  }
  return deleteIt
}

const totalWithoutPilots = computed(() =>
  squad.value.reduce((acc, r) => acc + costWithoutPilot(r.ship as Ship), 0)
)

const totalWithPilots = computed(() =>
  squad.value.reduce((acc, r) => acc + costWithPilot(r.ship as Ship), 0)
)
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
          <v-row>
            <v-col>
              <v-text-field label="Name" v-model="squadronName"></v-text-field>
            </v-col>
            <v-col class="v-col-4">
              <v-container class="justify-right">
                <v-row
                  ><b>Total points (without pilots):&nbsp;</b>
                  {{ totalWithoutPilots }}</v-row
                >
                <v-row
                  ><b>Total points (with pilots):&nbsp;</b>
                  {{ totalWithPilots }}</v-row
                >
              </v-container>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select
                label="Squadron Trait"
                v-model="squadronTrait"
                :items="Object.values(SquadronTrait)"
                @update:model-value="handleSquadronTrait"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                label="Leader Trait"
                v-model="leaderTrait"
                :items="validLeaderTraits"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>

      <h1 class="mt-5">Ships</h1>
      <v-sheet class="d-flex flex-wrap align-start ga-3">
        <ShipCard
          v-for="r in squad"
          key="r.id"
          :ship="r.ship as Ship"
          @edit="handleEdit(r as ShipRecord)"
          @delete="handleDelete(r as ShipRecord)"
        ></ShipCard>
      </v-sheet>

      <AddShipDialog @newShip="handleAddShip"></AddShipDialog>

      <EditShipDialog
        ref="edit-ship-dialog"
        :ship="shipToEdit"
        @update:ship="handleUpdateShip"
        @delete="handleDeleteFromEdit"
      ></EditShipDialog>

      <ConfirmDelete ref="confirm-delete-dialog"></ConfirmDelete>
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
