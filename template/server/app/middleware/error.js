const errorType = require('../lib/errorType')

module.exports = ()=>async (ctx, next)=>{
    try{
        await next()
    }catch(err){
        //将参数也记录下来
        ctx.logger.error(err)
        if(err instanceof errorType.ValidateError){
            ctx.body = ctx.service.ret.error(201, '参数错误')
        }else if(err.name === 'MongoError' && +err.code === 11000){
            ctx.body = ctx.service.ret.error(204, '数据重复')
        }else if(err.name === 'CastError' && err.path === '_id'){
            ctx.body = ctx.service.ret.error(205, 'id格式错误')
        }else if(err instanceof errorType.LoginCheckError){
            ctx.body = ctx.service.ret.error(206, '登陆失败')
        }else{
            ctx.body = ctx.service.ret.error(250, '服务器错误，请联系管理员')
        }
    }
}