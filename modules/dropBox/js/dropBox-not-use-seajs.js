/*
 * author:武明礼
 * email:wumingli@tianji.com
 * for:tianji drop box plugin
 * developed at :2013/5/16 21:17
 * not by seajs
 * rewrite at : 2013/6/27 17:24
 * Copyright 2013. All rights reserved.
 */
(function($){
    var curBox = '';
    $.fn.dropBox = function (options){
        var config = {
            name: 'sex',
            baseJsUrl: '/frontend/modules/dropBox/js/',
            baseJs: 'boxData1.js',
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
            rqUrl = '';

        rqUrl = sel.baseJsUrl + sel.baseJs;

        //读取数据字典中的Title，若初始化时有默认值，则默认选择
        $.getJSON(rqUrl,function (json){
            var reqStr = '',
                init = [],
                dftVal = '',
                dftHidVal = '',
                name = '';
            if (sel['customData']){
                json = sel['customData'];
            }            

            //是否必选项，若是，添加data-required属性为true
            reqStr = sel.required ? 'data-required="true"' : '';

            //是否传入默认值
            if (sel['init']){
                dftVal = getNameByCode(json[0][sel['name']]['data'], sel['init']['code']);
                dftHidVal = sel['init']['code'];
            }
            else {
                dftVal = '请选择'+json[0][sel.name]['title'];
                dftHidVal = '-1';
            }
            //操作DOM
            $this.html('<input type="text" readonly="readonly" value="' + dftVal + '" class="dftTxt" ' + reqStr + 
                    ' style="width:' + ($this.width() - 20) + 'px;" /><input type="hidden" name="'+sel.name+'" value="' + dftHidVal + '" /><em class="dropArr"></em>');
        });
        //触发方式
        $(this).click(function (event){
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
            $.getJSON(rqUrl,function (json){
                var data = null,
                    sType = sel.type,
                    classStr = '';
                //自定义
                if (sel['customData']){
                    json = sel['customData'];
                }

                data = json[0][sel.name]['data'];
                html += '<ul>';
                html += '<li data-code="-1" class="cur">请选择' + json[0][sel.name]['title'] + '</li>';
                for(var i=0 ;i<data.length ;i++ ){
                    classStr = i % 2 == 0 ? 'class="even"' : '';
                    var isSelected = !!sel['init'];
                    html += '<li data-code="'+data[i]['code']+ '" ' + classStr + '>' + data[i]['name'] 
                            + (isSelected && sel['init']['code'] == data[i]['code'] ? '<em class="selected"></em>' : '')+'</li>';
                }
                html += '</ul>';
                //创建新节点
                var conNode = $('<div />');
                var ifmCover = $('<iframe />');
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
                    ifmCover.attr({
                        'src': 'about:blank',
                        'frameborder': '0',
                        'id': boxId + '_ifm'
                    });
                    conNode.html(html);
                    $('body').append(conNode);
                    conNode.after(ifmCover);
                    ifmCover.css({
                        display: 'block',
                        left: thisOffset.left,
                        top: thisOffset.top + $this.height(),
                        width: conNode.width() + 2,
                        height: $('#' + boxId).height(),
                        position: 'absolute'
                    });
                    //选择事件
                    $('#' + boxId).find('li').live('click',function (){
                        $this.find('input').val($(this).text());
                        $this.find('input:hidden').val($(this).attr('data-code'));
                        //标识选中状态
                        if($(this).text().indexOf('请选择') == -1){
                            $(this).append('<em class="selected"></em>').siblings().find('em.selected').remove();
                            $('#'+$this.attr('id')).removeClass('data-sub-error');
                        } else {
                            $(this).siblings().find('em.selected').remove();
                        }
                    });
                }
                else {
                    $('#' + boxId).show()
                                  .next('iframe').show();
                }
                //隐藏其他下拉列表
                $('#' + boxId).siblings('.dropList').hide()
                              .next('iframe').hide();
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
                $this.parents('.p-data-wrap').removeClass('data-sub-error');
                setTimeout(function (){
                    $this.parents('.p-data-wrap').addClass('data-sub-error');
                },200);
                canSubmit = canSubmit && false;            
            }
        });
        return canSubmit;
    }
    //失去焦点关闭下拉列表
    $(document).click(function (){
        $('.dropList').hide()
                      .next('iframe').hide();
        $('.p-data-wrap em.dropArr').removeClass('dropArrUp');
        var reqInput = $('#' + curBox).find($('[data-required="true"]'));
        if('' != curBox && reqInput.length > 0 && reqInput.val().indexOf('请选择') > -1){
            $('#' + curBox).addClass('data-sub-error');
        }
    });
})(jQuery);