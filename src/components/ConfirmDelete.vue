<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref(false)
const name = ref('')
let resolve: ((value: boolean) => void) | null = null

const showDialog = (nameToDelete: string) => {
  dialog.value = true
  name.value = nameToDelete
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
      <v-card-text
        >Are you sure you want to delete <b>{{ name }}</b
        >?</v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="choose(false)">Cancel</v-btn>
        <v-btn
          prepend-icon="mdi-trash-can"
          color="error"
          variant="flat"
          @click="choose(true)"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
