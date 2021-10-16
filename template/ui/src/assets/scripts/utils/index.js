import { queueUp, throttle } from '@anfo/promisequeue'
import moment from 'moment'
import 'moment/locale/zh-cn'

import $const from '@/assets/scripts/const'

import dialog from './dialog'
import cos from './cos'
import pagination from './pagination'
import { computed, reactive } from 'vue'

import ClipBoard from 'clipboard'
import seed from 'seed-random'
import config from '@/config'

export default {
    moment,
    ...dialog,
    ...cos,
    ...pagination,

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

    getDurationDesc(offset){
        if(offset != null && !isNaN(offset)){
            if(offset < 0){
                return `${Math.abs(offset)}天前`
            }else if(offset === 0){
                return '今天'
            }else if(offset === 1){
                return '明天'
            }else if(offset === 2){
                return '后天'
            }else{
                return `${offset}天`
            }
        }
    },
    getDayOffsetByMoment(moment){
        let momentTime = new Date(moment).getTime()
        let now = Date.now()
        let tomorrow = new Date(new Date(Date.now() + 86400000).toDateString()).getTime()
        return Math.floor((momentTime + 86400000 - tomorrow) / (24 * 3600000))
    },
    getDurationDescByMoment(moment){
        if(moment){
            let offset = this.getDayOffsetByMoment(moment)
            return this.getDurationDesc(offset)
        }else{
            return ''
        }
    },
    getLeftDateByOffset(offset){
        return moment().subtract(offset, 'days').startOf('day').toDate()
        let p = Date.now() % 86400000
        return new Date(Date.now() - p - 1000 + offset * 86400000)
    },
    getRightDateByOffset(offset){
        return moment().add(offset, 'days').endOf('day').toDate()
        let p = Date.now() % 86400000
        return new Date(Date.now() + 86400000 - p + offset * 86400000)
    },
    getDateRange(ldOffset = 0, rdOffset = 0){
        // let leftDate, rightDate
        // let offset = Date.now() % 86400000
        // 今天算起的昨天23:59:59
        // leftDate = new Date(Date.now() - offset - 1000 - ldOffset * 86400000)
        // 今天算起的24:00
        // rightDate = new Date(Date.now() + 86400000 - offset + rdOffset * 86400000)
        // return [leftDate, rightDate]
        return [this.getLeftDateByOffset(ldOffset), this.getRightDateByOffset(rdOffset)]
    },
    // 这个deadline是 today / week ...
    getDateRangeByDeadline(deadline){
        if(deadline === 'today'){
            return [null, this.getRightDateByOffset(0)]
        }else if(deadline === 'week'){
            return [null, this.getRightDateByOffset(7)]
        }else if(deadline === 'lastWeek'){
            return this.getDateRange(-7, 0)
        }else{
            return this.getDateRange(0, 0)
        }
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