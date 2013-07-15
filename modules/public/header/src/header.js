define(function (require, exports, module){
    function initHeader(){
      var curUID = window.CURRENT_USER_ID;
      if (curUID != null) {
        $('[the-id=look_see]').hover(function() {
          $(this).addClass('contacts_hover');
          $('[data-role=look_list]').css('display', 'block');
          if ($(this).data("visited") == null) {
            $('[the-id=look_see]').data("visited", true);
            $.ajax({
                dataType: 'jsonp',
                url: 'http://www.tianji.com/ajax/home/visitors',
                jsonp: 'callback',
                data: {'user_id':curUID,'skip_ajax':true},
                success: function (data){
                    $("#j_box_vistors .contacts_main").append(data);
                    $("#j_box_vistors .contacts_main a").each(function (){
                        $(this).attr('href','http://www.tianji.com'+$(this).attr('href'))
                    });
                    var num = $("#j_box_vistors :hidden[name=new_visitors]").val();
                    $("#j_box_vistors .messages_list li:lt("+num+") img.none").show();
                }
            });
          }
        }, function() {
          $(this).removeClass('contacts_hover');
          $('[data-role=look_list]').css('display', 'none');
        });
      }
      $('[the-id=look_see1]').hover(function() {
        $(this).addClass('message_hover');
        $('[data-role=look_list1]').css('display', 'block');
      }, function() {
        $(this).removeClass('message_hover');
        $('[data-role=look_list1]').css('display', 'none');
      });
      $('[the-id=look_see2]').hover(function() {
        $(this).addClass('tool_hover');
        $('[data-role=look_list2]').css('display', 'block');
      }, function() {
        $(this).removeClass('tool_hover');
        $("[data-role=look_list2]").hide();
      });
      
      
      //获取string长度
      String.prototype.length2 = function() {
          var cArr = this.match(/[^\x00-\xff]/ig);
          return this.length + (cArr == null ? 0 : cArr.length);
      }
      
      window.SearchBox = {
        selectors: {
          root: $("#j_search_zone"),
          input: $("#j_search_zone form :text:first"),
          box: $("#j_search_box"),
          highlight: $("#j_search_box li a b")
        },
        keyCode: {
          UP: 38,
          DOWN: 40
        },
        defalutText: "",
        host: "http://search.tianji.com/psearch",
        init: function(){
          this._bind();
          return this;
        },
        _bind: function(){
          this.selectors.input.bind("blur", this._hide).bind("keyup", this._keyup);
          this.selectors.box.bind("click", this._hide);
          this.selectors.box.hover(function(){
            SearchBox.selectors.input.unbind("blur");
          },function(){
            SearchBox.selectors.input.bind("blur", SearchBox._hide);
          });
        },
        _keyup: function(e){
          switch(e.which){
            case 38:SearchBox._up();break;
            case 40:SearchBox._down();break;
            default:SearchBox._input();break;
          }
          SearchBox._select();
        },
        _show: function(){
          SearchBox.selectors.box.show();
        },
        _hide: function(){
          SearchBox.selectors.box.hide();
        },
        _up: function(){
          if($("#j_search_box li.current:last").index("#j_search_box li")>0)
          $("#j_search_box li.current").removeClass("current").prev("li").addClass("current");
        },
        _down: function(){
          if($("#j_search_box li.current:last").index("#j_search_box li")<3)
          $("#j_search_box li.current").removeClass("current").next("li").addClass("current");
        },
        _input: function(){
          var str = SearchBox.selectors.input.val();
          SearchBox._resetUrl(encodeURIComponent(str));
          if(str.length == 0){
            SearchBox._hide();
            SearchBox._resetHighlight();
          }else{
            SearchBox._show();
            str = SearchBox._truncate(str, 5);
            SearchBox.selectors.highlight.text(str);
          }
        },
        _select:function(){
          $("#j_search_zone form :hidden[name=header_destination]").val($("#j_search_box li.current a").attr("data-range"));
        },
        // 截断字符
        _truncate: function(str, len){
          var _omission = "…";
          var _maxLength = len * 2;
          var len2 = str.length2();
          //如果用户输入的内容 字节数小于等于10， 则return 原字符串
          if(len2 <= _maxLength) return str;
          
          // 否则截断字符
          // 截取前5个字符，判断字节数是否等于10，如果小于10则补进下一个字符，直到字节数为10,并添加omission
          var _str = str.substring(0,len);
          var _len2 = _str.length2();
          
          while(_len2 < _maxLength){
            var _tmpStr = str.substring(0,len++);
            _len2 = _tmpStr.length2();
            //判断最后一个字符是中文的情况
            if(_len2 > _maxLength) break;
            _str = _tmpStr;
          }
          return _str+_omission;
        },
        _resetHighlight: function(){
          SearchBox.selectors.highlight.text(SearchBox.defalutText);
        },
        _resetUrl: function(_str){
          $("#j_search_box ul li a[data-range]").each(function(){
            $(this).attr("href", SearchBox.host+"?header_destination="+$(this).attr("data-range")+"&header_keyword="+_str);
          });
          $("#j_search_box .use_hign_search a").attr("href", "http://search.tianji.com/psearch?keyword="+_str);
        }
      }
      SearchBox.init();
      
      //notices
      window.TIANJI_NOTICE_FORMATS = {
        unread_messages_count : "您有#{v}条新私信,<a href='http://www.tianji.com/messages'>查看</a>",
        unread_comments_count : "您有#{v}条新评论,<a href='http://www.tianji.com/comments'>查看</a>",
        unread_fans_count : "您有#{v}个新粉丝,<a href='http://www.tianji.com/contacts/fans'>查看</a>",
        unread_walls_count : "您有#{v}条新留言,<a href='http://www.tianji.com/p/walls'>查看</a>",
        unread_friend_requests_count : "您有#{v}条新邀请,<a href='http://www.tianji.com/contacts/invitation'>查看</a>",
        unread_notices_count : "您有#{v}条新通知,<a href='http://www.tianji.com/notices'>查看</a>",
        unread_dmails_count: "您有#{v}条新直邮,<a href='http://m.tianji.com/inbox/mrd'>查看</a>",
        unread_views_count : ""
      }
      window.TIANJI_NOTICES = [];
      
      var set_counter = function(node, value) {
        if (value <= 0) return;
        if (value > 99) value = "99+";
        $("#j_box_notices [data-role='" + node + "']").append("<span class='promit_icon'>" + value + "</span>");
        var _notice = eval("TIANJI_NOTICE_FORMATS." + node);
        if(typeof _notice != 'undefined' && _notice.length > 0){
          TIANJI_NOTICES.push(_notice.replace("#{v}", value));
        }
      }
      var draw_box = function() {
        if(TIANJI_NOTICES.length ==0) return;
        $.each(TIANJI_NOTICES, function(i, notice) {
          $("#j_box_pop").append("<p>" + notice + "</p>");
        });
        $("#j_box_pop").show();
      }
      var draw_visitors = function(num, unread_count) {
        if(num>999) num = "999+";
        $("#j_box_vistors > a:first").text(num);
        if (unread_count <= 0) return;
        if (unread_count > 99) unread_count = "99+";
        $("#j_box_vistors .span_promit .promit_b").text(unread_count);
        $("#j_box_vistors :hidden[name=new_visitors]").val(unread_count);
        $("#j_box_vistors .span_promit").show();
      }
      var show_notice_box = function(result, is_show) {
        var notice_sum = 0;
        $.each(result, function(k, v) {
          set_counter(k, v);
          notice_sum += v;
        });
        if (notice_sum > 0) {
          if (notice_sum > 99) notice_sum = "99+";
          $("#j_box_notices .span_promit .promit_b").text(notice_sum);
          $("#j_box_notices .span_promit").show();
          if(is_show) draw_box();
        }
      }

      if (curUID != null) {
        $.ajax({
          dataType: "jsonp",
          url: "http://www.tianji.com/ajax/home/notices",
          data: {"user_id":curUID,'skip_ajax':true},
          jsonp: 'callback',
          success: function(json) {
            if(json != null){
              show_notice_box(json.notices, json.box.show);
              draw_visitors(json.visitors.count, json.visitors.unread_count);
            }
          }
        });

        $("#j_box_pop .j_fork").live("click", function() {
          $('#hideNotice').remove();
          $('<iframe />').attr({'src':'http://www.tianji.com/ajax/home/hide_notice','id':'hideNotice'})
                         .css('display','none')
                         .appendTo('body');
          
          $("#j_box_pop").fadeOut(300);
        });

      }
      //用户信息
      $.ajax({
        url:'http://www.tianji.com/jsonp/nav/user_infos/'+curUID,
        dataType:'jsonp',
        success:function(item){
            var name = item['name'];
            var headline = item['headline'];
            var avatar = item['avatar_url'];
            $('.top_info a').attr('title',name + ', ' + headline);
            $('.top_poster img').attr('src',avatar);
            $('.top_name a').text(name);
        }
      });
      //标识当前频道
      var url = window.location.href;
      var urlPath = window.location.pathname;
      var aUrlSplit = urlPath.split('/');
      var sUrlReturn = '';
      var chanel = {
        'home': 0,
        'p': 1,
        'contacts': 2,
        'mba': 4
      };
      var isRemoveCur = (aUrlSplit[1] == 'p' && aUrlSplit.length > 2 && aUrlSplit[2] != curUID) 
          || url.indexOf('m.tianji') > 0 || url.indexOf('bbs.tianji') > 0 || url.indexOf('search.tianji') > 0;
      var urlIndex = url.indexOf('job.tianji') > 0 ? 3 : chanel[aUrlSplit[1]];
      //是否标识当前
      if (isRemoveCur){
        $('.header_menu .left_menu li').removeClass('current');
      }
      else{
        $('.header_menu .left_menu li').eq(urlIndex).addClass('current').siblings().removeClass('current');
      }
      //修改切换语言URL
      sUrlReturn = url.indexOf('search.tianji') > 0 ? '' : '?return_to='+url;
      $('[the-id=look_see2] .message_main li:eq(1) span a').attr('href','http://www.tianji.com/setting/locale/'+$('#header').attr('the-to-Lan')+sUrlReturn);
    }
    exports.initHeader = initHeader;
});