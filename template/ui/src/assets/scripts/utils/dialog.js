import { createApp, reactive, ref } from "vue"
import Antd from 'ant-design-vue'

import InputDialog from '@/components/dialog/Input.vue'
import LoginDialog from '@/components/dialog/Login.vue'
import RegisterDialog from '@/components/dialog/Register.vue'
import ForgetPasswordDialog from '@/components/dialog/ForgetPassword.vue'

import plugins from '@/assets/scripts/plugins'

import router from '@/router'

export default {
    openDialog(DialogComponent, params){

        // const { ref, reactive, createApp } = Vue

        let app, div
        let visible = ref(true)
        params = reactive(params || {})
        return new Promise((r, reject)=>{
            app = createApp({
                components: {
                    DialogComponent
                },
                render(){
                    return <dialog-component
                        v-model={[visible.value, 'visible']}
                        {...params}
                        onR={r}
                        onReject={reject}></dialog-component>
                }
            })
            app.use(Antd)
            app.use(plugins)
            app.use(router)
            div = document.createElement('div')
            document.body.appendChild(div)
            app.mount(div)
        }).finally(()=>{
            visible.value = false
            setTimeout(()=>{
                app?.unmount()
                if(div){
                    document.body.removeChild(div)
                }
            }, 3000)
        })
    },

    openInputDialog(params){
        return this.openDialog(InputDialog, params)
    },
    openLoginDialog(){
        return this.openDialog(LoginDialog)
    },

    openRegisterDialog(){
        return this.openDialog(RegisterDialog)
    },
}