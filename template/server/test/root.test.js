const { app, mock, assert } = require('egg-mock/bootstrap')
const user = require('./lib/user')

before(()=>{
    app.mockCsrf()
})

afterEach(async ()=>{
    let users = user.consumeAllAonymousUser()
    await Promise.all(users.map(u=>u.destroy()))
})