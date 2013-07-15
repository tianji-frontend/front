/*
*author:武明礼
*email:wumingli@sina.cn
*for:tianji drop box widget
*developed at :2013/5/16 21:17
*Copyright 2013. All rights reserved.
*/
define(function(require, exports, modules){
    var curBox = '';
    $.fn.dropBox = function (options){
        var config = {
            name: 'sex',
            baseJsUrl: '../js/',
            baseJs: 'boxData.js',
            css: {
                width: 100
            },
            clearCache: false,
            version: '1.0.1-dev',
            method: 'click',
            required: false
        };
        var sel = $.extend(config, options);
        var $this = $(this),
            rqUrl = '',
            isLinkage = sel.linkage && sel.linkageType;

        rqUrl = sel.baseJsUrl + sel.baseJs;

        //读取数据字典中的Title，若初始化时有默认值，则默认选择
        require.async(rqUrl,function (json){
            var reqStr = '',
                init = [],
                dftVal = '',
                dftHidVal = '',
                name = '';
            if (sel['customData']){
                json = sel['customData'];
            }
            name = sel['name'];

            //是否必选项，若是，添加data-required属性为true
            reqStr = sel.required ? 'data-required="true"' : '';

            //是否传入默认值
            if (sel['init']){
                dftVal = getNameByCode(json[name]['data'], sel['init']['code']);
                dftHidVal = sel['init']['code'];
            }
            else {
                dftVal = '请选择'+json[name]['title'];
                dftHidVal = '-1';
            }
            //操作DOM            
            name = isLinkage ? name + '_' + sel.linkageType : name;
            $this.html('<input type="text" readonly="readonly" value="' + dftVal + '" class="dftTxt" ' + reqStr + 
                    ' style="width:' + ($this.width() - 20) + 'px;" /><input type="hidden" name="'+name+'" value="' + dftHidVal + '" /><em class="dropArr"></em>');
        });
        //触发方式
        $(this).on('click', function (event){
            event = event || window.event;
            event.stopPropagation();
            format();
        });
        //取Code对应的Name
        function getNameByCode(data, code){
            var i,len;
            if (data.length == 0){
                return '';
            }else {
                for (var i=0,len=data.length; i<len; i++){
                    if (data[i]["code"] == code){
                        return data[i]['name'];
                    }
                }
            }
            return '';
        }
        //格式化输出
        function format(){
            var html = '',rd = '', rqUrl = '';
            curBox = $this.attr('id');
            //箭头改变
            $this.find('em.dropArr').addClass('dropArrUp').end()
                 .siblings().find('em.dropArr').removeClass('dropArrUp');
            if (!sel.clearCache){
                rqUrl = sel.baseJsUrl + sel.baseJs;
            }else {
                rqUrl = sel.baseJs.indexOf('.js') > -1 ? 
                        (sel.baseJsUrl + sel.baseJs + '?v=' + sel.version) : //本身自带扩展名
                        (sel.baseJsUrl + sel.baseJs + '.js?v=' + sel.version);//无.js扩展名
            }
            //异步读取数据
            require.async(rqUrl,function (json){
                var data = null,
                    sType = sel.type,
                    classStr = '';
                //自定义
                if (sel['customData']){
                    json = sel['customData'];
                }

                data = json[sel.name]['data'];
                html += '<ul>';
                html += '<li data-code="-1" class="cur">请选择' + json[sel.name]['title'] + '</li>';
                for(var i=0 ;i<data.length ;i++ ){
                    classStr = i % 2 == 0 ? 'class="even"' : '';
                    var isSelected = !!sel['init'];
                    html += '<li data-code="'+data[i]['code']+ '" ' + classStr + '>' + data[i]['name'] 
                            + (isSelected && sel['init']['code'] == data[i]['code'] ? '<em class="selected"></em>' : '')+'</li>';
                }
                //是否相关，如薪资范围
                if (isLinkage){
                    if (sel.linkageType == 'from'){
                        html += '<li data-code="" class="facetoface">面议</li>';
                    } else {
                        html += '<li data-code="-1" class="facetoface">以上</li>';
                    }
                }
                html += '</ul>';
                //创建新节点
                var conNode = $('<div />');
                var thisOffset = $this.offset();
                var boxId = $this.attr('id') + '_dropBox';
                if ($('#' + boxId).length == 0){
                    //添加属性
                    conNode.attr({
                        'class': 'dropList',
                        'id': boxId,
                        'data-for': $this.attr('id')
                    });
                    //添加样式，动态控制下拉列表位置
                    conNode.css({
                        left: thisOffset.left,
                        top: thisOffset.top + $this.height(),
                        width: $this.width() + 20
                    });
                    //添加节点
                    conNode.html(html);
                    $('body').append(conNode);
                    //选择事件
                    $('#' + boxId).on('click', 'li', function (){
                        if ($(this).hasClass('disabled')){
                            return false;
                        }
                        $this.find('input').val($(this).text());
                        $this.find('input:hidden').val($(this).attr('data-code'));
                        //标识选中状态
                        if($(this).text().indexOf('请选择') == -1){
                            $(this).append('<em class="selected"></em>').siblings().find('em.selected').remove();
                            $('#'+conNode.attr('data-for')).removeClass('data-sub-error');
                        } else {
                            $(this).siblings().find('em.selected').remove();
                        }
                        //相关数据，选择了开始数据
                        if (sel.linkageType == 'from'){
                            if ($(this).text() == '面议'){
                                $(sel.linkage).hide().prev('span').hide();
                            } else {
                                $(sel.linkage).show().prev('span').show();
                                $(sel.linkage).find('.dftTxt').val('以上');
                                $(sel.linkage).removeClass('data-sub-error');
                            }
                        }
                    });
                }
                else {
                    $('#' + boxId).show();
                }
                if (sel.linkageType == 'to' && $this.find('.dftTxt').val() == '以上'){
                    $('#' + boxId + ' ul li em').remove();
                    $('#' + boxId).find('li:contains("以上")').append('<em class="selected"></em>');
                }
                //隐藏其他下拉列表
                $('#' + boxId).siblings('.dropList').hide();
                //相关数据处理
                var $linkage = $(sel.linkage);
                if (isLinkage && $linkage.length != 0){
                    $('#' + boxId + ' li').removeClass('disabled');
                    if (sel.linkageType == 'from'){
                        $('#' + boxId + ' li:not(:contains("请选择")):not(:contains("面议"))').each(function (){
                            var linkageVal = parseInt($linkage.find('.dftTxt').val()),
                                thisVal = parseInt($(this).text());
                            if (!isNaN(linkageVal)){
                                if (thisVal > linkageVal){
                                    $(this).addClass('disabled');
                                } else {
                                    $(this).removeClass('disabled');
                                }
                            } 
                        });
                    } else {
                        $('#' + boxId + ' li:not(:contains("请选择")):not(:contains("以上"))').each(function (){
                            var linkageVal = parseInt($linkage.find('.dftTxt').val()),
                                thisVal = parseInt($(this).text());
                            if (!isNaN(linkageVal)){
                                if (thisVal < linkageVal){
                                    $(this).addClass('disabled');
                                } else {
                                    $(this).removeClass('disabled');
                                }
                            } 
                        });
                    }
                }
            });
        }
        return this;
    };
    //表单下拉列表必选验证
    $.fn.subDropList = function (){
        var canSubmit = true;
        $('[data-required="true"]').each(function (){
            if($(this).val().indexOf('请选择') > -1){
                var $this = $(this);
                $this.parents('.wml-p-data-wrap').removeClass('data-sub-error');
                setTimeout(function (){
                    $this.parents('.wml-p-data-wrap').addClass('data-sub-error');
                },200);
                canSubmit = false;            
            }
        });
        return canSubmit;
    }
    //失去焦点关闭下拉列表
    $(document).click(function (){
        $('.dropList').hide();
        $('.wml-p-data-wrap em.dropArr').removeClass('dropArrUp');
        var reqInput = $('#' + curBox).find($('[data-required="true"]'));
        if('' != curBox && reqInput.length > 0 && reqInput.val().indexOf('请选择') > -1){
            $('#' + curBox).addClass('data-sub-error');
        }
    });
});