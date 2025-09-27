<script setup lang="ts">
import { SquadronTrait } from '@/model/model'

const props = defineProps<{
  totalWithoutPilots: number
  totalWithPilots: number
  errors: string[]
}>()

const squadronName = defineModel<string>('squadronName')
const squadronTrait = defineModel<SquadronTrait>('squadronTrait')
const leaderTrait = defineModel<string>('leaderTrait')

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
</script>

<template>
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
      <v-row v-if="errors.length > 0">
        <ul>
          <li v-for="e in errors">{{ e }}</li>
        </ul>
      </v-row>
    </v-container>
  </v-sheet>
</template>
