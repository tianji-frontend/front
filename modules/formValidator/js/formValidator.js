/*
 * author : wumingli
 * author email : wumingli@tianji.com
 * with jquery-1.7.2
 * for : form validator
 * developed at : 2013/6/28 10:06:45
 * Copyright 2013. All rights reserved.
 */
(function ($){
    'use strict';
    $.fn.formValidator = function (config){
        var opt = {
                testAttr: 'data-validation',
                alertMsg: '',
                btnData: 'validation-config',
                triggerMethod: 'blur',
                formCssClass: 'valForm',
                errorMsgConClass: 'val_error'
            },
            pluginCfg = $.extend(config, opt),
            $this = $(this),
            $form = $this,
            $vs = $form.find('[' + pluginCfg.btnData + ']'),
            oResults = {};
        $this.attr({
            'class': pluginCfg.formCssClass
        });
        if ($form.is('[' + pluginCfg.testAttr + ']') && $form.attr(pluginCfg.testAttr) == 'true'){
            //$vs.filter(':text,:password').addClass('vFormText');
            $form.on(pluginCfg.triggerMethod, '[' + pluginCfg.btnData + ']', function (){
                checkData($(this));
            });
            $form.on('click', ':checkbox,:radio', function (){
                $(this).focus();
                return checkData($(this));
            });
            $form.on('blur', ':checkbox,:radio', function (){
                return checkData($(this));
            });
            $form.on('change', 'select', function (){
                return checkData($(this));
            });
        } else {
            alert('not found attribute of ' + pluginCfg.testAttr);
        }
        //数据检查
        function checkData(element){
            var elmOffset = element.offset();
            var type = element.attr('type');
            var checkingArray = [],
                initArray = [];
            var cfg;
            var fstNode;
            $('#' + element.attr('name') + '_error_tip').remove();
            if (type == 'checkbox' || type == 'radio'){
                //element = element.parent().find('[name='+element.attr('name')+']:first');
                fstNode = element.parent().find('[name='+element.attr('name')+']:eq(0)');
                cfg = eval('(' + fstNode.attr(pluginCfg.btnData) + ')');
                elmOffset = fstNode.offset();
            }
            else {
                cfg = eval('(' + element.attr(pluginCfg.btnData) + ')');
            }
            checkingArray = cfg.checking;
            initArray = cfg.init;
            if (element.is('select')){
                type = 'select';
            }
            //try{
                var left = 0,
                    top = 0,
                    i,
                    len,
                    ltData;
                if(cfg['leftTop']){
                    ltData = cfg['leftTop'].split(/[, ;:]+/);
                    left = elmOffset.left + parseInt(ltData[0]);
                    top = elmOffset.top + parseInt(ltData[1]);
                } else {
                    left = elmOffset.left + element.width() + 15;
                    top = elmOffset.top + 5;
                }
                if (!cfg.checking || !cfg.init || cfg.checking.length != cfg.init.length){
                    alert('"' + element.attr(pluginCfg.btnData) + '" \n数据不匹配，请检查');
                }
                else {
                    for (i = 0, len = checkingArray.length; i < len; i++){
                        var oGetRule = rules[checkingArray[i]]['fnValidation'](element, initArray[i], cfg.name, type);
                        var res = oGetRule && oGetRule['result'];
                        oResults[checkingArray[i] + cfg.name] = res;
                        if (oGetRule && !res){
                            if ($('#' + element.attr('name') + '_error_tip').length == 0){
                                $('body').append('<span class="' + pluginCfg.errorMsgConClass + '" style="left:' + left + 'px;top:' + top + 'px;position:absolute;" id="' + element.attr('name') + '_error_tip">' + oGetRule['msg'] + '</span>');
                            }
                            break;
                        }
                    }
                }
            //}
            //catch (e){
            //    alert('"' + $(this).attr(pluginCfg.btnData) + '" \n数据格式错误，请检查');
            //}
        }
        //rules
        var rules = {
            required: {
                regex: 'none',
                alertText: '请输入',
                alertTextSelect: '请选择',
                alertTextCheckbox: '必须勾选',
                fnValidation: function (element, need, name, type){
                    var len = 0,
                        text1 = this.alertText,
                        text2 = '';
                    if (type == 'checkbox' || type == 'radio'){
                        len = element.parent().find('[name=' + element.attr('name') + ']:checked').size();
                        if (len < 1){
                            return {
                                msg: name + '为必选项',
                                result: false
                            }
                        }
                        else {
                            return {
                                result: true
                            }
                        }
                    } else if(type == 'select'){
                        if (element.find(':selected').text().indexOf('请选择') != -1){
                            return {
                                msg: name + '为必选项',
                                result: false
                            }
                        } else {
                            return {
                                result: true
                            }
                        }
                    } else {
                        return {
                            msg: this.alertText + name,
                            result: !($.trim(element.val()) == '' && need)
                        }
                    }
                }
            },
            minSize: {
                regex: 'none',
                alertText: '最少',
                alertText2: '个字符',
                fnValidation: function (element, mLen, name, type){
                    var len = 0,
                        text1 = this.alertText,
                        text2 = this.alertText2;
                    len = element.val().length;
                    if (type == 'checkbox' || type == 'radio'){
                        len = element.parent().find('[name=' + element.attr('name') + ']:checked').size();
                        text1 = '最少选择';
                        text2 = '项';
                    } else if(type == 'select'){
                        if (element.find(':selected').text().indexOf('请选择') != -1){
                            len = 0;
                        } else {
                            len = mLen;
                        }
                        text1 = '最少选择';
                        text2 = '项';
                    } else {
                        len = element.val().length;
                    }/**/
                    if (len < mLen){
                        return {
                            msg: name + text1 + mLen + text2,
                            result: false
                        }
                    }
                    else {
                        return {
                            result: true
                        }
                    }
                }
            },
            maxSize: {
                regex: 'none',
                alertText: '最多',
                alertText2: '个字符',
                fnValidation: function (element, mLen, name){
                    var len = 0,
                        text1 = '',
                        text2 = '';
                    if (element.attr('type') == 'checkbox'){
                        len = element.parent().find('[name=' + element.attr('name') + ']:checked').size();
                        text1 = '最多选择';
                        text2 = '项';
                    } else {
                        len = element.val().length;
                        text1 = this.alertText;
                        text2 = this.alertText2;
                    }
                    if (len > mLen){
                        element.attr('checked',false);
                        return {
                            msg: name + text1 + mLen + text2,
                            result: false
                        }
                    }
                    else {
                        return {
                            result: true
                        }
                    }
                }
            },
            min: {
                regex: /\d+/,
                alertText: '最小值为',
                alertText2: '不是正整数',
                fnValidation: function (element, min, name){
                    if ($.trim(element.val()) != ''){
                        if (rules.isNotNum(element.val())){
                            return {
                                msg: name + this.alertText2,
                                result: false
                            }
                        } else if (parseInt(element.val()) < min){
                            return {
                                msg: name + this.alertText + min,
                                result: false
                            }
                        }
                    }
                    else {
                        return {
                            result: true
                        }
                    }
                }
            },
            max: {
                regex: /\d+/,
                alertText: '最大值为',
                alertText2: '不是正整数',
                fnValidation: function (element, max, name){
                    if ($.trim(element.val()) != ''){
                        if (rules.isNotNum(element.val())){
                            return {
                                msg: name + this.alertText2,
                                result: false
                            }
                        } else if (parseInt(element.val()) > max){
                            return {
                                msg: name + this.alertText + max,
                                result: false
                            }
                        }
                    }
                    else {
                        return {
                            result: true
                        }
                    }
                }
            },
            email: {
                regex: /^\s*[a-zA-Z0-9]+([\._\-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([_\-][a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+([_\-][a-zA-Z0-9]+)*)+\s*$/,
                alertText: '请输入正确的',
                alertText2: '格式不正确',
                fnValidation: function (element, text, name){
                    if ($.trim(element.val()) != '' && !this.regex.test($.trim(element.val()))){
                        return {
                            msg: name + this.alertText2,
                            result: false
                        }
                    }
                    else {
                        return {
                            result: true
                        }
                    }
                }
            },
            phone: {
                regex: /(^((\+86)|(86))?-?([12]\d|(0\d{2,3}))-?(\d{7}|\d{8})-?\d{1,4}$)|(^([^0]\d{6,7})$)/,
                alertText: '请输入正确的',
                alertText2: '格式不正确',
                alertText3: '，正确格式为：(+86)01058951128/(+86)0543(-)1234567(8)(-)(1~4位分机号)',
                fnValidation: function (element, text, name){
                    if ($.trim(element.val()) != '' && !this.regex.test($.trim(element.val()))){
                        return {
                            msg: name + this.alertText2 + this.alertText3,
                            result: false
                        }
                    }
                    else {
                        return {
                            result: true
                        }
                    }
                }
            },
            mobilePhone: {
                regex: /^((\+86)|(86))?-?1\d{10}$/,
                alertText: '请输入正确的',
                alertText2: '格式不正确',
                alertText3: '，正确格式为：(+86)13800138000',
                fnValidation: function (element, text, name){
                    if ($.trim(element.val()) != '' && !this.regex.test($.trim(element.val()))){
                        return {
                            msg: name + this.alertText2 + this.alertText3,
                            result: false
                        }
                    }
                    else {
                        return {
                            result: true
                        }
                    }
                }
            },
            isNotNum: function (val){
                return isNaN(val) || !/^[^0]\d*$/.test(val);
            },
            compare: {
                alertText: '的值与',
                alertText2: '不一致',
                fnValidation: function (element, text, name){
                    if (element.val() != '' && element.val() != $('#' + text + ',[name=' + text +']').val()){
                        return {
                            msg: name + this.alertText + eval('(' + $('#' + text).attr(pluginCfg.btnData) + ')').name + this.alertText2,
                            result: false
                        }
                    }
                    else {
                        return {
                            result: true
                        }
                    }
                }
            }
        };
        //$vs.trigger(pluginCfg.triggerMethod);
        $('body').on('submit', $form, function (){
            var canSub = true;
            $form.find('input:text,input:password').trigger(pluginCfg.triggerMethod);
            checkData($form.find('input:checkbox'));
            checkData($form.find('input:radio'));
            checkData($form.find('select'));
            for (var k in oResults){
                if (!oResults[k]){
                    canSub = false;
                }
            }
            if (typeof $(this).subDropList === 'function'){
                typeof $(this).subDropList();
            }
            return canSub;
        });
    }
})(jQuery);