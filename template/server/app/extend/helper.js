const crypto = require('crypto')

module.exports = {
    md5Password(val){
        return crypto.createHash('md5').update(val + this.app.config.passwordSalt).digest("hex")
    },
}