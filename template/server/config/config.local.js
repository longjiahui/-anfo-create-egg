const path = require('path')

module.exports = {
    // security: {
    //     csrf: {
    //         enable: false
    //     }
    // },
    
    logger: {
        dir: path.resolve(path.join('logs', 'local')),
    },
}