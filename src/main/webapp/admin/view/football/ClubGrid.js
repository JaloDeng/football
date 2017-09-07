!function(def,initCmpFn){
	def({
		ns:'App.view.football.ClubGrid'
		,inc:['App.view.DateTimeUxp','App.view.ColorUxp','App.view.YearMonthUxp']
		,fn:initCmpFn
	});
}(ExtApp.dimUxp,
/*initCmpFn
*/
function(me) {
// 消息推送管理界面，在本函数内写代码
	//useful strings
	var windowName=me.title||'俱乐部资料'

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
		pushItems(config.items,[xitem('grid',{
			itemId:'clubGrid',
			autoScroll:true,
			store: ExtApp.storeBy('club',{fields:['id', 'name']}, null),
			columns: [
					{ text: 'id', dataIndex: 'id' },
			        { text: '姓名', dataIndex: 'name' }
				]
			},me)]);
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
		//测试
//		console.log('onLoad uxp ' , V.JSO(V.VER[2]) , V.EUC({idx:[2,3]}) , V.ARR('','FALSE') );
//		
//		V.FORA(new Date,function(ar){console.log(ar.v)});
		
		ExtApp.ajax('../club?page=1&size=1',null,'GET',function(args){
			var da=Ext.decode(args[2].responseText,true);
			ExtApp.storeBy('club',null,da);
		});
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
