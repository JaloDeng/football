!function(def,initCmpFn){
	def({
		ns:'App.view.football.DemoYaUxw'
		,inc:['App.view.football.DemoYaUxp']
		,fn:initCmpFn
		,w:1
	});
}(ExtApp.dimUxp,
/*initCmpFn
*/
function(me) {
// 消息推送管理界面，在本函数内写代码
	//useful strings
	var windowName=me.title||'消息推送'

	,onConfigsItem=function(undefined){
		var ON=me.ON,utl=me.Utl
		,pushItems=utl.pushItems,xitem=utl.dimItem
		,ioParam=me.ioParam=me.ioParam||{}
		,headButtons=[]
		,idValue=ioParam.idValue,idValueHas=(!!idValue||idValue===0)
		,windowTitle=windowName+(idValueHas?"管理":"选择")
		,uxDontClose=me.uxDontClose
		,config=utl.dimUxConf({
			owner:me
			,uxDontClose:uxDontClose
			,windowTitle:windowTitle
			,onLoad:onMethodsData
			,onUnload:onUnloadMe
			,onClose:onCloseMe
			,isWindow:true
			,onShow:onShowMe
		});
		config.header.items=headButtons;
		pushItems(config.items,[xitem('App.view.football.DemoYaUxp',{uxWindow:me,uxDontClose:true})]);
		return config
	}

	,onMethodsData=function(that,eOpts){
		//useful params
		var utl=that.Utl
		,pushItems=utl.pushItems,xitem=utl.dimItem
		,ioParam=that.ioParam=that.ioParam||{}
		;
		console.log('onLoad uxw');
		//TODO:encode single quotes in middleware(java|php)
		console.log(
			Ext.encode(["Let's play ExtJs!",that.uxGetInc()])
		)
	}
	,onShowMe=function(that,eOpts) {
		//that.uxOpenerPanel && that.uxOpenerPanel.setLoading(!1);
	}
	,onCloseMe=function(that,btn) {
		var unload=that.uxEventUnload;
		return unload&&unload(that);
	}
	,onUnloadMe=function(that){
		console.log('unLoad uxw');
	}
	;

	return onConfigsItem()

}/*eof:initCmpFn*/
);
