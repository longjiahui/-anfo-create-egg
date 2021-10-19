import moment from 'moment'
import 'moment/locale/zh-cn'

import $const from '@/assets/scripts/const'

import dialog from './dialog'
import cos from './cos'
import { computed, reactive } from 'vue'

import ClipBoard from 'clipboard'
import seed from 'seed-random'
import config from '@/config'

export default {
    moment,
    ...dialog,
    ...cos,

    isPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
           "SymbianOS", "Windows Phone",
           "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
           if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
           }
        }
        return flag;
    },

    getImageURL(img, width, height){
        if(!img){
            return img
        }
        if(/^http(s|):\/\//.test(img)){
            // 直接返回
            return img
        }
        let url = `https://${config.baseCOSDomain}${img}`
        if(width){
            if(!height){
                height = width
            }
            return `${url}?imageMogr2/thumbnail/!${width}x${height}r`
        }
        return url
    },

    copyText(text) {
        let btn = document.createElement('button');
        let copy = new ClipBoard(btn, {
            text: (e) => {
                return text;
            }
        });
        btn.click();
    },

    // hash
    hash(str,size){
        //1.定义hashCode变量
        let hashCode=0

        //2.霍纳算法，来计算 hashCode的值
        for(let i=0;i<str.length;i++){
           hashCode = 37* hashCode + str.charCodeAt(i) //获取编码
        }
        //3.取余状态
        let index=hashCode%size
        return index 
    },

    // tohexcolor
    toHexColor(color){
        color = color?.toString(16) || ''
        return '#' + new Array(
            Math.min(6, Math.max(0, 6-(color?.length || 0)))
        ).fill('0').join('') + color
    },

    // 根据字符串得到hash背景色
    getHashBackgroundColorByString(str){
        let random = seed(str || '')
        function genFF(){
            let n = Math.floor(random() * 0xaa)
            return n
        }
        let bgColor = genFF() * 256 + genFF() * 65536 + genFF()
        return this.toHexColor(bgColor)
    }
}