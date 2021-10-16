import { v1 as uuid } from 'uuid'
import COS from 'cos-js-sdk-v5'
import api from '@/assets/scripts/api'
// COS 通过index.html CDN 引入了

let cos = new COS({
    getAuthorization: function (options, callback) {
        api.sts().then(data=>{
            let credentials = data.credentials
            console.debug('sts get credentials: ', credentials)
            if(!data || !data.credentials){
                throw new Error('sts get credentials failed!')
            }
            callback({
                TmpSecretId: credentials.tmpSecretId,        // 临时密钥的 tmpSecretId
                TmpSecretKey: credentials.tmpSecretKey,      // 临时密钥的 tmpSecretKey
                XCosSecurityToken: credentials.sessionToken, // 临时密钥的 sessionToken
                ExpiredTime: data.expiredTime,               // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
            });
        })
    }
})

export default {
    // maxSize unit: kB
    uploadImage(path, maxSize){
        return new Promise((r, reject)=>{
            // 1 create file input and click
            let input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.onchange = e=>{
                let files = input.files
                let file = files?.[0]
                if(maxSize != null){
                    if(file.size / 1024 > maxSize){
                        reject(`图片大小不能超过${maxSize}KB`)
                        return
                    }
                }
                let format = /.*\.(.+)/.exec(file.name)?.[0]
                let key = `${uuid()}.${format}`
                cos.putObject({
                    Bucket: 'group-1252925346', /* 必须 */
                    Region: 'ap-shanghai',     /* 存储桶所在地域，必须字段 */
                    Key:  `${path}/${key}`,              /* 必须 */
                    StorageClass: 'STANDARD',
                    Body: file, // 上传文件对象
                }, (err, d)=>{
                    if(err){
                        // console.error(err)
                        reject(err)
                    }else{
                        console.debug('upload done: ', key)
                        r(key)
                    }
                })
            }
            input.click()
        })
    },
}