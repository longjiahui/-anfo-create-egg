module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
  
    const UserSchema = new Schema({
        email: {
            type: String,
            unique: true,
        },
        qq: String,
        mobile: String,
        password: {
            type: String,
            required: true
        },
        name: String,
        avatar: String,
        desc: String,

        // 邮箱是否认证通过
        isVerified: {
            type: Boolean,
            default: false,
        },

    }, {
        timestamps: true
    })
  
    return mongoose.model('User', UserSchema)
}