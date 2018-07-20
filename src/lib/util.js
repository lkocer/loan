/*
* @Author: lanyang
* @Date:   2018-07-04 15:56:25
* @Last Modified by:   lanyang
* @Last Modified time: 2018-07-12 16:50:04
*/
export default {
    cookie: function(key, value, options) {
        var days, time, result, decode
        if(arguments.length > 1 && String(value) !== "[object Object]") {
            options = $.extend({}, options)
            if(value === null || value === undefined) options.expires = -1
            if(typeof options.expires === 'number') {
                days = (options.expires * 24 * 60 * 60 * 1000)
                time = options.expires = new Date()
                time.setTime(time.getTime() + days)
            }
            value = String(value)
            return(document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''))
        }
        options = value || {}
        decode = options.raw ? function(s) {
            return s
        } : decodeURIComponent
        return(result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null
    },
    randomNum(minNum,maxNum){ 
        switch(arguments.length){ 
            case 1: 
                return parseInt(Math.random()*minNum+1,10); 
            break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
                default: 
                    return 0; 
                break; 
        } 
    } 
}