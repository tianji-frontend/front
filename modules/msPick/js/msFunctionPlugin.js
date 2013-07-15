/*
base:jquery1.7.2.js
Date: 2013-06-05
Author:jason.wang
version:1.1
参数介绍：
check:'checkbox',	//值为 checkbox/radio单选/多选
maxCount:5,		//多选下的最多选择条数，如为单选，可以省略此项。
column:3,		//列数
comData:{		//常用数据。格式为
			"nodes": 
				[
					{
			            "code": "101",
			            "name": "计算机软/硬件"
			        }
				]
		},
init:[		//初始值。格式为
		{
			"code":"101",
			"name":"计算机软/硬件"
		}
	],
style:{		//可定义部分样式
		"foldHeadWidth":"170px",
		"msCbComponent":"265px",
		"msOkWidth":"250px"
	}

*/

(function($){
	$.fn.msJobPlugin = function(options)
	{
		var defaults = {
			type:'job',
			check:'checkbox',
			maxCount:5,
			column:6,
			comData:[],
			init:[],
			style:{
				"foldHeadWidth":"78px",
				"msCbComponent":"88px",
				"msOkWidth":"150px"
			},
			align:"left"
		};
		var msPick = $.extend(defaults, options);

		var strInput = "<div class='ms-btn-component ms-btn-canhover'></div>"+
						"<div class='txt-box-component'>"+
						    "<input type='text' class='ms-txt-component' maxlengh='20' name='' value='' />"+
						"</div>"+
						"<input type='hidden' class='ms_checkInput' value='' name='"+msPick.type+"Code' />";

		$(this).append($(strInput));

		msPick.structure ="";
		msPick.allData = [];
		msPick.listData = [];
		msPick.hotData = [];
		msPick.id="";
		switch(msPick.type)
		{
			
			case 'job':
			msPick.id = "msPickJob";
			msPick.structure ="<div class='ms-pick' id='"+msPick.id+"' style='width:600px'>"+
							    "<div class='w-h-tab-component'>"+
							        "<ul class='h-tab clear'>"+
							            "<li class='tab-menu-component'>职能选择</li>"+
							        "</ul>"+
							    	"<a class='close-component' href='javascript:;'>删除</a>"+
							    "</div>"+
							    "<div class='c-tab'>"+
							    	"<div class='tab-con-component tab-con-width' style='width:583px'>"+
							            "<div class='otherAll' style='height:300px; overflow-y:auto;'>"+
							            "</div>"+
							        "</div>"+
							    "</div>"+
							"</div>";

			msPick.allData = 
		  	{
				"nodes":[]
			};
		  	msPick.listData = 
			{
				"nodes":[]
			};
			for(var i=0;i<jobData.job.length;i++)
			{
				for(var j=0;j<jobData.job[i].nodes.length;j++)
				{
					msPick.allData.nodes.push(jobData.job[i].nodes[j]);
				}
				
			}
			for(var i=0;i<msPick.allData.nodes.length;i++)
			{
				for(var j=0;j<msPick.allData.nodes[i].nodes.length;j++)
				{
					msPick.listData.nodes.push(msPick.allData.nodes[i].nodes[j]);
				}
			}
			break;

		}


		$("body").append($(msPick.structure));
		

		msPick.createDom = function()
		{
			/*常用*/
			if(this.comData.nodes)
			{
				var comStr="";
			    for(var i=0;i<this.comData.nodes.length;i++)
			    {
			        comStr += "<label class='ms-cb-component' style='width:"+this.style.msCbComponent+"'><input type="+this.check+" name='"+this.type+"com' class='ms-cb-cb' value="+this.comData.nodes[i].code+" ms-cb-data="+this.comData.nodes[i].name+" />"+this.comData.nodes[i].name+"</label>";
			    }
			    $("#"+this.id).find(".common").append($(comStr));
			}
			/*热门*/
			if(this.hotData.nodes)//查看是否有nodes属性
			{
				var hotStr="";
			    for(var i=0;i<this.hotData.nodes.length;i++)
			    {
			        hotStr += "<label class='ms-cb-component' style='width:"+this.style.msCbComponent+"'><input type="+this.check+" name='"+this.type+"hot'+ class='ms-cb-cb' value="+this.hotData.nodes[i].code+" ms-cb-data="+this.hotData.nodes[i].name+" />"+this.hotData.nodes[i].name+"</label>";
			    }
			    $("#"+this.id).find(".hot-city").append($(hotStr));
			}

			/*其它*/
			
			var allDataLength = this.allData.nodes.length;

		    var totalLine = Math.ceil(allDataLength/this.column);
		    var foldHeadStr="";

		    var allCityTopStr = "";
		    var allCityStr="";
		    for(var i=0;i<totalLine;i++)
		    {
		        var _allCityTopStr = "";
		        var _allCityStr="";
		        for(var j=i*this.column;j<(i+1)*this.column&&j<allDataLength;j++)
		        {
		        	
		            _allCityTopStr += "<span style='width:"+this.style.foldHeadWidth+"'><label>"+this.allData.nodes[j].name+"</label></span>";
		            

		            var _cityStr = "";
			        for(var k=0;k<this.allData.nodes[j].nodes.length;k++)
			        {
			            _cityStr +="<label class='ms-cb-component' style='width:"+this.style.msCbComponent+"'><input type="+this.check+" class='ms-cb-cb' name="+this.type+" value="+this.allData.nodes[j].nodes[k].code+" ms-cb-data="+this.allData.nodes[j].nodes[k].name+" />"+this.allData.nodes[j].nodes[k].name+"</label>";
			        }

		            _allCityStr +="<div class='fold-con-component' >"+_cityStr+"</div>";

		        }

		        allCityTopStr += "<div class='foldable'><div class='fold-head-component'>"+_allCityTopStr+"</div>"+_allCityStr+"</div>";
		    }
		    $("#"+this.id).find(".otherAll").append($(allCityTopStr));
			

		    
		    //省会切换效果
		    var afoldCon = $("#"+this.id).find(".fold-con-component");
		    var aProvince = $("#"+this.id).find(".fold-head-component").find("span");
		    
		    aProvince.on("click",function(){

		        aProvince.removeClass("active");
		        afoldCon.hide();
		        var temp = $(this).index();
		        $(this).parent().find("span").removeClass("active");
		        $(this).addClass("active");
		        $(this).parent().parent().find(".fold-con-component").hide().eq(temp).show();
		    })

		}
		msPick.createDom();

		var defaultValue = function()
		{
			if(msPick.init.length>0)
			{
				var arr = [];
				for(var i=0;i<msPick.init.length;i++)
				{
					arr.push(msPick.init[i].code);
				}
				return arr;
			}
			else
			{
				return [];
			}
		}

		var conf={
			index:0,//下拉列表索引值
			keyArray:[13,38,40],//建盘功能键keyCode
			selectLenght:0,//选中的长度
			aMsCb:[],//下拉里面所有复选框/单选框
			msCheckInputArr:defaultValue(),//隐藏input值的数组。
			max:5//设置下拉列表最多显示数据条数。
		}

		var $this = $(this);

		msPick.addDefault = function()
		{
			msPick.createDiv = $("#"+this.id);

			if(this.init.length>0)
			{	
				var strA ="";
				var codeArr=[];
				for(var i=0;i<this.init.length;i++)
				{
					strA += "<a href='javascript:;' class='ms-selected-item' rel="+this.init[i].code+">"+
		                "<span class='text'>"+this.init[i].name+"</span>"+
		                "<span class='delete-component'>删除</span></a>";
		            codeArr.push(this.init[i].code);
				}

				$(strA).insertBefore($this.find(".ms-txt-component"));
				$this.find(".ms_checkInput").val(codeArr.join(","));


				conf.aMsCb = this.createDiv.find(".ms-cb-cb");
	        	for(var i =0;i<conf.msCheckInputArr.length;i++)
	        	{
	        		for(var j=0;j<conf.aMsCb.length;j++)
	        		{
	        			
	        			if(conf.msCheckInputArr[i]==conf.aMsCb[j].value)
	        			{
	        				conf.aMsCb[j].checked = true;
	        			}
	        		}
	        	}	

			}
	       
		}
		msPick.addDefault();

		msPick.mpPosition = function()
	    {
	    	var left = $this.offset().left;
	        var top = $this.find(".ms-txt-component").offset().top+25;
	        
	        
	        switch(this.align)
	        {
	        	case "left":
	        		this.createDiv.css({"left":left,"top":top});
	        		break;
	        	case "right":
	        		left = left-(parseInt(this.createDiv.css("width"))-$this.outerWidth()+2);
	        		this.createDiv.css({"left":left,"top":top});
	        		break;
	        }
	        
	    };

	    var $txtBox = $this.find(".txt-box-component");
		var $msTxt = $this.find(".ms-txt-component");
			
		msPick.txt = function()
		{
			var _this = this;

			$msTxt.on("keyup",function(event){

	    		var keyWords = $(this).val();
		        var aResult = [];//构建li所存的过滤出来的一个数组。
		        var strLi="";//构建li时拼li的字符串。
		        var str="";//存放msok/mserror字符串
		        var $msOk = $this.find(".ms-ok-component");
		        var $msError = $this.find(".ms-error-component");

		        var strA = "";
		        var bKey = false; //判断输入内容是否为功能键
		        for(var i=0;i<conf.keyArray.length;i++)
		        {
		            if(event.keyCode==conf.keyArray[i])
		            {
		                bKey=true;
		            }
		        }

		        _this.createDiv.hide();

		        if(!bKey)
		        {
		        	
		        	for(var i=0,listDataLen = _this.listData.nodes.length;i<listDataLen;i++)
		            {
		                if((_this.listData.nodes[i].name.indexOf(keyWords)>-1)&&(keyWords!=""))
		                {
		                    aResult.push(_this.listData.nodes[i]);
		                }
		            }

		            if($msOk) $msOk.remove();
		            if($msError) $msError.remove();

		            if(aResult.length>0)
		            { 
		                if(aResult.length>conf.max) aResult.length = conf.max;

		                for(var i=0;i<aResult.length;i++)
		                {
		                    strLi += "<li rel="+aResult[i].code+"><a href='javascript:;'>"+aResult[i].name+"</a></li>";
		                }
		                str = "<div class='ms-ok-component' style='width:"+_this.style.msOkWidth+"'>"+
		                      "<ul class='ms-list-component'>"+
		                      strLi+
		                      "</ul></div>";
		            }
		            if((aResult.length==0)&&(keyWords!=""))
		            {
		                str = "<div class='ms-error-component'>您输入的信息不存在，请重新输入</div>"; 
		            }

		            $this.append($(str));

		            conf.index=0;//每次都要重置索引号。因为列表有按键等操作，不重置，有些时候会选中下面的。
		            $this.find("li").eq(conf.index).addClass("active");

		            msTipPosition()
		            
		        }

		        
				var aLi = $this.find("li");
	            aLi.on("mouseover",function(){

		            aLi.removeClass("active");
		            $(this).addClass("active");
		            conf.index = $(this).index();

		        });

	            var addA = function(maxnum)
	            {	
	            	var keyWordsSelected=$this.find(".ms-ok-component").find('.active').text();
	             	var keyWordsId = $this.find(".ms-ok-component").find('.active').attr("rel");
	             	strA = "<a href='javascript:;' class='ms-selected-item' rel="+keyWordsId+">"+
	                        "<span class='text'>"+keyWordsSelected+"</span>"+
	                        "<span class='delete-component'>删除</span></a>";

	             	if(_this.check=="radio")
	             	{	
		                $this.find(".txt-box-component").find("a").remove();

		                $this.find(".ms_checkInput").val(keyWordsId);     
	             	}

	             	if(_this.check=="checkbox")
	             	{
	             		conf.selectLenght = conf.msCheckInputArr.length; 
			            if(conf.selectLenght>=maxnum)
			            {
			                $this.find(".ms-txt-component").val("");
			                if($msOk) $msOk.remove();
			                alert("最多选择5项");
			                return;
			            }

		             	var allA = $this.find(".txt-box-component").find(".ms-selected-item");
		             	var bCunZai = false;
		             	for(var i=0;i<allA.length;i++)
			            {
			                if(allA[i].getAttribute("rel")==keyWordsId)
			                {
			                    bCunZai =true;
			                }
			            }

			            if(bCunZai)
			            {
			                $this.find(".ms-txt-component").val("");
			                return;
			            } 
		                conf.msCheckInputArr.push(keyWordsId);
		                $this.find(".ms_checkInput").val(conf.msCheckInputArr.join(",")); 
	             	}

	             	$(strA).insertBefore($this.find(".ms-txt-component"));
	             	$this.find(".ms-txt-component").val("");
	             	conf.aMsCb = _this.createDiv.find(".ms-cb-cb");
	             	
	            	conf.aMsCb.each(function(){

		                if($(this).attr("value")==keyWordsId)
		                {
		                    $(this).attr("checked",true);
		                }
		            })
		            if($msOk) $msOk.remove();

	             	msPick.mpPosition()

           
	            };

	            if(event.keyCode==13)
	            {	
	            	if(aLi.length==0)
		            {
		                $(this).val("");

		                return;
		            }
		            addA(5);        
	            }

	            aLi.on("click",function()
	            {
		            addA(5);
	            })
	            
	            switch(event.keyCode)
		        {
		            case 38:
		                conf.index--;
		                if(conf.index==-1) conf.index=aLi.length-1;
		                aLi.removeClass("active");
		                aLi.eq(conf.index).addClass("active");
		                break;                
		            case 40:
		                conf.index++;
		                if(conf.index==aLi.length) conf.index=0;
		                aLi.removeClass("active");
		                aLi.eq(conf.index).addClass("active");
		                break;
		        }

	    	})

			$this.find(".ms-txt-component").on("keydown",function(event){

				var lastA = $this.find(".txt-box-component").find(".ms-selected-item:last");
		        if(event.keyCode==8)
		        {
		            if($(this).val()=="")
		            {
		                
		                if(_this.check=="radio")
		                {
		                	lastA.remove();
			                $this.find(".ms-txt-component").val("");
			                $this.find(".ms_checkInput").val("");
			                _this.createDiv.find(".ms-cb-cb").attr("checked",false);

		                }

		                if(_this.check=="checkbox")
		                {
		                	conf.aMsCb = _this.createDiv.find(".ms-cb-cb");
			                for(var i=0;i<conf.msCheckInputArr.length;i++)
			                {
			                	if(lastA.attr("rel")==conf.msCheckInputArr[i])
			                	{
			                		conf.msCheckInputArr.pop();
			                	}
			                }
			                $this.find(".ms_checkInput").val(conf.msCheckInputArr.join(","));

			                for(var i=0;i<conf.aMsCb.length;i++)
			                {
			                    if(lastA.attr("rel")==conf.aMsCb[i].value)
			                    {
			                        conf.aMsCb[i].checked = false;
			                    }
			                }
			                lastA.remove();
		                }

		                msPick.mpPosition()
		            }
		        }

			})

			//计算 ms-ok/ms-error 提示框的位置。
			var msTipPosition = function()
			{
				var left = $this.find(".ms-txt-component").position().left;
	            var top = $this.find(".ms-txt-component").position().top+30;
	            $(".ms-ok-component").css({"left":left,"top":top});
	            $(".ms-error-component").css({"left":left,"top":top});
			};

		}

		//ms-pick
		msPick.ckBox = function()
		{
			//msPick.createDiv = $("#"+this.id);
			var tabMenu = this.createDiv.find(".h-tab").find(".tab-menu-component");
		    var cTabCon = this.createDiv.find(".c-tab").find(".tab-con-component");
		    var oClose = this.createDiv.find(".w-h-tab-component").find(".close-component");
		    var aDelete = [];//存放所有创建的a标签

		   var _this = this;

		    if (tabMenu.length>=2) {

		    	tabMenu.on("click",function(){

			        var temp = $(this).index();
			        switch(temp)
			        {
			            case 0:
			            _this.createDiv.css("width","400px");
			            break;
			            case 1:
			            _this.createDiv.css("width","570px");
			        }
			        $(this).parent().find("li").removeClass("active");
			        $(this).addClass("active");
			        cTabCon.hide();
			        cTabCon.eq(temp).show();
			    })
			    
		    };

		    oClose.on("click",function(){
		        _this.createDiv.hide();
		    })

		    conf.aMsCb = this.createDiv.find(".ms-cb-cb");

		    var $MsCb = this.createDiv.find(".ms-cb-component");

		    $MsCb.on("change",function(){

		    	var oCheckBox = $(this).find(".ms-cb-cb");
		    	var keyWordsSelected = oCheckBox.attr("ms-cb-data");
	            var keyWordsId = oCheckBox.val();
	            var strA = "<a href='javascript:;' class='ms-selected-item' rel="+keyWordsId+">"+
	                        "<span class='text'>"+keyWordsSelected+"</span>"+
	                        "<span class='delete-component'>删除</span></a>";

	            if(_this.check=="radio")
	            {
	            	$this.find("a").remove();
	                $(strA).insertBefore($this.find(".ms-txt-component"));
	                $this.find(".txt-box-component").val(keyWordsId);
	                $this.find(".ms-txt-component").val("");

	                conf.aMsCb = _this.createDiv.find(".ms-cb-cb");
	                conf.aMsCb.attr("checked",false);
	            	conf.aMsCb.each(function(){

		                if($(this).attr("value")==keyWordsId)
		                {
		                    $(this).attr("checked",true);
		                }
		            })
		            $this.find(".ms_checkInput").val(keyWordsId);
	            }
	            
   				if(_this.check=="checkbox")
   				{
   					selectCityLenght = conf.msCheckInputArr.length;

			    	var tempArrFn = function()
			    	{
			    		var tempArr = [];
				        for(var i=0;i<conf.msCheckInputArr.length;i++)
				        {
				        	if(oCheckBox.val()!=conf.msCheckInputArr[i])
				        	{
				        		tempArr.push(conf.msCheckInputArr[i]);
				        	}
				        }
				        conf.msCheckInputArr=tempArr;
				        $this.find(".ms_checkInput").val(tempArr.join(","));
			    	}

			    	if(selectCityLenght>=options.maxCount)
			        { 

			            if(oCheckBox.attr("checked")!="checked")
			            {
			            	tempArrFn();
			            }else
			            {
			            	$(this).find(".ms-cb-cb").attr("checked",false);
				            alert("最多选择5项");
				            return;
			            }
			            
			        }
			        aDelete = $this.find(".ms-selected-item");
			        

			        if(oCheckBox.attr("checked"))
			        {
			            for(var i=0;i<conf.aMsCb.length;i++)
			            {

			                if(oCheckBox.val()==conf.aMsCb[i].value)
			                {
			                    conf.aMsCb[i].checked = true;
			                }
			            }
			                        
			            $(strA).insertBefore($this.find(".ms-txt-component"));   
			            conf.msCheckInputArr.push(keyWordsId); 
			            $this.find(".ms_checkInput").val(conf.msCheckInputArr.join(","));
			        }
			        else
			        {
			            for(var i=0;i<conf.aMsCb.length;i++)
			            {

			                if(oCheckBox.val()==conf.aMsCb[i].value)
			                {
			                    conf.aMsCb[i].checked = false;
			                }
			            }
			            aDelete.each(function(){

			                if($(this).attr("rel")==oCheckBox.attr("value"))
			                {
			                    $(this).remove();
			                }
			            })

			            tempArrFn();

			        }
   				}
		    	
   				if($this.find(".ms-ok-component")) $this.find(".ms-ok-component").remove();
		        msPick.mpPosition()
		        
		    })
		};

		$txtBox.on("click",function(event){
			$(".ms-pick").hide();
			msPick.createDiv.show();
			msPick.mpPosition();
			$msTxt.focus();
			
			event.stopPropagation();
		})
		setTimeout(function(){
			
			msPick.txt();
			msPick.ckBox();

		},100)



		$(document).click(function(){
			if($this.find(".ms-ok-component")) $this.find(".ms-ok-component").remove();
			if($this.find(".ms-error-component")) $this.find(".ms-error-component").remove();
		})

		/*remove a*/
		msPick.removeA = function()
		{
			var aCheckedLable = [];	//存放所有被选中的checkbox
			var _this = this;
		    
		    $this.find(".txt-box-component").on("click",".delete-component",function(){

		    	if(_this.check=="radio")
		    	{
		    		$(this).parent(".ms-selected-item").remove();
		    		_this.createDiv.find(".ms-cb-cb").attr("checked",false);
		    		$this.find(".ms_checkInput").val("");
		    		msPick.mpPosition();
		    	}

		    	if(_this.check=="checkbox")
		    	{
		    		if(_this.createDiv.find(".ms-cb-cb").length>0)
		    		{

		    			aCheckedLable = _this.createDiv.find(".ms-cb-cb:checked");
				        var _$this = $(this);
				        aCheckedLable.each(function(){
				            if($(this).attr("value")==_$this.parent().attr("rel"))
				            {
				                $(this).attr("checked",false);

				            }
				        })
		    		}
			        var tempArr = [];
			        for(var i=0;i<conf.msCheckInputArr.length;i++)
			        {
			        	if($(this).parent().attr("rel")!=conf.msCheckInputArr[i])
			        	{
			        		tempArr.push(conf.msCheckInputArr[i])
			        	}
			        }
			        conf.msCheckInputArr=tempArr;
			        $this.find(".ms_checkInput").val(tempArr.join(","));
			        $(this).parent(".ms-selected-item").remove();
			        msPick.mpPosition();
			        return false;
		    	}
		        
		    })
		}
	    
		msPick.removeA();

		$(window).resize(function() {
	    	msPick.mpPosition()
		});

		$(document).on("click",function(event){

			$(".ms-pick").hide();
		})

		$(".ms-pick").on("click",function(event){
			event.stopPropagation();
		})
		
		return this;
	}
})(jQuery)