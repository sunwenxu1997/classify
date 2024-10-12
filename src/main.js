import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { Tabbar, TabbarItem, TreeSelect, Image as VanImage, Lazyload, Loading, Icon, Empty } from 'vant'
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
    .use(Icon)
    .use(Empty)

app.mount('#app')
