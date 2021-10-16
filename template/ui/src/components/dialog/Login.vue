<template>
<a-modal
    title="登录"
    okText="登录"
    cancelText="取消"
    width="320px"
    @ok="handleLogin"
    @cancel="$emit('reject')">
    <div class="vblock-s" style="padding: 16px">
        <a-input
            v-model:value="email"
            placeholder="email" type="email"></a-input>
        <a-input
            @keyup.enter="handleLogin"
            v-model:value="password"
            placeholder="password" type="password"></a-input>
        <div class="vblock-xxs" style="text-align: right;font-size: .8em;color: #999">
            <div class="clickable" @click="$emit('reject');$utils.openForgetPasswordDialog()" style="color: #333">忘记密码</div>
            <div style="color: #999">没有账号，先 <span class="clickable" @click="$emit('reject');$utils.openRegisterDialog()" style="color: #333;cursor:pointer">注册</span></div>
        </div>
    </div>
</a-modal>
</template>

<script>
import { reactive, toRefs } from 'vue'
import api from '@/assets/scripts/api'
import { actions } from '@/store'

export default {
    setup(props, context){
        let data = toRefs(reactive({
            email: '',
            password: '',
        }))
        return {
            ...data,
            handleUpdateVisible(){
                context.emit('update:visible', arguments[0])
            },
            handleLogin(){
                return api.user.login({
                    email: data.email.value,
                    password: data.password.value
                }).then(token=>{
                    actions.updateMyInfo()
                    context.emit('r', token)
                })
            }
        }
    }
}
</script>