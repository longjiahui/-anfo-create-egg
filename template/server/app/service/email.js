const nodemailer = require('nodemailer');

module.exports = app=>{
    const smtp = app.config.smtp
    const transporter = nodemailer.createTransport({
        host: smtp.host,
        secure: true,
        auth:{
            user: smtp.user,
            pass: smtp.password
        }
    })
    return class extends app.Service{
        send(to, subject, content, options){
            return transporter.sendMail({
                from: smtp.user,
                to,
                subject, 
                html: content,
                ...options
            })
        }
    }
}