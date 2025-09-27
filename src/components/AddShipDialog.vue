<script setup lang="ts">
import { ShipType } from '@/model/model'
import { ref } from 'vue'

const emit = defineEmits(['newShip'])
const dialog = ref(false)

function chooseType(type: ShipType) {
  dialog.value = false
  emit('newShip', type)
}
</script>

<template>
  <v-dialog max-width="300" v-model="dialog">
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" text="Add Ship" color="primary"></v-btn>
    </template>

    <template #default="{ isActive }">
      <v-card title="Add Ship" subtitle="Which kind of ship do you want?">
        <v-card-text>
          <v-btn block class="mb-2" @click="chooseType(ShipType.Snubfighter)"
            >Snubfighter</v-btn
          >
          <v-btn block class="mb-2" @click="chooseType(ShipType.Gunship)"
            >Gunship</v-btn
          >
          <v-btn block @click="chooseType(ShipType.Corvette)">Corvette</v-btn>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Cancel"
            @click="isActive.value = false"
            color="error"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
