/*
*author:武明礼
*email:wumingli@sina.cn
*for:test
*developed at :2013/5/16 21:17
*Copyright 2013. All rights reserved.
*/
define(function(require, exports, modules){
    var sel = require('./dropBox');
    $('#wml-p-data-wrap').dropBox({
        name: 'sex'
    });
    $('#wml-p-data-wrap1').dropBox({
        name: 'salary',
        init: {
            code: '0600108000'
        }
    });
    $('#wml-p-data-wrap2').dropBox({
        name: 'companyProperty',
        required: true
    });
    $('#wml-p-data-wrap3').dropBox({
        name: 'workExperience',
        required: true
    });
    $('#wml-p-data-wrap4').dropBox({
        name: 'companyLevel'
    });
    $('#wml-p-data-wrap5').dropBox({
        name: 'eduBackground',
        init: {
            code: '404'
        },
        required: true
    });
    $('#wml-p-data-wrap6').dropBox({
        name: 'lan',
        init: {
            code: '511'
        }
    });
    $('#wml-p-data-wrap7').dropBox({
        name: 'lanLS'
    });
    $('#wml-p-data-wrap8').dropBox({
        name: 'lanRW'
    });
    $('#wml-p-data-wrap9').dropBox({
        name: 'custom',
        customData: {
            'custom': {
                'data': [{
                    'code': '901',
                    'name': '自定义数据1'
                },{
                    'code': '902',
                    'name': '自定义数据2222'
                },{
                    'code': '903',
                    'name': '自定义数据自定义数据自定义数据'
                }],
                'title': '自定义数据'
            }
        },
        init: {
            code: '901'
        },
        required: true
    });
    $('#wml-p-data-wrap10').dropBox({
        name: 'salarySingle',
        linkage: '#wml-p-data-wrap11',
        linkageType: 'from',
        required: true
    });
    $('#wml-p-data-wrap11').dropBox({
        name: 'salarySingle',
        linkage: '#wml-p-data-wrap10',
        linkageType: 'to',
        required: true
    });
    $('#testForm').submit(function (){
        return $(this).subDropList();
    });
});