import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//antd
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

// import 'github-markdown-css/github-markdown.css'

let app = createApp(App)
    .use(router)
    .use(Antd)

import plugins from '@/assets/scripts/plugins'
app.use(plugins)

app.mount('#app')