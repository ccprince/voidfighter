import '@mdi/font/css/materialdesignicons.css'
import { createApp } from 'vue'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App).use(vuetify).mount('#app')
