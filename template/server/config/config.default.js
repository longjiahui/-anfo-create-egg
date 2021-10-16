const validateSchema = require('../app/lib/validateSchema')
const constValues = require('../app/lib/const')

const packageJSON = require('../package.json')
const proName = packageJSON.name

module.exports = {
    // cookie encrypt
    keys: proName,
    
    static: {
        prefix: '/',
    },

    // smtp
    smtp: {
        host: 'smtp.exmail.qq.com',
        user: '',
        password: ''
    },

    // jwt for login
    jwtSecret: proName,
    // jwt for email code
    jwtSecretForEmailCode: proName,
    
    // password md5 salt
    passwordSalt: proName, 

    // middleware
    middleware: ['error', 'log', ],

    // mongoose
    mongoose: {
        // client: {
        //     url: `mongodb://127.0.0.1/${proName}`,
        //     options: {
        //         useUnifiedTopology: true,
        //         useFindAndModify: false,
        //     },
        // }
    },

    validateSchema,
    // 常量
    constValues,
    

    // 业务相关配置
}