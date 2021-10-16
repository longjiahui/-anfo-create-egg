<template>
    <a-modal
        okText="确定"
        cancelText="取消"
        :okButtonProps="{
            disabled: !validateState
        }"
        @ok="handleDone"
        width="250px"
        :mask-closable="maskClosable"
        @cancel="$emit('reject')">
        <template #title>
            <div class="vblock-s">
                <div>{{title}}</div>
                <div v-if="desc" class="desc">{{desc}}</div>
            </div>
        </template>
        <!-- <div v-if="desc" class="vblock-s" style="padding: 16px">
            <div class="desc">
                {{desc}}
            </div>
            <a-input v-focus @keyup.enter="handleDone" v-model:value="value" :placeholder="placeholder" :type="type"></a-input>
        </div> -->
        <div class="hblock hblock-s input-wrapper">
            <input class="input" v-focus @keyup.enter="handleDone" v-model="value" :placeholder="placeholder" :type="type">
            <a-tooltip v-if="!validateState" :title="validate?.[1]">
                <transition appear name="fade-tr">
                    <div class="clickable error-flag"><ExclamationCircleOutlined /></div>
                </transition>
            </a-tooltip>
        </div>
    </a-modal>
</template>
<script>
import { computed, ref, toRefs } from 'vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
export default {
    props: {
        title: {
            type: String,
            default: '输入'
        },
        type: {
            type: String,
            default: 'text'
        },
        // 默认的输入内容
        content: String,
        placeholder: String,
        // 点击背后的背景是否可以关闭modal
        maskClosable: {
            type: Boolean,
            default: true,
        },
        validate: {
            type: Array,
            default: ()=>['.*', '输入内容错误']
        },
        desc: String,
    },
    setup(props, context){
        let value = ref(props.content || '')

        let validateState = computed(()=>{
            let rule = props.validate?.[0]
            if(rule instanceof Function){
                return rule?.(value.value)
            }else if(rule instanceof RegExp){
                return rule.test(value.value)
            }else if(typeof rule === 'string'){
                return new RegExp(rule).test(value.value)
            }else{
                return true
            }
        })

        return {
            ExclamationCircleOutlined,
            validateState,
            ...toRefs(props),
            value,
            handleDone(){
                if(validateState.value){
                    context.emit('r', value.value)
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.desc{
    color: #666;
    font-size: .8em;
}
.input-wrapper{
    background: whitesmoke;
    padding: 8px 24px;
}
.input{
    width: 100%;
    // padding: 8px 24px;
    border: none;
    font-size: 1.1em;
    background: transparent;

    &:focus{
        outline: none;
    }
}

.error-flag{
    color: #ff7875;
}
</style>