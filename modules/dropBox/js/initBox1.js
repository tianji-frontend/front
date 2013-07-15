/*
*author:武明礼
*email:wumingli@sina.cn
*for:test
*developed at :2013/5/16 21:17
*Copyright 2013. All rights reserved.
*/
$('#p-data-wrap').dropBox({
    name: 'sex'
});
$('#p-data-wrap1').dropBox({
    name: 'salary',
    init: {
        code: '0600108000'
    }
});
$('#p-data-wrap2').dropBox({
    name: 'companyProperty',
    required: true
});
$('#p-data-wrap3').dropBox({
    name: 'workExperience',
    required: true
});
$('#p-data-wrap4').dropBox({
    name: 'companyLevel'
});
$('#p-data-wrap5').dropBox({
    name: 'eduBackground',
    init: {
        code: '404'
    },
    required: true
});
$('#p-data-wrap6').dropBox({
    name: 'lan',
    init: {
        code: '511'
    }
});
$('#p-data-wrap7').dropBox({
    name: 'lanLS'
});
$('#p-data-wrap8').dropBox({
    name: 'lanRW'
});
$('#p-data-wrap9').dropBox({
    name: 'customdemo',
    customData: [{
        'customdemo': {
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
    }],
    init: {
        code: '901'
    },
    required: true
});
$('#testForm').submit(function (){
    return $(this).subDropList();
});