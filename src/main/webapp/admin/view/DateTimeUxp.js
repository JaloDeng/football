!function(def,initCmpFn,comboCbFn){
	def.both('App.view.DateTimeUxp','',initCmpFn,comboCbFn);
}(ExtApp.defineUx,
/*initCmpFn*/
function(me) {
// 选取时间日期界面控件，在本函数内写代码
	//useful strings
	var windowName=me.title||'选取时间日期'

	,onConfigsItem=function(undefined){
		var that=me,ON=that.ON,utl=that.Utl
		,pushItems=utl.pushItems,xitem=utl.dimItem
		,ioParam=that.ioParam=that.ioParam||{}
		,headButtons=[]
		,idValue=ioParam.idValue,idValueHas=(!!idValue||idValue===0)
		,windowTitle=windowName+(idValueHas?"管理":"选择")
		,uxDontClose=me.uxDontClose
		,config=utl.dimUxConf({
			owner:that
			,headButtons:headButtons
			,uxDontClose:uxDontClose
			,windowTitle:windowTitle
			,onLoad:onMethodsData
			,onUnload:onUnloadMe
			,onClose:onCloseMe
			,isComboVld:true
		})

		,openerPanel=ioParam.openerPanel
		,openerCombo=that.uxOpenerCombo
		,dropDateTimePart=ioParam.dropDateTimePart || {date:false,time:false,format:'Y-m-d_H.i.s'}

		,getStoreTime=function(pofx,max){
			var a=[],i=0,t='';
			for(;i<=max;i++){
				t=i<10?['0',i].join(''):[i].join('');
				a.push({text:t+pofx,val:t});
			}
			return {fields:['text','val'],data:a};
		}
		,bindTip=ExtApp.bindTip

		,fnBuildTimeCt=function(opts){
			 var opts_part = opts.part ||'uxHourCbo'||'uxMinuteCbo'||'uxSecondCbo'
			;var opts_unit = opts.unit
			;var opts_cTip = opts.cTip
			;var opts_nTip = opts.nTip
			;var opts_nMax = opts.nMax ||59
			;var opts_nMin = opts.nMin ||0
			
			var rt1=xitem('combo',{editable:false,queryMode:'local',valueField:'val',store:getStoreTime(opts_unit,opts_nMax),uxTimePart:opts_part
					,width:66,autoSelect:false,tipText:{add:bindTip,text:opts_cTip}
					,ON:{boxready:function(_this, eOpts ){
							_this.uxOwner && (_this.uxOwner[_this.uxTimePart]=_this);
							_this.tipText.add(_this.bodyEl.id,_this.tipText.text);
						}
						,change:function(_this, newValue, oldValue, eOpts ){
							var ownerCt=_this.uxOwner;
							var pickCt=ownerCt.uxDatePicker;
							var cbo=pickCt.uxCombo;
							var curPart=_this.uxTimePart;
							var hourVal  =curPart==='uxHourCbo'  ?newValue:ownerCt.uxHourCbo.getValue();
							var minuteVal=curPart==='uxMinuteCbo'?newValue:ownerCt.uxMinuteCbo.getValue();
							var secondVal=curPart==='uxSecondCbo'?newValue:ownerCt.uxSecondCbo.getValue();
							var pickVal=pickCt.getValue();
							if(Ext.isDate(pickVal)){
								pickVal.setHours(V.CINT(hourVal), V.CINT(minuteVal), V.CINT(secondVal));
							}
							cbo.inputEl.dom.value=Ext.Date.format(pickVal, cbo.dropDateTimePart.format)||''
						}
						,expand:function(_this){
							var picker=_this.getPicker();
							picker.setHeight(_this.uxOwner.uxDatePicker.getHeight());
							var itemNode = picker.getNode(_this.lastSelection[0]);
							if(!itemNode)return;
							picker.highlightItem(itemNode);
							picker.listEl.scrollBy( itemNode.offsetLeft, itemNode.offsetTop, false );
						}

						}},that);

			var rt2=xitem('numberfield',{width:24,tipText:{add:bindTip,text:opts_nTip},uxSpinMax:opts_nMax,uxSpinMin:opts_nMin
					,ON:{boxready:function(_this, eOpts ){
							_this.tipText.add(_this.bodyEl.id,_this.tipText.text);
						_this.inputEl.hide()}
					,spin:function(_this,dir){var cbel=_this.el.prev(),cbct=Ext.getCmp(cbel.id),smax=_this.uxSpinMax,smin=_this.uxSpinMin;
						var n=parseInt(cbct.getValue(),10);if(isNaN(n))n=0;
						if(dir==='up'){
							n=n-1;
							if(n<smin)n=smax;
							cbct.setValue( n<10?['0',n].join(''):String(n) );
							_this.setValue(n)
						}else{
							n=n+1;
							if(n>smax)n=smin;
							cbct.setValue( n<10?['0',n].join(''):String(n) );
							_this.setValue(n)
						}
					}
					}},that);
			return [rt1,rt2];
		}
		,hourCts=fnBuildTimeCt({part:'uxHourCbo',	unit:'时',cTip:'选择「时」(Alt+6)',nTip:'调整「时」',nMax:23})
		,minuCts=fnBuildTimeCt({part:'uxMinuteCbo',	unit:'分',cTip:'选择「分」(Alt+7)',nTip:'调整「分」'})
		,secoCts=fnBuildTimeCt({part:'uxSecondCbo',	unit:'秒',cTip:'选择「秒」(Alt+8)',nTip:'调整「秒」'})
		;
		config.autoScroll=true;
		config.layout={type:'vbox',align:'stretch'};

		if(openerCombo){

			if(dropDateTimePart){
				if(dropDateTimePart.time)dropDateTimePart.format="Y-m-d";
				if(dropDateTimePart.date)dropDateTimePart.format="H.i.s";
				if(dropDateTimePart.time&&dropDateTimePart.date){
					dropDateTimePart.time=false;dropDateTimePart.date=false;
					dropDateTimePart.format='Y-m-d_H.i.s'
				}
				if(!dropDateTimePart.time&&!dropDateTimePart.date){
					dropDateTimePart.format='Y-m-d_H.i.s'
				}
			}

			openerCombo.dropDateTimePart=dropDateTimePart;

		pushItems(config.items,[
			xitem('toolbar',{ui:'footer',items:[
				xitem('button',{text:'清空',tooltip:'清空输入框的值并返回(Alt+1)',uxCombo:openerCombo,handler:function(btn){btn.uxCombo.uxClicked='clear';btn.uxCombo.collapse();btn.uxCombo.focus();}
					,ON:{boxready:function(_this){
						_this.uxOwner && (_this.uxOwner.uxBtnClear=_this);
						}}
					},that)
				,xitem('button',{text:'复原',tooltip:'复原为下拉框出现前的值(Alt+2)',uxCombo:openerCombo,handler:function(btn){
						var ownerCt=btn.uxOwner;
						var comboCt=btn.uxCombo;
						var pickCt=ownerCt.uxDatePicker;
						var hourCt=ownerCt.uxHourCbo;
						var minuteCt=ownerCt.uxMinuteCbo;
						var secondCt=ownerCt.uxSecondCbo;
						var oldDate=pickCt.uxOldDate;
						var now=Ext.isDate(oldDate)?oldDate:new Date,h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
						hourCt.setValue( h<10?['0',h].join(''):String(h) );
						minuteCt.setValue( m<10?['0',m].join(''):String(m) );
						secondCt.setValue( s<10?['0',s].join(''):String(s) );
						pickCt.setValue(now);
						comboCt.inputEl.dom.value=pickCt.uxOldInput;
						}
					,ON:{boxready:function(_this){
						_this.uxOwner && (_this.uxOwner.uxBtnReset=_this);
						}}
					},that),'->'
				,xitem('button',{text:'现在',tooltip:'将日期或时间设为现在的(Alt+3)',handler:function(btn){
						var ownerCt=btn.uxOwner;
						var pickCt=ownerCt.uxDatePicker;
						var hourCt=ownerCt.uxHourCbo;
						var minuteCt=ownerCt.uxMinuteCbo;
						var secondCt=ownerCt.uxSecondCbo;
						pickCt.selectToday();
						var now=new Date,h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
						hourCt.setValue( h<10?['0',h].join(''):String(h) );
						minuteCt.setValue( m<10?['0',m].join(''):String(m) );
						secondCt.setValue( s<10?['0',s].join(''):String(s) );
						}
					,ON:{boxready:function(_this){
						_this.uxOwner && (_this.uxOwner.uxBtnNow=_this);
						}}
					},that),'->'
				,xitem('button',{text:'选定',tooltip:'将选中的值返回到输入框(Alt+4)',uxCombo:openerCombo,handler:function(btn){btn.uxCombo.uxClicked=false;btn.uxCombo.collapse();btn.uxCombo.focus();}
					,ON:{boxready:function(_this){
						_this.uxOwner && (_this.uxOwner.uxBtnOk=_this);
						}}
					},that)
				,xitem('button',{text:'关闭',tooltip:'关闭下拉框并返回输入框(Alt+5)',uxCombo:openerCombo,handler:function(btn){btn.uxCombo.uxClicked='close';btn.uxCombo.collapse();btn.uxCombo.focus();}
					,ON:{boxready:function(_this){
						_this.uxOwner && (_this.uxOwner.uxBtnClose=_this);
						}}
					},that)
			]})


			,xitem(2,{layout:'hbox',dropDateTimePart:dropDateTimePart
				,ON:{boxready:function(b){b.dropDateTimePart && b.dropDateTimePart.time && (b.hide())}}
				,items:[
					 hourCts[0],hourCts[1]
					,minuCts[0],minuCts[1]
					,secoCts[0],secoCts[1]
				]})

			 ,xitem('datepicker',{flex:1,uxOwner:me,uxCombo:openerCombo,dropDateTimePart:dropDateTimePart
			 	 ,ON:{boxready:function(b){b.dropDateTimePart && b.dropDateTimePart.date && (b.el.dom.style.visibility='hidden')}
			 	 	,select:function(that,dtValue){
					var pickCt=that;
					var cbo=that.uxCombo;
					var ownerCt=pickCt.uxOwner;
					var hourCt=ownerCt.uxHourCbo;
					var minuteCt=ownerCt.uxMinuteCbo;
					var secondCt=ownerCt.uxSecondCbo;
					var pickVal=dtValue;
					if(Ext.isDate(pickVal)){
						pickVal.setHours(V.CINT(hourCt.getValue()), V.CINT(minuteCt.getValue()), V.CINT(secondCt.getValue()));
					}
					cbo.inputEl.dom.value=Ext.Date.format(pickVal, cbo.dropDateTimePart.format)||''
					}
			 	
				}
			})

		]);


			openerCombo.on('expand',function(cbo){
				var dropDateTimePart=cbo.dropDateTimePart
					,inpval=cbo.inputEl.dom.value
					,dt=Ext.Date.parse(inpval, dropDateTimePart.format, true);
				(function(formats){
					for(var i=0;i<formats.length;i++){
						if(!dt){
							dt=Ext.Date.parse(inpval, formats[i], true)
						}else{
							break;
						}
					}
				})(dropDateTimePart.date?[
					"H:i:s","H:i","His","Hi","G.i.s","G.i","G:i:s","G:i"
					]:dropDateTimePart.time?[
					"Y-m-d","Y/m/d","Y.m.d","Ymd","Y-n-j","Y/n/j","Y.n.j"
					]:[
					 "Y-m-d H:i:s"
					,"Y-m-d H:i"
					,"Y/m/d H:i:s"
					,"Y/m/d H:i"
					,"Y-m-d_H:i:s"
					,"Y-m-d_H:i"
					,"Y/m/d_H:i:s"
					,"Y/m/d_H:i"
					,"Ymd His"
					,"Ymd Hi"
					,"Ymd-His"
					,"Ymd-Hi"
					,"Ymd/His"
					,"Ymd/Hi"
					,"Ymd.His"
					,"Ymd.Hi"
					,"Ymd_His"
					,"Ymd_Hi"
					,"Y.n.j-G.i.s"
					,"Y.n.j-G.i"
					,"Y/n/j-G.i.s"
					,"Y/n/j-G.i"
					,"Y-n-j G:i:s"
					,"Y-n-j G:i"
					,"Y.n.j G.i.s"
					,"Y.n.j G.i"
					,"Y/n/j G:i:s"
					,"Y/n/j G:i"
					,"Y-n-j/G.i.s"
					,"Y-n-j/G.i"
					,"Y-n-j_G:i:s"
					,"Y-n-j_G:i"
					,"Y.n.j_G.i.s"
					,"Y.n.j_G.i"
					,"Y/n/j_G:i:s"
					,"Y/n/j_G:i"
				]);

				var pickCt=cbo.uxDatePicker;
				var ownerCt=pickCt.uxOwner;
				var hourCt=ownerCt.uxHourCbo;
				var minuteCt=ownerCt.uxMinuteCbo;
				var secondCt=ownerCt.uxSecondCbo;
				var now=Ext.isDate(dt)?dt:new Date,h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
				pickCt.uxOldDate=now;
				pickCt.uxOldInput=cbo.inputEl.dom.value;
				hourCt.setValue( h<10?['0',h].join(''):String(h) );
				minuteCt.setValue( m<10?['0',m].join(''):String(m) );
				secondCt.setValue( s<10?['0',s].join(''):String(s) );
				pickCt.setValue(now);
				cbo.inputEl.dom.value=pickCt.uxOldInput;
				pickCt.focus();
			});
			openerCombo.on('collapse',function(cbo){
				if(!cbo.uxClicked)cbo.uxClicked=false;
				if(cbo.uxClicked==='close'){return}
				if(cbo.uxClicked==='clear'){cbo.inputEl.dom.value='';return}
				var pickCt=cbo.uxDatePicker;
				var ownerCt=pickCt.uxOwner;
				var hourCt=ownerCt.uxHourCbo;
				var minuteCt=ownerCt.uxMinuteCbo;
				var secondCt=ownerCt.uxSecondCbo;
				var pickVal=pickCt.getValue();
				if(Ext.isDate(pickVal)){
					pickVal.setHours(V.CINT(hourCt.getValue(),10), V.CINT(minuteCt.getValue(),10), V.CINT(secondCt.getValue(),10));
				}
				cbo.inputEl.dom.value=Ext.Date.format(pickVal, cbo.dropDateTimePart.format)||'';
				//console.log(encodeURIComponent(cbo.inputEl.dom.value));
				cbo.inputEl.focus();
			});

		}/*eof:if(openerCombo)*/

		return config
	}

	,onMethodsData=function(that,eOpts){
		//useful params
		var utl=that.Utl
		,pushItems=utl.pushItems,xitem=utl.dimItem
		,ioParam=that.ioParam=that.ioParam||{}
		,openerPanel=ioParam.openerPanel
		,openerCombo=that.uxOpenerCombo
		/*,idValue=ioParam.idValue,idValueHas=(!!idValue||idValue===0)*/
		,dropDateTimePart=ioParam.dropDateTimePart || {date:false,time:false,format:'Y-m-d_H.i.s'}
		,LICFG='listConfig',licob={renderTo:that.el},UXDTP='uxDatePicker'
		;

		if(openerCombo){

			openerCombo[UXDTP]=that[UXDTP]=that.down('datepicker')
			that.uxHourCbo[LICFG]=licob;
			that.uxMinuteCbo[LICFG]=licob;
			that.uxSecondCbo[LICFG]=licob;

			that.uxKeyMap=new Ext.util.KeyMap({
				target:that.el,binding:[
					 {key:'1',alt:true,fn:function(){var e=that.uxBtnClear; e && e.fireHandler()}}
					,{key:'2',alt:true,fn:function(){var e=that.uxBtnReset; e && e.fireHandler()}}
					,{key:'3',alt:true,fn:function(){var e=that.uxBtnNow; e && e.fireHandler()}}
					,{key:'4',alt:true,fn:function(){var e=that.uxBtnOk; e && e.fireHandler()}}
					,{key:'5',alt:true,fn:function(){var e=that.uxBtnClose; e && e.fireHandler()}}
					,{key:'6',alt:true,fn:function(){var e=that.uxHourCbo; e && e.focus()}}
					,{key:'7',alt:true,fn:function(){var e=that.uxMinuteCbo; e && e.focus()}}
					,{key:'8',alt:true,fn:function(){var e=that.uxSecondCbo; e && e.focus()}}
					,{key:'9',alt:true,fn:function(){var e=that.uxDatePicker; e && e.focus()}}
					]
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
