const { app } = require('egg-mock/bootstrap')
const { v1: uuid } = require('uuid')
const helper = require('./helper')

let anonymousUsers = []

class User{

    constructor(token){
        this.token = token
    }

    destroy(){
        return this.post('/api/user/delete')
    }

    async init(){
        return this.postCorrect('/api/user/myInfo').then(res=>this.detail = (res.body && res.body.data) || null)
    }
    update(){
        return this.init()
    }

    async post(url, params, {v, message} = {}){
        let res = await app.httpRequest()
            .post(url)
            .set('authorization', this.token)
            .send(params)
        const rule = [{ code: 'number' }, v]
        await helper.vRes(res, rule, `
url: ${url}
params: ${JSON.stringify(params)}
body: ${JSON.stringify(res && res.body || null)}
rules: ${JSON.stringify([{ code: 'number' }, v])},
message: ${message || '(null)'}`)
        return res
    }

    // v是验证res.body 的规则！！！
    postCorrect(url, params, {v, message} = {}){
        let correctRule = {code: '>=0'}
        v = v?[correctRule, v]:correctRule
        return this.post(url, params, {v, message})
    }
    // v是验证res.body.data的规则！！！
    getDataByPost(url, params, {v, message} = {}){
        if(v){
            v = {
                data: v
            }
        }
        return this.postCorrect(url, params, {v, message}).then(res=>res.body.data)
    }
    postError(url, params, {v, message} = {}){
        let errorRule = {code: '<0'}
        v = v?[errorRule, v]:errorRule
        return this.post(url, params, {v, message})
    }
}

module.exports = {

    async getUser(){
        let ctx = app.mockContext()
        const email = `unittest@${uuid().split('-').join('')}.com`
        const password = `${uuid()}`
        await ctx.model.User.create({
            email,
            password: ctx.helper.md5Password(password)
        })
        let tokenRes = await app.httpRequest().post('/api/user/login').send({
            email,
            password
        })
        helper.assertResCorrect({
            res: tokenRes, 
            message: `登录User失败 ! ${tokenRes.text}`,
            v: {
                data: 'truthyString'
            }
        })
        const token = tokenRes.body.data
        let user = new User(token)
        await user.init()
        anonymousUsers.push(user)
        return user
    },

    consumeAllAonymousUser(){
        let users = [...anonymousUsers]
        anonymousUsers = []
        return users
    }
}