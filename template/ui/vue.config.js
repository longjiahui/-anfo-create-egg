const packageJSON = require('./package.json')

const cdn = {
    css: [
        "https://cdn.jsdelivr.net/npm/ant-design-vue@2.2.8/dist/antd.min.css",
    ],
    js: [
        // 'https://cdn.jsdelivr.net/npm/cos-js-sdk-v5@1.2.8/dist/cos-js-sdk-v5.min.js',
        'https://cdn.jsdelivr.net/npm/uuid@8.3.2/dist/umd/uuid.min.js',

        // 'https://cdn.jsdelivr.net/npm/vue@3.0.6/dist/vue.runtime.global.prod.js',
        'https://cdn.jsdelivr.net/npm/vue@3.0.9/dist/vue.runtime.global.prod.js',

        'https://cdn.jsdelivr.net/npm/vue-router@4.0.5/dist/vue-router.global.min.js',

        'https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js',
        'https://cdn.jsdelivr.net/npm/moment@2.29.1/locale/zh-cn.js',
        'https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js',

        'https://cdn.jsdelivr.net/npm/ant-design-vue@2.2.8/dist/antd.min.js',
    ]
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
    publicPath: isProd ? '/ui/' : '/',
    outputDir: '../server/app/public/ui',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:7001'
            }
        }
    },
    productionSourceMap: false,
    chainWebpack: config => {
        config.plugin('html').tap(args=>{
            args[0].title = packageJSON.name
            return args
        })
        // if(process.env.NODE_ENV === 'production'){
            // config.externalsType('script')
            // config.externals({
            //     vue: ['https://cdn.bootcdn.net/ajax/libs/vue/3.0.7/vue.global.prod.js', 'Vue'],
            //     'vue-router': ['https://cdn.bootcdn.net/ajax/libs/vue-router/4.0.5/vue-router.global.min.js', 'VueRouter'],
            //     moment: ['https://cdn.bootcdn.net/ajax/libs/moment.js/2.29.1/moment.min.js', 'moment'],
            //     'ant-design-vue': ['https://cdn.bootcdn.net/ajax/libs/ant-design-vue/2.0.1/antd.min.js', 'antd'],
            //     uuid: ['https://cdn.bootcdn.net/ajax/libs/uuid/8.3.2/uuid.min.js', 'uuid']
            // })
        if(isProd){
            config.externals({
                vue: 'Vue',
                'ant-design-vue': 'antd',
                moment: 'moment',
                'vue-router': 'VueRouter',
                uuid: 'uuid',
                axios: 'axios',
                // 'cos-js-sdk-v5': 'COS',
                // '@ant-design/icons-vue': ''
            })
            config.plugin('html')
                .tap(args=>{
                    args[0].cdn = cdn
                    return args
                })
        }
        // }
    },
    // externals: {
    //     vue: 'Vue',
    //     'antd-design-vue': 'antd',
    // }
}