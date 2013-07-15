/*
*author:武明礼
*for:tianji-frontend init
*developed at : 2013/6/13 18:48:41
*Copyright 2013. All rights reserved.
*使用方法：
**引用启动文件的script标签需要添加ID：pageCssInit
**参数：fileName=fileHostPrefix，如jquery=image.tianji.com/tjs/gallery/
**Prefix可以省略http://，fileName可以省略.css
**clearCache用来清除启动文件本身的缓存值
**dynamic=true设置是否启用动态文件合并，接口预留
**
=================================================
<script type="text/javascript" src="http://www.wml.com/frontend/modules/public/publicInit.js?test1=www.wml.com/frontend/modules/test/js/&test2=www.test.com/frontend/modules/test/js/&swfobject=http://static.tianji.com/javascripts/uploadify/&clearCache=randomNumber&dynamic=true" id="pageCssInit"></script>
=================================================
**参数说明：文件与URL前缀成对出现，如：jquery=www.jquery.com/js/
*/

(function (){
    var urlString = document.getElementById('pageCssInit').src,
        arrFileList = '';
    if (urlString.indexOf('?') > -1){
        arrFileList = urlString.substring(urlString.indexOf('?')+1).split('&');
        for (var i=0; i<arrFileList.length; i++){
            var arrFile = arrFileList[i].split('=');
            if (arrFile[0] != 'clearCache'){
                var fileName = arrFile[0].indexOf('.css') > -1 ? arrFile[0] : arrFile[0] + '.css';
                var hasHttp = arrFile[1].indexOf('http') > -1 ? '' : 'http://';
                var cacheStr = arrFile[0] in map ? map[arrFile[0]] : '';
                document.write('<link rel="stylesheet" type="text/css" href="'+hasHttp + arrFile[1] + fileName + cacheStr+'" />');
            }
        }
    }
})();
