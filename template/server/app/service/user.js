module.exports = app=>class extends app.Service{
    async preview(userID){
        let ctx = this.ctx
        let user = (await ctx.model.User.findOne({_id: userID}, '-password'))?.toObject()

        if(user){
            // 假如登陆了，判断是否关注该用户
            user.isFollow = ctx.state.user && !!await ctx.model.Follow.findOne({ user: ctx.state.user?._id, follow: userID }) || false

            // 获得关注人的数量
            user.followersCount = await ctx.model.Follow.countDocuments({ follow: userID }) || 0
        }
        return user
    }
}