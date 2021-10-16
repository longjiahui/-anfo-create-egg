import { reactive, computed } from "vue"
import { throttle, queueUp } from '@anfo/promisequeue'
import router from '@/router'

export default {
    pageData({
        api,
        pageSize = 10,
        datas = res=>res,
        // (reset: boolean, d: array)
        setter
    } = {}){
        let noMoreData = false
        let page = 1
        return queueUp(async function(options, ...rest){
            let { reset = false, page:_page, pageSize:_pageSize } = options || {}
            if(_page){
                return api.call(this, {page: _page++, pageSize: _pageSize || pageSize}, ...rest).then(res=>{
                    let d = datas(res)
                    if(typeof setter === 'function'){
                        setter.call(this, reset, d)
                    }
                })
            }else{
                if(reset){
                    page = 1
                    noMoreData = false
                }
                if(!noMoreData){
                    return api.call(this, {page: page++, pageSize}, ...rest).then(res=>{
                        let d = datas(res)
                        if(d.length < pageSize){
                            noMoreData = true
                            console.debug('no more data')
                        }
                        if(typeof setter === 'function'){
                            setter.call(this, reset, d, noMoreData)
                        }
                        return {
                            data: d,
                            noMoreData,
                            reset
                        }
                    })
                }else{
                    return {
                        data: [],
                        noMoreData,
                        reset,
                    }
                }
            }
        })
    },

    // 滚动
    createScrollPaginationContext({condition = {}, props = {}, api, pageDataProps = {}, dataHandler = d=>d} = {}){
        let data = reactive({
            datas: [],
            total: 0,
            pageSize: 20,
            noMoreData: false,
            isLoading: false,
            ...props,
        })

        let _refreshDatas = throttle(this.pageData({
            api: pageParams=>api({
                ...pageParams,
                ...(()=>condition instanceof Function?condition():condition)()
            }),
            pageSize: data.pageSize,
            datas: r=>{
                data.total = r.total
                return r.data
            },
            setter(reset, d, noMoreData){
                if(reset){
                    data.datas = d
                }else{
                    data.datas.push(...d)
                }
                data.noMoreData = noMoreData
                data.datas = dataHandler?.(data.datas)
            },
            ...pageDataProps,
        }))

        let refreshDatas = (...rest)=>{
            data.isLoading = true
            return _refreshDatas(...rest).finally(()=>{
                data.isLoading = false
            })
        }

        return {
            data,
            refreshDatas,
            handleData(){
                if(dataHandler instanceof Function){
                    data.datas = dataHandler(data.datas)
                }
            }
        }
    },

    // 非滚动
    createPaginationContext({condition = {}, props = {}, api} = {}){
        let data = reactive({
            datas: [],
            total: 0,
            page: 1,
            pageSize: 20,
            isLoading: false,
            ...props
        })
        let refreshDatas = throttle(()=>{
            data.isLoading = true
            return api({
                page: data.page,
                pageSize: data.pageSize,
                ...(()=>condition instanceof Function?condition():condition)(),
            })
            .finally(()=>data.isLoading = false)
            .then(res=>{
                data.datas = res.data
                data.total = res.total
                return res
            })
        })

        return {
            data,
            refreshDatas,
            totalPage: computed(()=>Math.ceil(data.total / data.pageSize)),
        }
    },

    routePathFilters: computed(()=>{
        let route = router?.currentRoute?.value
        let types = route.params.types
        let args = route.params.args
        types = types?.split(' ') || []
        args = args?.split(' ') || []
        function getArgByType(type){
            let ind = types.findIndex(t=>t === type)
            return ind > -1?args[ind]:null
        }
        return types.reduce((t, type)=>{
            if(type){
                t[type] = getArgByType(type) || true
            }
            return t
        }, {})
    }),

    makeURLByFilters(filters = {}, baseRoute = ''){
        let types = ''
        let args = ''
        Object.keys(filters).forEach((t, i)=>{
            let val = filters[t]
            types += `${i !== 0?' ':''}${t}`
            args += `${i !== 0 && val!=null?' ':''}${val}` || ''
        })
        return types?.length > 0?`${baseRoute}/${types}/${args}`:(baseRoute?baseRoute:'/')
    },
    routeToNewFilters(filters, baseRoute){
        router.push(this.makeURLByFilters(filters, baseRoute))
    },
    makeURLByAddingFilter(filter, baseRoute){
        return this.makeURLByFilters({...this.routePathFilters.value, ...filter}, baseRoute)
    },
    routeByAddingFilter(filter, baseRoute){
        router.push(this.makeURLByAddingFilter(filter, baseRoute))
    },
    routeByDeleteFilter(key, baseRoute){
        let toFilters = {...this.routePathFilters.value}
        delete toFilters[key]
        this.routeToNewFilters(toFilters, baseRoute)
    },
    routeByModifyFilters({baseRoute, addFilters, resetFields} = {}){
        let toFilters = {...this.routePathFilters.value, ...addFilters}
        
        let fields = resetFields
        if(typeof resetFields === 'string'){
            fields = resetFields.split(' ')
        }
        fields.forEach(f=>{
            delete toFilters[f]
        })
        
        return this.routeToNewFilters(toFilters, baseRoute)
    },
    routeByResetAll(baseRoute){
        this.routeToNewFilters({}, baseRoute)
    }
}