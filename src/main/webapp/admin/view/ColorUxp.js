!function(def,initCmpFn,comboCbFn){
	def.both('App.view.ColorUxp','',initCmpFn,comboCbFn);
}(ExtApp.defineUx,
/*initCmpFn*/
function(me) {
// 选取颜色界面控件，在本函数内写代码
	//useful strings
	var windowName=me.title||'选取颜色'

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
		pushItems(config.items,[xitem('colorpicker',{})]);

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

			openerCombo.uxPicker=!openerCombo.uxPicker?that.down('colorpicker'):null;
			if(openerCombo.uxPicker){
				openerCombo.uxPicker.uxCombo=openerCombo;
				openerCombo.uxPicker.on('select',function(that,color){
					var cbo=that.uxCombo;
					cbo.inputEl.dom.value=color||''
					if(cbo.inputEl.dom.value){try{
							var et=cbo.triggerEl.elements[0];
							et.dom.style.borderLeft=et.uxCtpl+cbo.inputEl.dom.value;
						}catch(E){}
					}


				})
			}
			openerCombo.on('expand',function(cbo){
				try{cbo.uxPicker.select(cbo.inputEl.dom.value);
					cbo.uxPicker.focus();
				}catch(E){}
			});
			openerCombo.on('collapse',function(cbo){
				cbo.inputEl.dom.value=cbo.uxPicker.getValue()||'';
				if(cbo.inputEl.dom.value){try{
							var et=cbo.triggerEl.elements[0];
							et.dom.style.borderLeft=et.uxCtpl+cbo.inputEl.dom.value;
					}catch(E){}
				}
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
	var triggers={
		trigger2:{cls:'x-form-clear-trigger',handler:function(ev){
				var cmp=this,et=cmp.triggerEl.elements[0];
				cmp.inputEl.dom.value='';
				et.dom.style.borderLeft=et.uxCtpl+'fff';
				cmp.collapse();
			}
		}
		,trigger3:{cls:'x-form-arrow-trigger',handler:function(){
			this.onTriggerClick()
			}
		}
	};
	return Ext.apply(config,
		{matchFieldWidth:false,editable:false,tipText:{text:'\u989c\u8272\u9009\u62e9',textSel:'\u6311\u9009\u989c\u8272',textDel:'\u6e05\u7a7a\u989c\u8272'}
			,listeners:{boxready:function(cmp){
				var els=cmp.triggerEl.elements,et=els[0],tp=cmp.tipText
					,bindTip=ExtApp.bindTip
				;
				bindTip(els[0].id,tp.text);
				bindTip(els[1].id,tp.textDel);
				bindTip(els[2].id,tp.textSel);
				et.uxCtpl=[et.getWidth(),'px solid #'].join('');
				et.dom.style.borderLeft=et.uxCtpl+'fff';
				cmp.inputEl.dom.style.backgroundColor='#fff';
				}
			}
			,trigger2Cls:triggers.trigger2.cls,onTrigger2Click:triggers.trigger2.handler
			,trigger3Cls:triggers.trigger3.cls,onTrigger3Click:triggers.trigger3.handler
		}
	);
}/*eof:comboCbFn*/
);
