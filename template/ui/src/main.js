import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'ant-design-vue/dist/antd.css'
import '@anfo/ui/dist/anfoUI.css'

let app = createApp(App)
    .use(router)

import plugins from '@/assets/scripts/plugins'
app.use(plugins)

app.mount('#app')