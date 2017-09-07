!function(def,classFn){
	def('App.lib.BaseMixinForUx',classFn());
}(Ext.define,
function(){
	var api={ON:'listeners',U1:'component',U2:'container',U3:'panel'};
	var ON=api.ON;
	var utl=api.Utl={};
	var fora=V.FORA;

	utl.pushItems=function(target,items){
		fora(items,function(pm){
			target.push(pm.v)
		});
	};

	var xitem=utl.dimItem=function(xtype,config,owner){
		var ret={};
		if(xtype===1||xtype===2||xtype===3)ret.xtype=api['U'+ret.xtype];
		if(xtype&&xtype.indexOf)ret.xtype=xtype.indexOf('.')<0?xtype:xtype.replace(/\./g,'').toLowerCase();
		if(config.ON){config[ON]=Ext.Object.merge(config[ON]||{},config.ON);delete config.ON;};
		if(owner)ret.uxOwner=owner;
		return Ext.apply(ret,config);
	};

	var dimHeadBtn=utl.dimHeadBtn=function(opts,conf){
		var def=xitem('button',{border:false,style:'padding:0'});
		if(typeof opts=='string' && opts==' '){
			opts=xitem('',{text:'&#160;',disabled:true,ON:{boxready:function(bn){bn.el.setOpacity(0)}}});
		}else if(typeof opts=='string' && opts=='x' && conf ){
			opts={iconCls:'x-fa fa-close',text:'\u5173\u95ed'};
			Ext.apply(opts,conf);
		}
		Ext.apply(def,opts);
		return def;
	}

	var dimWnConf=utl.dimWnConf=function(opts){
		var onEventCall = opts.onEventCall || {}, def = xitem('',{
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
			,ON:{
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
			})
			,headers=def.header.items
			,initHeadItems=opts.initHeadItems || []
			,i,len=initHeadItems.length
		;
		headers.push(dimHeadBtn(' '));
		for(i=0;i<len;i++){
			headers.push(opts.initHeadItems[i]);
		}
		headers.push(dimHeadBtn('x',{uxEventClose:onEventCall.onClose,
			handler:function(btn){var wn=btn.up('window'),onClose=btn.uxEventClose;if(!(onClose && onClose(wn,btn)===false))wn.close()}
		}));
		delete opts.onEventCall;delete opts.initHeadItems;
		Ext.apply(def,opts);
		return def;
	}

	var dimUxConf=utl.dimUxConf=function(options){
		var opt=options||{}
		,owner=opt.owner
		,isWindow=opt.isWindow
		,isComboVld=opt.isComboVld
		,headButtons=opt.headButtons
		,uxDontClose=opt.uxDontClose
		,windowTitle=opt.windowTitle
		,onLoadMe=opt.onLoad
		,onUnloadMe=opt.onUnload
		,onCloseMe=opt.onClose
		,config;
		if(isWindow){
			config=dimWnConf({title:windowTitle
				,onEventCall:{
					onClose:onCloseMe
					,onLoad:onLoadMe
					,onUnload:onUnloadMe
					,onShow:opt.onShow
					,onHide:opt.onHide
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
			config=xitem('',{
				layout:'card',border:false,
				dockedItems:[],
				ON:{
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
			});
			if(!uxDontClose)headButtons.push(dimHeadBtn('x',{uxOwner:owner,uxEventClose:onCloseMe,
				handler:function(btn){if(btn.uxEventClose&&btn.uxEventClose(btn.uxOwner,btn)!==false)btn.uxOwner.close()}
			}));
			fora(headButtons,function(pm){
				delete pm.v.style
			});
			if(headButtons.length>0){
				config.dockedItems.push( xitem('toolbar',{itemId:'headButtons',dock:'top',ui:'footer',enableOverflow:true,items:(headButtons.unshift('->'),headButtons)}) );
			}
			if(isComboVld){
				config[ON].show=function(that){
					if(that.uxComboCreating){
						delete that.uxComboCreating;
					}
					that.uxOpenerCombo && that.uxOpenerCombo.setLoading(false);
				}
			}
		}
		if(uxDontClose)config[ON].beforedestroy=function( that, eOpts ){
			if(!that.tab){
				var unload=that.uxEventUnload;
				return unload && unload(that)
			}
		}
		return config
	}


	return api;
}
);
