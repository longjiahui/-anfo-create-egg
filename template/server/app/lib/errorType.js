const { LoginCheckError } = require('@anfo/egg-basic/app/lib/errorType')
const { ValidateError } = require('@anfo/egg-anfo-validator/app/lib/errorType')
// function createError(name){
//     return class extends Error{
//         constructor(...messages){
//             super()
//             let message = ''
//             for(let m of messages){
//                 if(m && typeof m === 'object'){
//                     m = JSON.stringify(m)
//                 }
//                 if(message){
//                     message += ' @@ '
//                 }
//                 message += `${m}`
//             }
//             this.message = message
//             this.name = name
//         }
//     }
// }

module.exports = {
    ValidateError,
    LoginCheckError,
}