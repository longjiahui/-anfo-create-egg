import api from './api'
import utils from './utils'
import { actions, mutations, state } from '@/store'

export default {
    saveSensitiveDataByInputCode({autoUpdateMyInfo = true} = {}){
        return utils.openInputDialog({
            maskClosable: false,
            desc: 'token已经通过邮件发送到该邮箱中，请登录邮箱查看后粘贴到此处',
            placeholder: '请输入token'
        }).then(token=>{
            if(token){
                return api.user.saveSensitiveDataByEmail({
                    token
                }).then(()=>{
                    if(autoUpdateMyInfo){
                        return actions.updateMyInfo()
                    }
                })
            }
        })
    },
    message(content, props = {}){
        return utils.openMessageDialog({
            content,
            ...props,
        })
    },
    selectTag({tag} = {}){
        return utils.openSelectDialog({
            title: '选择Tag',
            width: '250px',
            options: state.myTags?.value,
            formatter: d=>d,
            selected: state.myTags.value?.findIndex(t=>t === tag),
        }).then(({option, index})=>{
            return option
        })
    },
    createGroup(){
        return utils.openInputDialog({
            title: '创建咕噜',
            desc: '请输入咕噜的名字',
            placeholder: '名字',
        }).then(name=>{
            return api.group.save({ name }).then(group=>{
                console.debug('save group done: ', group)
                mutations.pushMyGroup(group)
                return group
            })
        })
    }
}