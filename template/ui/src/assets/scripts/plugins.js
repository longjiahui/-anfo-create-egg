import Avatar from '@/components/Avatar'

import loading from '@/assets/scripts/directives/loading'
import focus from '@/assets/scripts/directives/focus'

import service from '@/assets/scripts/service'
import utils from '@/assets/scripts/utils/index'
import api from '@/assets/scripts/api'
import constValues from '@/assets/scripts/const'
import * as store from '@/store'

// import PerfectScrollbar from 'vue3-perfect-scrollbar'
// import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.min.css'

export default {
    install(app){
        app.component('avatar', Avatar)

        app.use(loading)
        app.use(focus)
        // app.use(PerfectScrollbar)

        app.config.globalProperties.$utils = utils
        app.config.globalProperties.$filters = utils.routePathFilters
        app.config.globalProperties.$service = service
        app.config.globalProperties.$api = api
        app.config.globalProperties.$const = constValues
        app.config.globalProperties.$store = store
        app.config.globalProperties.$state = store.state
    }
}