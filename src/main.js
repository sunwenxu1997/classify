import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { Tabbar, TabbarItem, TreeSelect, Image as VanImage, Lazyload, Loading } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(createPinia())
    .use(router)
    .use(Tabbar)
    .use(TabbarItem)
    .use(TreeSelect)
    .use(VanImage)
    .use(Lazyload)
    .use(Loading)

app.mount('#app')
