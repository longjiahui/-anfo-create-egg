import utils from './utils'

export default {
    message(content, props = {}){
        return utils.openMessageDialog({
            content,
            ...props,
        })
    },
}