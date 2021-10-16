<template>
    <a-modal
        @cancel="handleCancel"
        :width="width"
        :footer="null"
        :title="title || '选择'">
        <div style="padding: 16px">
            <div
                v-for="(o, i) in options"
                :key="i" 
                @click="select(o, i)"
                :class="['option', selected === i?'selected':'']">
                <div class="index">{{i + 1}}</div>
                <div class="main">{{formatter(o)}}</div>
            </div>
        </div>
    </a-modal>
</template>

<script>
import { ref, toRefs } from 'vue'
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: ()=>([])
        },
        width: {
            type: String,
            default: '200px'
        },
        formatter: {
            type: Function,
            default: d=>d
        },
        // 表明初始时候选中的项
        selected: {
            type: Number,
            default: 0
        }
    },
    setup(props, context){
        let { title, options, width, formatter } = toRefs(props)
        let selected = ref(Math.max(0, Math.min(props.selected, options.value.length - 1)))

        let select = (o, i)=>{
            context.emit('r', {option: o, index: i})
        }

        // 监听全局键盘事件
        let keyupHandler = e=>{
            if(!isNaN(+e.key)){
                let key = +e.key - 1
                if(key >= 0 && key < options.value?.length){
                    select(options.value?.[key], key)
                }
            }else if(e.key === 'ArrowDown'){
                selected.value = (selected.value + 1) % options.value.length
            }else if(e.key === 'ArrowUp'){
                selected.value = (selected.value - 1 < 0)?(options.value.length - 1):(selected.value - 1)
            }else if(e.key === 'Enter'){
                select(options.value?.[selected.value], selected.value)
            }
        }
        document.addEventListener('keyup', keyupHandler)

        return {
            selected,
            title,
            options,
            width,
            formatter,
            select,
            handleCancel(){
                document.removeEventListener('keyup', keyupHandler)
                context.emit('reject')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.option{
    padding: 8px;
    display: flex;
    // justify-content: center;
    align-items: center;
    transition: background-color .3s;
    cursor: pointer;

    .index{
        flex-shrink: 0;
        color: #999;
        padding-left: 8px;
        margin-right: 8px;
    }
    .main{
        flex: 1;
        text-align: center;
    }

    &.selected, &:hover{
        background-color: whitesmoke;
    }
}
</style>