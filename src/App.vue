<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import AddShipDialog from './components/AddShipDialog.vue'
import ConfirmDelete from './components/ConfirmDelete.vue'
import ConfirmNewSquadron from './components/ConfirmNewSquadron.vue'
import EditShipDialog from './components/EditShipDialog.vue'
import ShipCard from './components/ShipCard.vue'
import SquadronInfo from './components/SquadronInfo.vue'
import { exportAsPdfCards } from './exports/cards'
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
import { parsePrintable, printableVersion } from './model/printable'
import { validateShip, validateSquadron } from './model/validation'

const appVersion = APP_VERSION

//
// Edit squadron
//

const squadronName = ref<string | null>(null)
const squadronTrait = ref<SquadronTrait | null>(null)
const leaderTrait = ref<string | null>(null)

//
// Edit ships
//

interface ShipRecord {
  id: number
  ship: Ship
}

const squad = ref<ShipRecord[]>([])

function handleSquadronTrait() {
  for (const record of squad.value) {
    record.ship.squadronTrait = squadronTrait.value
  }
}

const editShipDialog = useTemplateRef('edit-ship-dialog')
const confirmDeleteDialog = useTemplateRef('confirm-delete-dialog')
const confirmNewSquadronDialog = useTemplateRef('confirm-new-squadron-dialog')
const shipToEdit = ref(Corvette())
const shipIdToEdit = ref(0)

let nextId = 1
function handleAddShip(t: ShipType) {
  let ship: Ship
  if (t === ShipType.Snubfighter) {
    ship = Snubfighter({
      weaponsBase: [{ firepower: Rating.D6, arc: WeaponArc.Front }],
      pilotBase: Rating.D6,
      squadronTrait: squadronTrait.value,
    })
  } else if (t === ShipType.Gunship) {
    ship = Gunship({ pilotBase: Rating.D6, squadronTrait: squadronTrait.value })
  } else {
    ship = Corvette({
      pilotBase: Rating.D6,
      squadronTrait: squadronTrait.value,
    })
  }

  const record = { id: nextId, ship }
  nextId++
  squad.value.push(record)
  handleEdit(record)
}

function handleEdit(record: ShipRecord) {
  shipToEdit.value = record.ship.copy()
  shipIdToEdit.value = record.id
  editShipDialog.value?.showDialog()
}

function handleUpdateShip(ship: Ship) {
  const newSquad = squad.value.map((r) => {
    if (r.id === shipIdToEdit.value) {
      return { id: r.id, ship }
    }
    return r
  })
  squad.value = newSquad

  editShipDialog.value?.closeDialog()
}

function handleClone(record: ShipRecord) {
  const clonedRecord = {
    id: nextId++,
    ship: record.ship.copy(),
  }
  const idx = squad.value.findIndex((r) => r.id === record.id)
  squad.value.splice(idx, 0, clonedRecord)
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

const squadronErrors = computed(() =>
  validateSquadron(squad.value.map((r) => r.ship) as Ship[])
)

const showNav = ref(false)

function saveAsTextFile(textToWrite: string, filenameToSaveAs: string) {
  let textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' })
  let downloadLink = document.createElement('a')
  downloadLink.download = filenameToSaveAs
  downloadLink.innerHTML = 'Download file'

  if (window.webkitURL != null) {
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob)
  } else {
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob)
    downloadLink.style.display = 'none'
    document.body.appendChild(downloadLink)
  }

  downloadLink.click()
}

function exportSquadron() {
  let text = `${squadronName.value}\n${squadronTrait.value}\n${leaderTrait.value}\n`
  text = squad.value.reduce(
    (acc, r) => acc + printableVersion(r.ship as Ship) + '\n',
    text
  )
  saveAsTextFile(text, (squadronName.value || 'squadron') + '.txt')
}

function importSquadron() {
  document.getElementById('hidden-file-input')?.click()
}

function readSquadronFile(event: any) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const fileContent = e.target?.result as string
      const lines = fileContent.split('\n')
      squadronName.value = lines[0]
      squadronTrait.value = handleNull(lines[1]) as SquadronTrait
      leaderTrait.value = handleNull(lines[2])

      const parsedShips = lines
        .slice(3)
        .filter((l) => l.trim().length > 0)
        .map((l) => {
          const parsed = parsePrintable(l)
          parsed.squadronTrait = squadronTrait.value
          return { id: nextId++, ship: parsed }
        })
      squad.value = parsedShips

      showNav.value = false
    }
    reader.readAsText(file)
  }
}

function handleNull(s: string): string | null {
  const trimmed = s.trim()
  return trimmed != '' && trimmed != 'null' ? s : null
}

async function newSquadron() {
  const deleteIt = await confirmNewSquadronDialog.value?.showDialog()
  if (deleteIt) {
    squadronName.value = null
    squadronTrait.value = null
    leaderTrait.value = null
    squad.value = []
    showNav.value = false
  }
  return deleteIt
}

function printCards() {
  exportAsPdfCards(
    squadronName.value,
    squadronTrait.value,
    leaderTrait.value,
    squad.value.map((r) => r.ship) as Ship[]
  )
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click="showNav = !showNav"></v-app-bar-nav-icon>
      <v-app-bar-title>Voidfighter Squadron Builder</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="showNav" color="blue-lighten-4" temporary>
      <v-list-item
        title="New Squadron"
        link
        prepend-icon="mdi-file-document-plus"
        @click="newSquadron"
      ></v-list-item>

      <v-divider thickness="2"></v-divider>

      <v-list-item
        title="Import Text File"
        link
        prepend-icon="mdi-import"
        @click="importSquadron"
      ></v-list-item>
      <v-list-item
        title="Export Text File"
        link
        prepend-icon="mdi-export"
        @click="exportSquadron"
      ></v-list-item>

      <v-divider thickness="2"></v-divider>

      <v-list-item
        title="Export PDF Cards"
        link
        prepend-icon="mdi-cards"
        @click="printCards"
      ></v-list-item>

      <template #append>
        <v-list-item prepend-icon="mdi-information"
          >Version {{ appVersion }}</v-list-item
        >
        <v-list-item
          prepend-icon="mdi-github"
          link
          href="https://github.com/ccprince/voidfighter"
          target="_blank"
          rel="noopener noreferrer"
          >Github</v-list-item
        >
      </template>
    </v-navigation-drawer>

    <v-main id="main" class="mt-12 pa-5">
      <SquadronInfo
        v-model:squadron-name="squadronName"
        v-model:squadron-trait="squadronTrait"
        v-model:leader-trait="leaderTrait"
        :totalWithoutPilots="totalWithoutPilots"
        :totalWithPilots="totalWithPilots"
        :errors="squadronErrors"
        @update:squadron-trait="handleSquadronTrait"
      ></SquadronInfo>

      <v-sheet class="d-flex flex-wrap align-start ga-3 mb-4">
        <ShipCard
          v-for="r in squad"
          key="r.id"
          :ship="r.ship as Ship"
          :messages="validateShip(r.ship as Ship)"
          @edit="handleEdit(r as ShipRecord)"
          @delete="handleDelete(r as ShipRecord)"
          @clone="handleClone(r as ShipRecord)"
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
      <ConfirmNewSquadron
        ref="confirm-new-squadron-dialog"
      ></ConfirmNewSquadron>

      <input
        type="file"
        id="hidden-file-input"
        style="display: none"
        @change="readSquadronFile"
      />
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
