<template>
<a-modal
    title="注册"
    okText="注册"
    cancelText="取消"
    width="320px"
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    @ok="handleRegister"
    :okButtonProps="{
        disabled: isSendingEmail
    }"
    @cancel="$emit('reject')">
    <div v-loading="isSendingEmail" class="vblock-xs" style="padding: 16px">
        <a-input v-model:value="name" placeholder="name"></a-input>
        <a-input v-model:value="email" placeholder="email"></a-input>
        <a-input v-model:value="password" placeholder="password" type="password"></a-input>
        <a-input v-model:value="confirmPassword" placeholder="confirm password" type="password"></a-input>
    </div>
</a-modal>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { message } from 'ant-design-vue'

import api from '@/assets/scripts/api'
import service from '@/assets/scripts/service'

export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        }
    },
    setup(props, context){
        let { visible } = toRefs(props)
        let data = toRefs(reactive({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            isSendingEmail: false,
        }))
        return {
            ...data,
            visible,
            handleRegister(){
                if(data.password.value !== data.confirmPassword.value){
                    message.error('两次密码输入不一致')
                    return
                }
                data.isSendingEmail.value = true
                api.user.register({
                    name: data.name.value,
                    email: data.email.value,
                    password: data.password.value,
                }).finally(()=>{
                    data.isSendingEmail.value = false
                }).then(token=>{
                    context.emit('r', token)
                    return service.saveSensitiveDataByInputCode()
                })
            },
        }
    }
}
</script>