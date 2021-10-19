import Avatar from '@/components/Avatar'

import focus from '@/assets/scripts/directives/focus'

import service from '@/assets/scripts/service'
import utils from '@/assets/scripts/utils/index'
import api from '@/assets/scripts/api'
import constValues from '@/assets/scripts/const'
import * as store from '@/store'

import Antd, { Pagination } from 'ant-design-vue'
import anfoUI from '@anfo/ui'
import { LoadingOutlined } from '@ant-design/icons-vue'

export default {
    install(app){
        app.use(Antd)
        app.use(anfoUI, {
            loadingIcon: (<LoadingOutlined style={{fontSize: '24px'}} spin />),
            listPagination: <Pagination size="small"></Pagination>,
            listScrollDataMapper: d=>d?.data
        })

        app.component('avatar', Avatar)

        app.use(focus)

        app.config.globalProperties.$utils = utils
        app.config.globalProperties.$filters = utils.routePathFilters
        app.config.globalProperties.$service = service
        app.config.globalProperties.$api = api
        app.config.globalProperties.$const = constValues
        app.config.globalProperties.$store = store
        app.config.globalProperties.$state = store.state
    }
}