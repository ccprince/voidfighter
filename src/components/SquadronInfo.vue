<script setup lang="ts">
import { SquadronTrait } from '@/model/model'

const props = defineProps<{
  totalWithoutPilots: number
  totalWithPilots: number
  errors: string[]
}>()

const squadronName = defineModel<string | null>('squadronName')
const squadronTrait = defineModel<SquadronTrait | null>('squadronTrait')
const leaderTrait = defineModel<string | null>('leaderTrait')

const squadronTraitItems = [
  { title: 'None', value: null },
  ...Object.values(SquadronTrait).map((t) => ({ title: t, value: t })),
]

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
const leaderTraitItems = [
  { title: 'None', value: null },
  ...validLeaderTraits.map((t) => ({ title: t, value: t })),
]
</script>

<template>
  <v-container class="mb-3">
    <v-row>
      <v-col class="pl-0 pr-0 pb-0 pr-lg-2" cols="12" sm="8" lg="10" order="1">
        <v-text-field
          label="Name"
          v-model="squadronName"
          hide-details
        ></v-text-field>
      </v-col>
      <v-col
        class="pl-0 pr-0 pb-0 pr-sm-2"
        cols="12"
        sm="6"
        order="2"
        order-sm="3"
      >
        <v-select
          label="Squadron Trait"
          v-model="squadronTrait"
          :items="squadronTraitItems"
          hide-details
        ></v-select>
      </v-col>
      <v-col class="pl-0 pr-0" cols="12" sm="6" order="3" order-sm="4">
        <v-select
          label="Leader Trait"
          v-model="leaderTrait"
          :items="leaderTraitItems"
          hide-details
        ></v-select>
      </v-col>
      <v-col class="pl-0 pr-0" cols="12" sm="4" lg="2" order="4" order-sm="2">
        <v-container class="pt-0 pt-sm-4">
          <v-row class="justify-start justify-sm-end">
            Total points (without pilots): <b>{{ totalWithoutPilots }}</b>
          </v-row>
          <v-row class="justify-start justify-sm-end">
            Total points (with pilots): <b>{{ totalWithPilots }}</b>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-row v-if="errors.length > 0" class="bg-red-lighten-4 pl-3 pr-3">
      <v-col>
        <ul>
          <li v-for="e in errors">{{ e }}</li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>
