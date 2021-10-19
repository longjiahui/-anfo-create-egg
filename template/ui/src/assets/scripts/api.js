import _axios from 'axios'
import { message } from 'ant-design-vue'
import cookie from 'cookie'
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

let api = createAPI()
export default api