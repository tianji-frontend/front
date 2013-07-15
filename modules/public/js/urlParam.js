/*
*author:武明礼
*for:返回URL某参数值，若不存在|无=号|=号后无值，返回空串
*developed at : 2013年6月20日 12:50:28
*Copyright 2011. All rights reserved.
*/
define(function (require, exports, module){
    exports.urlParam = function (url, paramName){
        var val = '', urlStr = '', arrRes = [];
        urlStr = url.substring(url.indexOf('?') + 1);
        arrRes = urlStr.split('&');
        for (var i=0,len = arrRes.length; i < len; i++){
            if (arrRes[i].indexOf('=') == -1){
                return '';
            }else {
                var kandv = arrRes[i].split('=');
                if (kandv[0] == paramName){
                    return kandv[1];
                }
            }
        }
        return '';
    }
});