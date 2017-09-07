!function(def,initCmpFn){
	def({
		ns:'App.view.football.DemoYaUxp'
		,inc:['App.view.DateTimeUxp','App.view.ColorUxp','App.view.YearMonthUxp']
		,fn:initCmpFn
	});
}(ExtApp.dimUxp,
/*initCmpFn
*/
function(me) {
// 消息推送管理界面，在本函数内写代码
	//useful strings
	var windowName=me.title||'消息推送'

	,onConfigsItem=function(undefined){
		var utl=me.Utl,pushItems=utl.pushItems,xitem=utl.dimItem,ON=me.ON
		,ioParam=me.ioParam=me.ioParam||{}
		,dimHeadBtn=utl.dimHeadBtn
		,headButtons=[
			 dimHeadBtn({iconCls:'x-fa fa-eraser',text:'清空'})
			,dimHeadBtn(' ')
			,dimHeadBtn({iconCls:'x-fa fa-check-circle',text:'全选'})
			,dimHeadBtn({iconCls:'x-fa fa-check-circle-o',text:'反选'})
			,dimHeadBtn(' ')
			,dimHeadBtn({iconCls:'x-fa fa-save',text:'收藏',tooltip:'有勾选的将被收藏，无勾选的将被删除。'})
		]
		,idValue=ioParam.idValue,idValueHas=(!!idValue||idValue===0)
		,windowTitle=windowName+(idValueHas?"管理":"选择")
		,noHeadButtons=ioParam.noHeadButtons,uxDontClose=noHeadButtons?true:me.uxDontClose
		,config=utl.dimUxConf({
			owner:me
			,headButtons:noHeadButtons?[]:headButtons
			,uxDontClose:uxDontClose
			,windowTitle:windowTitle
			,onLoad:onMethodsData
			,onUnload:onUnloadMe
			,onClose:onCloseMe
		});
		pushItems(config.items,[xitem(2,{layout:'vbox',itemId:'uiBox0',autoScroll:true,items:[
			xitem('appviewdatetimeuxc',{fieldLabel:'日期时间',labelWidth:70
			,width:250,trigger1Cls:'x-form-date-trigger'
			,uxPanelConfig:{ioParam:{dropDateTimePart:{}}}
			},me)
			,xitem('appviewdatetimeuxc',{fieldLabel:'只有时间',labelWidth:70
			,width:250,trigger1Cls:'x-form-date-trigger'
			,uxPanelConfig:{ioParam:{dropDateTimePart:{date:true}}}
			},me)
			,xitem('appviewdatetimeuxc',{fieldLabel:'只有日期',labelWidth:70
			,width:250,trigger1Cls:'x-form-date-trigger'
			,uxPanelConfig:{ioParam:{dropDateTimePart:{time:true}}}
			},me)

			,xitem('appviewyearmonthuxc',{fieldLabel:'年月',labelWidth:70
				,width:250
			},me)

			,xitem('appviewcoloruxc',{fieldLabel:'颜色',labelWidth:70
				,width:250
			},me)


			,xitem('appviewyearmonthuxc',{fieldLabel:'地点',labelWidth:70
				,width:350
			},me)

			,xitem('appviewyearmonthuxc',{fieldLabel:'树型',labelWidth:70
				,width:350
			},me)

			,xitem('appviewyearmonthuxc',{fieldLabel:'可自行追加',labelWidth:70
				,width:350
			},me)

			,xitem('appviewyearmonthuxc',{fieldLabel:'可逗号多选',labelWidth:70
				,width:350
			},me)

			,xitem('appviewyearmonthuxc',{fieldLabel:'数额输入框',labelWidth:70
				,width:350
			},me)


		]},me)]);
		return config
	}

	,onMethodsData=function(that,eOpts){
		//useful params
		var utl=that.Utl,pushItems=utl.pushItems,xitem=utl.dimItem
		,ioParam=that.ioParam=that.ioParam||{}
		,disableEveryEdit=ioParam.disableEveryEdit || false
		;
		if(that.uxWindow){
			var uxPanels=that.uxWindow.uxPanels=that.uxWindow.uxPanels||[];
			uxPanels.push(that);
		}
		console.log('onLoad uxp ' , V.JSO(V.VER[2]) , V.EUC({idx:[2,3]}) , V.ARR('','FALSE') );
		
		V.FORA(new Date,function(ar){console.log(ar.v)});
		
	}
	,onCloseMe=function(that,btn) {
		var unload=that.uxEventUnload;
		return unload&&unload(that);
	}
	,onUnloadMe=function(that){
		console.log('unload uxp');
	}
	;

	return onConfigsItem()

}/*eof:initCmpFn*/
);
