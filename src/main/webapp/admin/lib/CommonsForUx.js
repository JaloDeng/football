/**
 * 表单和表格公共函数和对象
 */
!function(window,Ext,undefined){
/*privates*/
var thisNamespace='App.lib.CommonsForUx'
	,arrEach=Ext.Array.each
	,objEach=Ext.Object.each
	,oclone=function(src){
		return Ext.Object.merge({},src);
	}

	,definedStore=function(storeId,fields,paramx){
		var myStore=Ext.data.StoreManager.get(storeId)
			,conf={storeId:storeId,fields:fields}
		;
		if(!myStore){
			if(paramx)Ext.apply(conf,paramx);
			myStore=Ext.create('Ext.data.Store',conf);
		}
		return myStore;
	}


	,findAtStore=function(store,field,value,like,iscase){
		return store && store.isStore && (like ? store.findRecord(field,value,0,true,iscase||false,false) : store.findRecord(field,value,0,false,iscase||false,true) )
	}


	,headerButtonGen=function(opts,conf){
		var def={xtype:'button',border:false,style:'padding:0'};
		if(typeof opts=='string' && opts==' '){
			opts={text:'&#160;',disabled:true,listeners:{boxready:function(bn){bn.el.setOpacity(0)}}};
		}else if(typeof opts=='string' && opts=='x' && conf ){
			opts={iconCls:'x-fa fa-close',text:'关闭'};
			Ext.apply(opts,conf);
		}
		Ext.apply(def,opts);
		return def;
	}

	,initWinConfig=function(opts){
		var onEventCall = opts.onEventCall || {}, def = {
			layout:'card',border:false,
			closable:false,modal:true,
			resizable:true,maximizable:true,
			plain:true,constrainHeader:false,
			maximized:false,
			width: 680,height: 420,
			header:{
				itemPosition:2,
				titlePosition:0,
				items:[]
			}
			,listeners:{
				show:onEventCall.onShow||Ext.emptyFn
				,hide:onEventCall.onHide||Ext.emptyFn
				,afterlayout:function( that, layout, eOpts ){
					if(!that.uxReadyLayout){
						that.uxReadyLayout=true;
						var onload=that.uxEventLoad;
						onload && onload(that,eOpts);
						if(that.header.tools.close){
							that.on('beforeclose',function(thatW,eOpts){
								var unload=thatW.uxEventUnload;
								unload && unload(thatW,eOpts);
							});
						}
					}
				}
			}
			,uxEventLoad:onEventCall.onLoad
			,uxEventUnload:onEventCall.onUnload
			}
			,headers=def.header.items
			,initHeadItems=opts.initHeadItems || []
			,i,len=initHeadItems.length
		;
		headers.push(headerButtonGen(' '));
		for(i=0;i<len;i++){
			headers.push(opts.initHeadItems[i]);
		}
		headers.push(headerButtonGen('x',{uxEventClose:onEventCall.onClose,
			handler:function(btn){var wn=btn.up('window'),onClose=btn.uxEventClose;if(!(onClose && onClose(wn,btn)===false))wn.close()}
		}));
		delete opts.onEventCall;delete opts.initHeadItems;
		Ext.apply(def,opts);
		return def;
	}

	,combo={
		getDisplayValue:function(combobox){
			var dspFrom=combobox.findRecordByValue(combobox.getValue());
			return dspFrom===false ? null : dspFrom.get(combobox.displayField)
		}
		,ajaxStore:function(url,storeId,fields,paramx){
			var sid=storeId || ('COMBOSTORE' + url.replace(/[\.\/\\]/g,'_'))
				,conf={
					storeId: sid,
					fields: fields || ['id','name'],
					proxy: {
						type: 'ajax',
						url: url,
						pageParam:'page',limitParam:'size',startParam:'',
						reader: {
							type: 'json',
							rootProperty: 'items'
						}
					},
					pageSize: 0,
					autoLoad: true
				}
			;
			Ext.apply(conf,paramx);
			return definedStore(sid,fields,conf);
		}
	}

	,addTipText=function(target,text){
		Ext.tip.QuickTipManager.register({
			target:target,text:text
		});
	}


	,exceptionNeedLogout=function( responseText ){
		var t=responseText
			,ht=/<!DOCTYPE html>/i.test(t)
			,lo=/ExtApp\.HTML_FILE_NAME="login\.html";/i.test(t);
		if(ht&&lo){
			Ext.create('Ext.window.MessageBox', {
				alwaysOnTop:true
			}).show(
			{
				title:ExtApp.util['lang.failure'],
				message: '登录超时，是否转到登录界面？',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				buttonText:{ 
					yes: "转到登录", 
					no: "停留本页"
				},
				fn: function(btn) {
					if (btn === 'yes') {
						Ext.MessageBox.show({
							msg: '正在转到登录界面 ...<br/>或者您可以手动点击<a href="login.html" style="color:#009">[转到链接]</a>',
							progressText: '正在跳转...',
							width: 300,
							wait: {interval: 20}
						});
						location.href=('login.html');
					} else if (btn === 'no') {
						return
					} 
				}
			}
			);
			return!0;
		}else{
			return!1;
		}
	};

;

Ext.define(thisNamespace,{

aeach:arrEach,oeach:objEach

,checkUserLogout:exceptionNeedLogout

,tipText:function(args){return Ext.apply({bind:addTipText},args)}

,form:{
	combo:combo
	,findAtStore:findAtStore
	,oclone:oclone


	,loadToFields:function(params){
		var owner=params.owner;
		if (params.idValueHas) {
			var fnFormLoaded=function(form, action){
				if(ExtApp.exceptionNeedLogout(action.response.responseText)){
					owner.setLoading(false);return;
				}
				if(!action.result||!action.result.success){
					ExtApp.nfobox(ExtApp.util['lang.failure']+owner.getTitle());
					owner.setLoading(false);return;
				}
				if(params.callback)params.callback(form, action);
				owner.setLoading(false);
			};
			owner.setLoading(ExtApp.util['lang.loading']);
			owner.down('form').load({
				url: params.url
				,method:'GET'
				,success: fnFormLoaded
				,failure: fnFormLoaded
			});
		}else{
			if(params.needReset){
				owner.down('form').getForm().reset();
				if(params.callback)params.callback();
			}
		}
	}

	,rankFieldItems:function(fieldComponentList,definedRankField,maxColOneRow,callback){
		var modelFieldRank='App.model.WinFormRankItemForField'
		,modelManager=ExtApp.getModelManager()
		,initFieldRank=function(fieldComponentList,definedRankField,maxColOneRow,callback){
			var dataStoreRankField=[];
			dataStoreRankField.row=0;dataStoreRankField.col=0;dataStoreRankField.uBound=maxColOneRow?maxColOneRow:3;

			arrEach(fieldComponentList, function(item, index, myself) {
				if(typeof(item.allowBlank)!=='undefined'&&item.allowBlank===false)
					item.fieldLabel=ExtApp.util['html.notNull']+item.fieldLabel;
				item.itemId=item.name+'FC';

				if(callback)callback(item);

				var rank='',rn=dataStoreRankField.row,cn=dataStoreRankField.col,rs;
				if(definedRankField[item.name]&&definedRankField[item.name].length>0)
					rank=definedRankField[item.name];
				if(rank.length==0){
					rs='00'+rn;rs=rs.substr(rs.length-2,2);
					if(index % dataStoreRankField.uBound==dataStoreRankField.uBound-1){
						rank='r'+rs+'c'+cn;
						rn++;cn=0;
					}else{
						rank='r'+rs+'c'+cn;
						cn++;
					}
					dataStoreRankField.row=rn;dataStoreRankField.col=cn;
				}
				dataStoreRankField.push({rank:rank,item:item});

			});

			return dataStoreRankField;
		}
		,layoutFieldRank=function(storeRankField,layTpl){
			var rows=[],ris=[],lastRn=false,tpl
				,rtpl=function(){
					return layTpl||{xtype:'container',layout:'hbox',border:false,style:{padding:'2px 0 1px 0'},items:[]}
				}
			;
			storeRankField.each(function(rec){
				var rank=rec.get('rank'),item=rec.get('item')
					,rs=rank.replace(/^r(\d+)c(\d)$/,'$1')
				;
				if(lastRn===false){lastRn=rs}
				if(lastRn!=rs){
					lastRn=rs;
					tpl=rtpl();
					tpl.items=ris;
					rows.push(tpl);
					ris=[];
				}
				ris.push(item);
			});

			tpl=rtpl();
			tpl.items=ris;
			rows.push(tpl);
			return rows;
		};

		if(!modelManager.isRegistered(modelFieldRank)){
			Ext.define(modelFieldRank, {
			    extend: 'Ext.data.Model',
			    fields: ['rank','item']
			});
		};
		var storeRankFieldRaw={
			model:modelFieldRank
			,data:initFieldRank(fieldComponentList,definedRankField,maxColOneRow,callback)
		}
		,storeRankField=Ext.create('Ext.data.Store',storeRankFieldRaw)
		;
		storeRankField.sort('rank');
		return layoutFieldRank(storeRankField);
	}

	,submitCallback:function(form, action, me, callback){
		if ((action.result&&action.result.success==true)||/^200|201$/.test(action.response.status)) {
			Ext.toast({
				html: ExtApp.util['lang.success']+me.getTitle(),
				closable: false,
				align: 't',
				slideInDuration: 400,
				minWidth: 400
			});
			if(callback && callback()===false){return;}
			me.close();
			try{me.ioParam.openerPanel.varShare.storeDefault.reload()}catch(E){}
		} else {
			ExtApp.nfobox(me.getTitle()+ExtApp.util['lang.failure']);
			me.setLoading(false);
		}
	}

	,headerButtonGen:headerButtonGen
	,initWinConfig:initWinConfig

	,initUxConfig:function(options){
		var opt=options||{}
		,owner=opt.owner
		,isWindow=opt.isWindow
		,headButtons=opt.headButtons
		,uxDontClose=opt.uxDontClose
		,windowTitle=opt.windowTitle
		,onLoadMe=opt.onLoad
		,onUnloadMe=opt.onUnload
		,onCloseMe=opt.onClose
		,config;
		if(isWindow){
			config=initWinConfig({title:windowTitle
				,onEventCall:{
					onClose:onCloseMe
					,onLoad:onLoadMe
					,onUnload:onUnloadMe
				}
				,initHeadItems:headButtons
				,items:[]
			});
			delete config.header.items;
			if(uxDontClose){
				config.closable=false;
			}else{
				config.closable=true;
			}
		}else{
			config={
				layout:'card',border:false,
				dockedItems:[],
				listeners:{
					afterlayout:function( that, layout, eOpts ){
						if(!that.uxReadyLayout){
							that.uxReadyLayout=true;
							if(that.tab){
								that.tab.on('beforeclose',function( tab, eOpts ){
									var unload=tab.card && tab.card.uxEventUnload;
									return unload&&unload(tab.card,eOpts)
								});
							}
							var onload=that.uxEventLoad;
							return onload && onload(that,eOpts)
						}
					}
				}
				,items:[]
				,uxEventUnload:onUnloadMe
				,uxEventLoad:onLoadMe
			};
			if(!uxDontClose)headButtons.push(headerButtonGen('x',{uxOwner:owner,uxEventClose:onCloseMe,
				handler:function(btn){if(btn.uxEventClose&&btn.uxEventClose(btn.uxOwner,btn)!==false)btn.uxOwner.close()}
			}));
			arrEach(headButtons,function(itm,idx,arr){
				delete itm.style
			});
			if(headButtons.length>0){
				config.dockedItems.push({xtype:'toolbar',itemId:'headButtons',dock:'top',ui:'footer',enableOverflow:true,items:(headButtons.unshift('->'),headButtons)});
			}
		}
		if(uxDontClose)config.listeners.beforedestroy=function( that, eOpts ){
			if(!that.tab){
				var unload=that.uxEventUnload;
				return unload && unload(that)
			}
		}
		return config
	}


}//eof:form

,grid:{
	combo:combo
	,findAtStore:findAtStore
	,oclone:oclone

	,onlyNeedTheseFields:function(src,fs){
		if(!fs)return src;
		var reta=[];
		arrEach(src,function(item, index, arrself) {
			var reto={};
			objEach(item,function(key, value, objself) {
				for(var i=0;i<fs.length;i++){
					if(key==fs[i]){
						reto[key]=value;
					}
				}
			});
			reta.push(reto);
		});
		return reta;
	}

	,fetchData:function(idValueHas,modGrid,notCheckEdit,callback,strid,strvars,strstore,strcols){
		var datamg=[],storemg=modGrid[strvars?strvars:'varShare'][strstore?strstore:'storeDefault'];
		storemg.each(function(rec){
			var reto={errors:0,preventDefault:false},daobj;
			if(!notCheckEdit){
				objEach(modGrid[strvars?strvars:'varShare'][strcols?strcols:'gridColumns'], function(key, value, myself) {
					if(callback){
						callback(rec, key, value, reto);
						if(reto.preventDefault)return;
					}
					if(value.initialConfig && value.initialConfig.editor && value.initialConfig.editor.allowBlank===false){
						var v=rec.get(key);
						if((v===0)||(v && (''+v).length>0))return;
						reto.errors++;
					}
				});
			}
			if(reto.errors==0){
				daobj=oclone(rec.data);
				if(!idValueHas){
					daobj[strid?strid:'id']=null;
				}else{
					if(daobj[strid?strid:'id']<0)daobj[strid?strid:'id']=null;
				}
				datamg.push(daobj);
			}
		});
		return datamg.length>0?datamg:null;
	}

	,getActionCodes:function(actionCodesCsv){
		var ret=ExtApp.ajax('./security/operations/'+actionCodesCsv.join(','));
		return ret && ret.hasError ? null : ret;
	}

	,getOnlyOneSelectId:function(selModelForGrid,configForStore,retobj){
		try{
			var selected = selModelForGrid.getSelection();
			if (selected.length != 1) {
				ExtApp.nfobox("请选择且只能选择一条数据",3000);
				return false;
			}
			return retobj ? selected : selected[0].data[ configForStore.idProperty ]
		}catch(e){
			return false
		}
	}

	,rankColumns:function(columnsForGrid,definedColRank){
		var modelColRank='App.model.DataGridRankItemForColumn'
			,modelManager=ExtApp.getModelManager()
		;
		if(!modelManager.isRegistered(modelColRank)){
			Ext.define(modelColRank, {
			    extend: 'Ext.data.Model',
			    fields: ['rank','item']
			});
		};
		var 
		initRankData=function(columnsForGrid,definedColRank){
			var retData=[];
			arrEach(columnsForGrid, function(item, index, myself) {
				var rank=(item.dataIndex && definedColRank[item.dataIndex])||index;
				rank='0000'+rank;rank=rank.substr(rank.length-4,4);
				retData.push({rank:rank,item:item});
			});
			return retData;
		}
		,storeColRankRaw={
			model:modelColRank
			,data:initRankData(columnsForGrid,definedColRank)
		}
		,storeColRank=Ext.create('Ext.data.Store',storeColRankRaw)
		,arrayColRank=[]
		;
		storeColRank.sort('rank');
		storeColRank.each(function(rec){
			arrayColRank.push(rec.get('item'));
		});
		return arrayColRank;
	}


}//eof:grid

})/*eof:define*/
}(this,this.Ext||{});/*eof:function*/