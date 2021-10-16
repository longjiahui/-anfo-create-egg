const path = require('path')

module.exports = {
    security: {
        csrf: {
            enable: false
        }
    },

    // logger
    // consoleLevel: 'NONE', 
    // level: 'NONE', 
    logger: {
        dir: path.resolve(path.join('logs', 'unittest')),
    },
}