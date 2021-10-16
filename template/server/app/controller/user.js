const KEY_TOKEN = 'token'

module.exports = app=>class UserController extends app.Controller{

    setLoginTokenAsCookie(token){
        this.ctx.cookies.set(KEY_TOKEN, token, {
            // maxAge 此处毫秒数
            maxAge: 90 * 24 * 3600 * 1000,
        })
    }

    removeLoginTokenCookie(){
        this.ctx.cookies.set(KEY_TOKEN, null)
    }

    async register(ctx){
        await ctx.v({
            name$: 'username',
            email: 'email',
            password: 'password',
        })

        let { email, password, name } = ctx.request.body

        let user = await ctx.model.User.findOne({
            email
        })
        if(user){
            ctx.body = this.service.ret.error(0, '该邮箱已注册')
            return
        }

        const token = app.jwtSignByEmailCode({
            email, name,
            password: ctx.helper.md5Password(password),
            isVerified: true,
            exp: Math.floor(Date.now() / 1000) + (60 * 20)
        })
        await this.service.email.send(email, '注册激活邮件', `感谢您的注册，token：${token}`)
        ctx.body = this.service.ret.success()
    }

    // 修改密码
    async sendCodeForChangingPassword(ctx){
        await ctx.v({
            email: 'email',
            password: 'password'
        })

        let { email, password } = ctx.request.body
        const token = app.jwtSignByEmailCode({
            email,
            password: ctx.helper.md5Password(password),
            isVerified: true,
            exp: Math.floor(Date.now() / 1000) + (60 * 20)
        })
        await this.service.email.send(email, '忘记密码', `使用下面的token来完成重置密码的最后一步吧！<br><br>${token}`)
        ctx.body = this.service.ret.success()
    }
    
    // 通过email接收的token 来保存账户敏感数据，密码/是否认证邮箱
    async saveSensitiveDataByEmail(ctx){
        await ctx.v({
            token: 'truthyString'
        })
        let { token } = ctx.request.body
        token = token.trim()
        let data
        try{
            data = app.jwtVerifyByEmailCode(token)
        }catch(err){
            // 可能失效了
            console.error(err)
            ctx.body = this.service.ret.error(0, 'token失效了')
            return
        }
        let { email } = data

        let user = await ctx.model.User.findOne({
            email
        })
        if(!user){
            user = await ctx.model.User.create(data)
        }else{
            await ctx.model.User.updateOne({
                email,
            }, {
                $set: data
            })
        }

        const loginToken = app.jwtSign(user.toObject())
        this.setLoginTokenAsCookie(loginToken)
        ctx.body = this.service.ret.success(loginToken)
    }

    // 验证已注册的邮箱
    async sendCodeForVerification(ctx){
        let { email } = ctx.state.user

        const token = app.jwtSignByEmailCode({
            email,
            isVerified: true,
            exp: Math.floor(Date.now() / 1000) + (60 * 20)
        })
        await this.service.email.send(email, '注册激活邮件', `感谢您的注册！请使用下面的token来完成注册的最后一步吧！<br><br>${token}`)
        ctx.body = this.service.ret.success()
    }


    async login(ctx){
        await ctx.v({
            email: 'email',
            password: 'password',
        })

        let { email, password } = ctx.request.body
        let user = await ctx.model.User.findOne({ email, password: ctx.helper.md5Password(password) })
        if(!user){
            ctx.body = this.service.ret.error(0, '邮箱和密码不匹配')
            return
        }
        const token = app.jwtSign(user.toObject())
        this.setLoginTokenAsCookie(token)
        ctx.body = this.service.ret.success(token)
    }

    async logout(ctx){
        this.removeLoginTokenCookie()
        ctx.body = this.service.ret.success()
    }

    async delete(ctx){
        let user = ctx.state.user
        const userID = user._id

        await ctx.model.GroupMember.deleteMany({
            user: userID
        })

        // 删除所有plans
        await ctx.model.Plan.deleteMany({
            user: userID
        })

        // 删除所有通知
        await ctx.model.Notify.deleteMany({
            user: userID
        })

        // 删除该user
        await ctx.model.User.deleteOne({ _id: userID })

        ctx.body = this.service.ret.success()
    }

    async preview(ctx){
        await ctx.v({
            userID: 'objectID',
        })
        let { userID } = ctx.request.body

        let user = await this.service.user.preview(userID)
        if(!user){
            ctx.body = await this.service.ret.error(1, '用户不存在')
            return
        }

        ctx.body = this.service.ret.success(user)
    }

    async myInfo(ctx){
        let user = ctx.state.user
        const _id = user._id

        let myInfo = await ctx.model.User.findOne({ _id }, '-password')
        myInfo = myInfo?.toObject()
        if(!myInfo){
            ctx.body = this.service.ret.error(0, '查无此人')
            this.removeLoginTokenCookie()
            return
        }

        myInfo.myTags = await ctx.model.Plan.distinct('tags', { user })

        // unread notifies
        let unreadCount = await ctx.model.Notify.countDocuments({ read: false })
        myInfo.unreadCount = unreadCount || 0

        ctx.body = this.service.ret.success(myInfo)
    }

    async modify(ctx){
        await ctx.v({
            // 一定有_id
            _id: 'objectID',

            name$: 'username',
            avatar$: 'string',
            desc$: 'string',
            isEmailProtected$: 'boolean',
            isShowDonePlans$: 'boolean',
        })

        ctx.body = await this.service.ret.save({
            model: ctx.model.User,
            dataHandlerWhenUpdate: d=>({$set: d}),
            fields: 'name avatar desc isEmailProtected isShowDonePlans'
        })
    }

    // 反馈
    async feedback(ctx){
        await ctx.v({
            content: 'truthyString'
        })
        let { content } = ctx.request.body
        let user = ctx.state.user

        ctx.body = this.service.ret.success(await ctx.model.Feedback.create({
            content,
            ...(user?._id?{user: user._id}:{}),
        }))
    }

    // 获得关注的用户信息
    async followUsers(ctx){
        await ctx.v({
            userID$: 'objectID',
        })

        let { userID } = ctx.request.body
        if(!userID){
            userID = ctx.state.user
        }

        ctx.body = await this.service.ret.pageData({
            model: ctx.model.Follow,
            condition: {
                user: userID,
            },
            queryHandler: q=>q.populate('follow', 'name avatar desc').sort('follow.name')
        })
    }

    // 关注用户
    async follow(ctx){
        await ctx.v({
            userID: 'objectID'
        })
        let { userID } = ctx.request.body
        let follow = await ctx.model.User.findOne({ _id: userID })
        if(!follow){
            ctx.body = this.service.ret.error(0, '查无此人')
            return
        }
        let user = ctx.state.user
        // await ctx.model.Follow.create({
        //     follow: userID,
        //     user,
        // })
        await ctx.model.Follow.findOneAndUpdate({ follow: userID, user }, { follow: userID, user }, { upsert: true, })
        ctx.body = this.service.ret.success()
    }
    // 取消关注
    async cancelFollow(ctx){
        await ctx.v({
            userID$: 'objectID'
        })
        let { userID } = ctx.request.body
        await ctx.model.Follow.deleteOne({
            follow: userID,
            user: ctx.state.user
        })
        ctx.body = this.service.ret.success()
    }

    async pageData(ctx){
        await ctx.v({
            keyword$: 'string',
        })

        let { keyword } = ctx.request.body

        let condition = {}
        if(keyword){
            condition.$or = []
            if(await ctx.validate(keyword, 'objectID')){
                condition.$or.push( {_id: keyword} )
            }
            condition.$or.push({name: {$regex: new RegExp(keyword)}})
        }

        ctx.body = await this.service.ret.pageData({
            model: ctx.model.User,
            projection: 'name avatar desc',
            condition
        })
    }

    // 发送邮件验证码
    // async sendCodeToEmail(ctx){
    //     await ctx.v({
    //         email: 'email'
    //     })
    //     let { email } = ctx.request.body
    //     // 20 mins 失效
    //     const token = app.jwtSign({ email, exp: Math.floor(Date.now() / 1000) + (60 * 20)})
    // }
}