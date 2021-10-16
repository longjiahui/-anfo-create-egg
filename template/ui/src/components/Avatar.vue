<template>
    <div class="avatar img-bg" :style="{
        '--size': `${size}px`,
        ...(
            type === TYPE_DEFAULT?{
                backgroundImage: `url(${$utils.getImageURL(`/head/${avatar}`, (+size) * 2)})`
            }:{
                backgroundImage: `url(${avatar})`
            }
        )
    }"></div>
</template>

<script>
import { computed, ref, toRefs } from 'vue'
import Avatar from '@/assets/scripts/avatar'

const TYPE_AUTOGEN = 'autogen'
const TYPE_DEFAULT = 'default'

export default {
    props: {
        size: String,
        user: {
            type: Object,
            default: ()=>({})
        },
    },
    setup(props, context){
        let { size, user } = toRefs(props)
        let type = computed(()=>user.value?.avatar?TYPE_DEFAULT:TYPE_AUTOGEN)
        let avatar = computed(()=>{
            if(type.value === TYPE_AUTOGEN){
                return new Avatar({size: size.value * 3, text: user?.value?.name?.[0]}).toDataURL()
            }else{
                return  user.value?.avatar
            }
        })
        return {
            avatar,
            type,
            TYPE_AUTOGEN,
            TYPE_DEFAULT
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar{
    flex-shrink: 0;
    width: var(--size);
    height: var(--size);
    border-radius: 100%;
}
</style>