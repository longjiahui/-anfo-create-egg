export default {
    install(app){
        app.directive('focus', {
            mounted(el){
                el.focus?.()
            }
        })
    }
}