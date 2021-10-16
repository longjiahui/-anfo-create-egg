// fake store not using vuex
import { toRefs, reactive, computed } from 'vue'
import api from '@/assets/scripts/api'
import constValues from '@/assets/scripts/const'
import router from '@/router'

let state = toRefs(reactive({
    myInfo: {},
    isLoadingMyInfo: false,
}))

state.myId = computed(()=>state.myInfo.value?._id)
state.isLogin = computed(()=>!!state.myId.value)

const mutations = {
    setToken(token){
        state.token.value = token
    },
}

const actions = {
    updateMyInfo(){
        state.isLoadingMyInfo.value = true
        return api.user.myInfo({}, {
            ignoreError: true
        })
        .finally(()=>state.isLoadingMyInfo.value = false)
        .then(data=>{
            state.myInfo.value = data
        })
        .catch(err=>{
            console.error(err)
            state.myInfo.value = {}
        })
    },
}

// 尝试获得个人信息
actions.updateMyInfo().catch(err=>{
    router.push('/')
    throw err    
})

export {
    state,
    mutations,
    actions,
}