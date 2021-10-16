module.exports = {
    jwtSignByEmailCode(payload, ...rest){
        return this.jwt.sign(payload, this.config.jwtSecretForEmailCode, ...rest)
    },
    jwtVerifyByEmailCode(token, ...rest){
        return this.jwt.verify(token, this.config.jwtSecretForEmailCode, ...rest)
    }
}