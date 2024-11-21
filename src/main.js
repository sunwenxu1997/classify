import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import $axios from './utils/http'

import App from './App.vue'
import router from './router'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app
  .use(createPinia())
  .use(router)
  .use(Vant)
  .use(Lazyload)

// app.use($axios)

app.mount('#app')
