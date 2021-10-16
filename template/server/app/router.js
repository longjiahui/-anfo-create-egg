module.exports = app => {
    const { router, controller, middleware } = app
    let jwtQuiet = middleware.jwt(true)
    let jwt = middleware.jwt()

    // user
    router.get('/api/user/register', controller.user.register)
    router.post('/api/user/saveSensitiveDataByEmail', controller.user.saveSensitiveDataByEmail)
    router.post('/api/user/sendCodeForChangingPassword', controller.user.sendCodeForChangingPassword)
    router.post('/api/user/sendCodeForVerification', jwt, controller.user.sendCodeForVerification)
    router.post('/api/user/login', controller.user.login)
    router.post('/api/user/preview', jwtQuiet, controller.user.preview)
    router.post('/api/user/logout', jwt, controller.user.logout)
    router.post('/api/user/delete', jwt, controller.user.delete)
    router.post('/api/user/myInfo', jwt, controller.user.myInfo)
    router.post('/api/user/modify', jwt, controller.user.modify)
    router.post('/api/user/feedback', jwtQuiet, controller.user.feedback)
    router.post('/api/user/followUsers', jwt, controller.user.followUsers)
    router.post('/api/user/follow', jwt, controller.user.follow)
    router.post('/api/user/cancelFollow', jwt, controller.user.cancelFollow)
    router.post('/api/user/pageData', controller.user.pageData)
}