const { app, assert } = require('egg-mock/bootstrap')

module.exports = {
    fakeObjectID(){
        return new Array(24).fill('1').join('')
    },
    async assertResCorrect({res, v, message} = {}){
        let body = res && res.body || null
        let correctRule = {code: '>=0'}
        v = v?[correctRule, v]:correctRule
        await this.v(body, v, message)
    },
    async assertResError({res, v, message} = {}){
        let body = res && res.body || null
        let correctRule = {code: '<0'}
        v = v?[correctRule, v]:correctRule
        await this.v(body, v, message)
    },

    async v(data, rules, message = ''){
        let res = await app.mockContext().validator.v(data, rules)
        assert.ok(res, message)
        return res
    },
    async vRes(res, rules, message = ''){
        let body = res && res.body || null
        let outcome = await app.mockContext().validator.v(body, rules)
        assert.ok(outcome, message)
        return outcome
    }
}