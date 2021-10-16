import _axios from 'axios'
import { message } from 'ant-design-vue'
import cookie from 'cookie'
import router from '@/router'
import utils from './utils'

let axios = _axios.create({

})

// 添加请求拦截器
axios.interceptors.request.use(config=>{
    if(!config.headers){
        config.headers = {}
    }
    try{
        let csrfToken = cookie.parse(document.cookie)?.csrfToken
        config.headers['x-csrf-token'] = csrfToken
    }catch(err){
        console.error(err)
    }
    // 在发送请求之前做些什么
    return config;
})

// 添加响应拦截器
axios.interceptors.response.use(res=>{
    // 对响应数据做点什么
    if(res.data.code < 0){
        // 未登陆
        if(res.data.code === -306){
            console.debug('未登陆')
            // router.push('/')
        }
        if(!res.config.ignoreError){
            // 未登陆 且没有ignoreError的自动弹出登陆框
            if(res.data.code === -306){
                utils.openLoginDialog()
            }else{
                message.error(res.data.msg)
            }
        }
        throw new Error(`${res.config.url}: ${res.data.msg}`)
    }else if(res.data.code === 0){
        return res.data
    }else{
        return res
    }
})

/*
    raw 的效果是
    let api = createAPI()
    api.user.pageData().raw().then(data=>{// 此处的data是api返回的原数据})
    如果没有raw
    api.user.pageData().then(data=>{//此处的data 是{code: 0, data: []}中的data})
*/
let createAPI = ({route = '/api', raw = false} = {})=>new Proxy(()=>{}, {
    get(target, key){
        if(key === '$raw'){
            return createAPI({route, raw: true})
        }
        return createAPI({route: `${route}/${key}`})
    },
    apply(target, thisArg, args){
        let ret = axios.post(route, ...args)
        if(raw){
            return ret
        }else{
            return ret.then(res=>res.data)
        }
    }
})

// axios.api = createAPI()

// Object.assign(axios, {
//     user: {
//         register(params){
//             return axios.post('/api/user/register', params).then(res=>res.data)
//         },
//         login(email, password){
//             return axios.post('/api/user/login', {
//                 email,
//                 password
//             }).then(res=>res.data)
//         },
//         logout(){
//             return axios.post('/api/user/logout')
//         },
//         // userID / memberID
//         preview(params){
//             return axios.post('/api/user/preview', params).then(res=>res.data)
//         },
//         myInfo(){
//             return axios.post('/api/user/myInfo', null, {
//                 ignoreError: true
//             }).then(res=>res.data)
//         },
//         modify(user){
//             return axios.post('/api/user/modify', user)
//         },
//     },
//     groupMember: {
//         pageData(pageParams){
//             return axios.post('/api/groupMember/pageData', pageParams).then(res=>res.data)
//         },
//         removeMember(memberID){
//             return axios.post('/api/groupMember', {memberID})
//         }
//     },
//     group: {
//         detail(groupID){
//             return axios.post('/api/group/detail', {groupID}).then(res=>res.data)
//         },
//         save(params){
//             return axios.post('/api/group/save', params).then(res=>res.data)
//         },
//         pageData(pageParams = {}, params = {}){
//             return axios.post('/api/group/pageData', {
//                 ...pageParams,
//                 ...params,
//             }).then(res=>res.data)
//         },
//         preview(groupID){
//             return axios.post('/api/group/preview', { groupID }).then(res=>res.data)
//         },
//         join(groupID, message){
//             return axios.post('/api/group/join', {groupID, message}).then(res=>res.data)
//         },
//         reject(memberID){
//             return axios.post('/api/group/reject', {memberID})
//         },
//         accept(memberID){
//             return axios.post('/api/group/accept', {memberID})
//         },
//         getApplicants(pageParams, groupID = null){
//             let params = {}
//             if(groupID){
//                 params.groupID = groupID
//             }
//             return axios.post('/api/group/getApplicants', {...pageParams, ...params}).then(res=>res.data)
//         },
//     },
//     plan: {
//         save(plan){
//             return axios.post('/api/plan/save', plan).then(res=>res.data)
//         },
//         deleteByID(_id){
//             return axios.post('/api/plan/deleteByID', {_id})
//         },
//         /**
//          * params
//          * userID,memberID二选一
//          * groupID,
//          * state
//          */
//         pageData(pageParams, params){
//             return axios.post('/api/plan/pageData', {...pageParams, ...params}).then(res=>res.data)
//         }
//     },
//     sts(){
//         return axios.post('/api/sts').then(res=>res.data)
//     }
    // user: {
    //     get(userId){
    //         return axios.post('/api/user/get', {userId}, {
    //             ignoreError: true,
    //         }).then(data=>data.data)
    //     },
    //     logout(){
    //         return axios.post('/api/user/logout')
    //     }
    // },
    // posts: {
    //     pageData(pageParams, category){
    //         return axios.post('/api/post/pageData', {
    //             category, 
    //             ...pageParams
    //         }).then(res=>res.data)
    //     },
    //     detail(_id){
    //         return axios.post('/api/post/detail', {
    //             _id
    //         }).then(res=>res.data)
    //     }
    // }
// })

export default createAPI()