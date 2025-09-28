<script setup lang="ts">
import { costWithoutPilot, costWithPilot } from '@/model/cost'
import { Ship } from '@/model/model'
import { formatWeapon } from '@/model/printable'

interface Props {
  ship: Ship
  messages: string[]
}

const props = defineProps<Props>()

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-container class="shipcard pa-0 position-relative" v-bind="props">
      <v-row class="darkest" no-gutters>
        <v-col cols="12">
          {{ ship.name }} ({{ ship.shipType.toLowerCase() }})
          {{ costWithoutPilot(ship) }} ({{ costWithPilot(ship) }})
        </v-col>
      </v-row>
      <v-row class="light" no-gutters>
        <v-col class="border-e pa-1">Spd</v-col>
        <v-col class="border-e pa-1">Def</v-col>
        <v-col class="border-e pa-1">FP</v-col>
        <v-col class="pa-1">Plt</v-col>
      </v-row>
      <v-row class="medium" no-gutters>
        <v-col class="border-e pa-1">{{ ship.speed }}</v-col>
        <v-col class="border-e pa-1">{{ ship.defense }}</v-col>
        <v-col class="border-e pa-1">
          <ul class="firepower">
            <li v-for="w in ship.weapons">{{ formatWeapon(w) }}</li>
          </ul>
        </v-col>
        <v-col class="pa-1">{{ ship.pilot }}</v-col>
      </v-row>
      <v-row class="light" no-gutters>
        <v-col class="pa-1">{{ ship.upgrades.join(', ') }}</v-col>
      </v-row>
      <v-row no-gutters v-if="messages.length > 0" class="bg-red-lighten-4">
        <v-col class="pl-6 pt-1 pb-1">
          <ul class="errors">
            <li v-for="m in messages" :key="m">{{ m }}</li>
          </ul>
        </v-col>
      </v-row>

      <v-overlay
        contained
        absolute
        v-bind:model-value="!!isHovering"
        class="align-center justify-center"
        persistent
        scrim="white"
        opacity="0.6"
      >
        <v-btn color="primary" @click="emit('edit')" class="mr-2">Edit</v-btn>
        <v-btn color="error" @click="emit('delete')">Delete</v-btn>
      </v-overlay>
    </v-container>
  </v-hover>
</template>

<style scoped>
.shipcard {
  max-width: 500px;
  text-align: center;
  border: 1px solid;
}

ul.firepower li {
  list-style-type: none;
}

ul.errors li {
  text-align: left;
}

.darkest {
  background-color: #004a80;
  color: white;
}

.light {
  background-color: #d7deeb;
  color: black;
  min-height: 29px;
}

.medium {
  background-color: #9cb1cf;
  color: black;
}

.v-col {
  border-color: black !important;
}
</style>
