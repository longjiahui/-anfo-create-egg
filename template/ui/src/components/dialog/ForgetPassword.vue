<template>
    <a-modal
        ok-text="提交"
        cancel-text="取消"
        width="320px"
        title="忘记密码"
        @cancel="$emit('reject')"
        :okButtonProps="{
            disabled: isSendingEmail
        }"
        @ok="handleSubmit">
        <div v-loading="isSendingEmail" class="vblock-xs" style="padding: 16px">
            <a-input v-model:value="email" placeholder="email"></a-input>
            <a-input v-model:value="password" placeholder="new password" type="password"></a-input>
            <a-input v-model:value="confirmPassword" placeholder="confirm new password" type="password"></a-input>
        </div>    
    </a-modal>
</template>

<script>
import { message } from 'ant-design-vue'

import { reactive, toRefs } from 'vue'
import api from '@/assets/scripts/api'
import service from '@/assets/scripts/service'

export default {
    setup(_, context){
        let data = toRefs(reactive({
            email: '',
            password: '',
            confirmPassword: '',
            isSendingEmail: false,
        }))

        return {
            ...data,
            handleSubmit(){
                if(data.password.value !== data.confirmPassword.value){
                    message.error('两次输入的密码不一致')
                    return
                }
                data.isSendingEmail.value = true
                api.user.sendCodeForChangingPassword({
                    email: data.email.value,
                    password: data.password.value
                }).finally(()=>{
                    data.isSendingEmail.value = false
                    context.emit('r')
                }).then(()=>{
                    service.saveSensitiveDataByInputCode()
                })
            }
        }
    }
}
</script>