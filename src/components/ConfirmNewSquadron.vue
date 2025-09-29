<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)
let resolve: ((value: boolean) => void) | null = null

const showDialog = () => {
  dialog.value = true
  return new Promise((res) => {
    resolve = res
  })
}

const closeDialog = () => {
  dialog.value = false
}

const choose = (result: boolean) => {
  dialog.value = false
  if (resolve != null) {
    resolve(result)
  }
}

defineExpose({ showDialog, closeDialog })
</script>

<template>
  <v-dialog v-model="dialog" max-width="250" persistent>
    <v-card>
      <v-card-title>Confirm</v-card-title>
      <v-card-text>
        Are you sure you want to erase the current squadron and start over?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="choose(false)">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="choose(true)">
          Start Over
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
