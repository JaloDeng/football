!function(def,initCmpFn,comboCbFn){
	def.both('App.view.YearMonthUxp','',initCmpFn,comboCbFn);
}(ExtApp.defineUx,
/*initCmpFn*/
function(me) {
// 选取年月界面控件，在本函数内写代码
	//useful strings
	var windowName=me.title||'选取年月'

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
			,headButtons:headButtons
			,uxDontClose:uxDontClose
			,windowTitle:windowTitle
			,onLoad:onMethodsData
			,onUnload:onUnloadMe
			,onClose:onCloseMe
			,isComboVld:true
		});
		config.autoScroll=true;
		pushItems(config.items,[xitem('monthpicker',{})]);

		return config
	}

	,onMethodsData=function(that,eOpts){
		//useful params
		var utl=that.Utl
		,pushItems=utl.pushItems,xitem=utl.dimItem
		,ioParam=that.ioParam=that.ioParam||{}
		,openerPanel=ioParam.openerPanel
		,openerCombo=that.uxOpenerCombo
		;
		if(openerCombo){

			openerCombo.uxPicker=!openerCombo.uxPicker?that.down('monthpicker'):null;
			if(openerCombo.uxPicker){
				openerCombo.uxPicker.uxCombo=openerCombo;
				openerCombo.uxPicker.buttonsEl.hide();
				openerCombo.uxPicker.on('select',function(that,ymValue){
					var cbo=that.uxCombo,stVal=ymValue.length===2?[ymValue[1]||(new Date).getFullYear(),ymValue[0]+1].join('-').replace(/\-(\d)$/,'-0$1'):'';
					cbo.inputEl.dom.value=stVal;

				})
			}
			openerCombo.on('expand',function(cbo){
				try{
					var stVal=cbo.inputEl.dom.value
						,dt=Ext.Date.parse(stVal, "Y-m",true);
				(function(formats){
					for(var i=0;i<formats.length;i++){
						if(!dt){
							dt=Ext.Date.parse(stVal, formats[i], true)
						}else{
							break;
						}
					}
				})([
					  "Ym" 
					, "Y/m"
					, "Y.m"
					, "Y,m"
					, "Y-n"
					, "Y/n"
					, "Y.n"
					, "Y,n"
					, "n,Y"
					, "n-Y"
					, "n/Y"
					, "n.Y"
					, "m,Y"
					, "m-Y"
					, "m/Y"
					, "m.Y"
					]);
					cbo.uxPicker.setValue(dt);
					cbo.uxPicker.focus();
				}catch(E){}
			});
			openerCombo.on('collapse',function(cbo){
				var ymValue=cbo.uxPicker.getValue(),stVal=ymValue.length===2?[ymValue[1]||(new Date).getFullYear(),ymValue[0]+1].join('-').replace(/\-(\d)$/,'-0$1'):'';
				cbo.inputEl.dom.value=stVal;
			});
		}
	}
	,onCloseMe=function(that,btn) {
		var unload=that.uxEventUnload;
		return unload&&unload(that);
	}
	,onUnloadMe=function(that){
		//console.log('unload');
	}
	;

	return onConfigsItem()

}/*eof:initCmpFn*/

/*comboCbFn*/
,function(config){
	return Ext.apply(config,
		{matchFieldWidth:false}
);
}/*eof:comboCbFn*/

);
