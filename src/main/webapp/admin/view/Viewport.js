!function(window,initCmpFn,dimUxcExpandFn,undefined){
	var ExtApp=window.ExtApp=window.ExtApp||{}
	,ldcFn=Ext.Loader.setConfig,DC='disableCaching';

	V.CSS('.x-mask-msg-text{padding:0 0 0 12px;font:400 12px/12px Arial;background-position:center left}','Ext_x_mask_msg_text_for_loading_gif');
	ExtApp.EMPTY_MASKED='&#160;';

	ExtApp.util={};
	ExtApp.util['lang.success']='\u6210\u529f';
	ExtApp.util['lang.failure']='\u5931\u8d25';
	ExtApp.util['lang.msgTitle']='\u6e29\u99a8\u63d0\u793a';
	ExtApp.util['lang.loading']='\u88dd\u8f09\u4e2d...';
	ExtApp.util['lang.waitTitle']='\u8bf7\u60a8\u7a0d\u7b49';
	ExtApp.util['lang.waitMsg']='\u6b63\u5728\u63d0\u4ea4\u6570\u636e...';
	ExtApp.util['lang.notAllow']='\u5f88\u62b1\u6b49\uff0c\u60a8\u6ca1\u6709\u6743\u9650\u8fdb\u884c\u8be5\u64cd\u4f5c\u3002';
	ExtApp.util['lang.errorLoadJs']='\u52a0\u8f7d\u4e0d\u5230\u8d44\u6e90\u6216\u5176\u5185\u90e8\u6709\u9519\u8bef';
	ExtApp.util['html.notNull']='<span style="color:red;position:relative;top:2px;">*</span>';

	ExtApp.pool={};

	ExtApp.loadNs=function(action,config,needWait,noAlert){
		var the,ldc={},msg=noAlert?'':ExtApp.util['lang.errorLoadJs'];
		if(!ExtApp.DEBUG_MODE){
			ldc[DC]=false;ldcFn(ldc);
			try{
				if(needWait)Ext.syncRequire(action);
				the=Ext.create(action,config);
			}catch(E){
				the=false;
				if(msg)ExtApp.nfobox(msg,3e3,{icon:4});
			}
			ldc[DC]=true;ldcFn(ldc);
		}
		else{
			if(needWait)Ext.syncRequire(action);
			the=Ext.create(action,config);
		}
		return the;
	};

	ExtApp.pull=ExtApp.loadNs;

	ExtApp.loadUm=function(actions){
		var ldc={};
		if(!ExtApp.DEBUG_MODE){
			ldc[DC]=false;ldcFn(ldc);
			try{
				Ext.require(actions);
			}catch(E){}
			ldc[DC]=true;ldcFn(ldc);
		}
		else{
			Ext.require(actions);
		}
	};

	ExtApp.splitInc=function(src,dms){src=src.split(dms||':');if(src.length>2){src.shift();src.pop();}return src};

	//ExtApp.dimUxp({ns:'App.view.DemoYaUxp',as:'appviewdemoyauxp',inc:['App.lib.CommonsForUx'],fn:initCmpFn});
	ExtApp.dimUxp=function(args,callback){
		args.as=args.as||args.ns.replace(/\./g,'').toLowerCase();
		var ret={
			extend:args.w?'App.lib.BaseWindowForUx':'App.lib.BasePanelForUx'
			,requires:args.inc||[]
			,alias:['widget',args.as].join('.')
			,uxDimArgs:args
			,initComponent: function() {
				var me = this;
				Ext.apply(me,me.uxDimArgs.fn(me));
				me.callParent();
			}
		};
		ret.uxDimArgs.incs=':'+ret.requires.join(':')+':';
		ret.uxGetInc=function(){return ExtApp.splitInc(this.uxDimArgs.incs)};
		if(args.mix)ret.mixins=args.mix;
		if(callback)callback(ret);
		Ext.define(args.ns,ret);
	};

	//ExtApp.dimUxc({ns:'App.view.DemoYcUxc',as:'appviewdemoycuxc',panel:{ns:'App.view.DemoYaUxp'});
	ExtApp.dimUxc=function(args,callback){
		args.as=args.as||args.ns.replace(/\./g,'').toLowerCase();
		var ret={
			extend:'Ext.form.field.Picker'
			,requires:args.inc||[args.panel.ns]
			,alias:['widget',args.as].join('.')
			,uxDimArgs:args
			,expand:dimUxcExpandFn
			,createPicker:function(){
				var me=this,uxargs=me.uxDimArgs
					,cPanel={floating:true,uxDontClose:true,uxOpenerCombo:me,uxComboCreating:true}
				;
				Ext.apply(cPanel,me.uxPanelConfig||{});
				return ExtApp.loadNs(uxargs.panel.ns,cPanel,true);
			}
		};
		ret.uxDimArgs.incs=':'+ret.requires.join(':')+':';
		ret.uxGetInc=function(){return ExtApp.splitInc(this.uxDimArgs.incs)};
		if(args.mix)ret.mixins=args.mix;
		if(callback)callback(ret);
		Ext.define(args.ns,ret);
	};

	ExtApp.defineUx={
		both:function(pn,cn,initCmpFn,comboCbFn){
			cn=cn||(pn.substr(0,pn.length-1)+'c');
			ExtApp.dimUxp({ns:pn,fn:initCmpFn});
			ExtApp.dimUxc({ns:cn,panel:{ns:pn}},comboCbFn);
		}
		,panel:ExtApp.dimUxp
		,combo:ExtApp.dimUxc
	};


	ExtApp.clone=function(src){
		return Ext.Object.merge({},src);
	};

	ExtApp.getModelMgr=function(name){
		return Ext.ModelManager
	};

	ExtApp.nfobox=function(content,timeout,config){

		var nfohold={closed:false},opts=config||{};

		Ext.MessageBox.show({
			title: !(opts.title===undefined) ? opts.title : ExtApp.util['lang.msgTitle'] 
			,msg: content
			,buttons: Ext.MessageBox.OK
			,icon: !(opts.icon===undefined)&&opts.icon!=1 ? opts.icon==2 ? Ext.MessageBox.WARNING : opts.icon==3 ? Ext.MessageBox.QUESTION : opts.icon==4 ? Ext.MessageBox.ERROR : '' : Ext.MessageBox.INFO
			,fn: function(btn) {
				if (btn === 'ok') {
					if(typeof(opts.fn)=="function")opts.fn();
					nfohold.closed=true;
				}
			}
		});

		if(timeout){
			nfohold.timer = Ext.defer(function(){
				nfohold.timer = null;
				if(!nfohold.closed){Ext.MessageBox.hide();nfohold.closed=true;}
			}, timeout);
		}

	};

	ExtApp.errbox=function(content,config){
		config=config||{alwaysOnTop:true};
		Ext.create('Ext.window.MessageBox', {
			alwaysOnTop:!!config.alwaysOnTop
		}).show({
			title: config.title||ExtApp.util['lang.failure'],
			message: content,
			buttons: config.buttons||Ext.Msg.OK,
			icon: config.icon||Ext.Msg.ERROR
		});
	};

	ExtApp.storeBy=function(storeId,initConf,rawData,isTree){
		var myStore=Ext.data.StoreManager.get(storeId)
			,conf={storeId:storeId}
		;
		if(!myStore){
			if(initConf){
				Ext.apply(conf,initConf);
				conf.uxInitConfig=initConf;
			};
			myStore=Ext.create(isTree?'Ext.data.TreeStore':'Ext.data.Store',conf);
		}
		if(rawData){
			myStore.uxRawData=rawData;
			if(isTree){
				myStore.setRootNode(rawData);
			}else{
				myStore.loadData(rawData);
			}
		}
		return myStore;
	};

	ExtApp.ajax=function(url,jsonData,method,notWaitFn,caching,paramx){
		url=(url&&url.join)?url.join(''):url;
		var ret,rqo,opts={
			url:url,
			method:(jsonData?method||'POST':method||'GET'),
			async:(notWaitFn?true:false),
			disableCaching:!caching,
			callback:function(options, success, response){
				if(ExtApp.checkUserLogout && ExtApp.checkUserLogout(response.responseText))return;
				if(notWaitFn && notWaitFn(arguments)===false)return;
				ret=Ext.decode(response.responseText,true);
				ret=ret || {success:false,context:arguments};
			}
		};
		if(jsonData)opts.jsonData=jsonData;
		if(paramx)Ext.apply(opts,paramx);
		rqo=Ext.Ajax.request(opts);
		return !notWaitFn?ret:rqo;
	};

	ExtApp.bindTip=function(target,text){Ext.tip.QuickTipManager.register({target:target,text:text});};


	Ext.define('App.view.Viewport',initCmpFn());

	ExtApp.loadUm(['App.lib.BaseMixinForUx','App.lib.BasePanelForUx','App.lib.BaseWindowForUx']);

}(this,

/*initCmpFn*/
function(){

return{
	extend: 'Ext.container.Viewport',
	id:'AppViewportFramework',
	initComponent:function(){
		var me=this
		,initConfig={layout:'border'}
		,panelHead={xtype:'container',id:'AppViewportPanelHead',region:'north',layout:{type:'hbox',align:'middle'},defaults:{xtype:'box'}
			,height:50,style:'background-color:#059;color:#fff'
			,items:[{
					html :ExtApp.APP_CAPTION,
					style:"color:#FFF;margin-left:8px;font:700 20px/20px 'Microsoft YaHei',Arial"
				},{flex:1},{xtype:'button',text:'&#12297;&#160;\u8bf7\u60a8\u767b\u5f55',style:'margin-right:8px',menu:[{text:'\u6ce8\u518c'
							,handler:function(){
								ExtApp.uxOpenToTab({data:{action:'App.view.football.DemoYaUxp',leaf:true,text:'\u7ba1\u7406'}})
							}

						}]}
					]}
		,panelSide={xtype:'treepanel',id:'AppViewportPanelSide',region:'west',title:'\u83dc\u5355',split:true,collapsible:true,width:220,useArrows:true,animate:false}
		,panelBody={xtype:'tabpanel',id:'AppViewportPanelBody',region:'center',items:[
			{xtype:'panel',itemId:'AppViewportPanelBodyWelcome',title:'\u6b22\u8fce',dockedItems:[
				{dock:'top',xtype:'toolbar',items:[
					' - \u6b22\u8fce\u4f7f\u7528 - '
					,{xtype:'button',text:'Welcome!',handler:function(){
							ExtApp.uxOpenWindow('App.view.football.DemoYaUxw',this.uxOwner,{title:'\u6b22\u8fce111'});
							}
						,listeners:{boxready:function(bn){bn.uxOwner=Ext.getCmp('AppViewportPanelBody').down('#AppViewportPanelBodyWelcome')}}
						}
				]}
			]}
		]}
		,panelFoot={xtype:'toolbar',id:'AppViewportPanelFoot',region:'south',ui:'footer',enableOverflow:true,items:['->','\u7248\u6743\u6240\u6709 &#169; ___2016___ XingLianFs']
				,listeners:{afterlayout:function(cmp){
						var cl=cmp.child(':last');
						if(!cl.uxReadyLayout){
							cl.uxReadyLayout=true;
							var	el=cl && cl.el,dd=ExtApp['serverDate']||new Date(),dy=(dd.getFullYear&&dd.getFullYear());
							el && el.setHTML(el.getHTML().replace(/_+2016_+/,['2016',(isNaN(dy)?'2017':dy)].join('-') ));
						}
					}}
			}
		;
		panelSide.rootVisible=false;

		panelSide.uxOpenWindow=function(ns,own,args){
			own.setLoading(true);
			setTimeout(function(){
				var ct=ExtApp.pull(ns,Ext.apply({uxOpenerPanel:own},args||{}));
				if(!ct)return;
				ct.on('show',function(w){
					var vp=Ext.getCmp('AppViewportFramework')
						,vh=vp.getHeight(),vw=vp.getWidth();
					if(w.getHeight()>vh||w.getWidth()>vw){
						w.setPosition(0,0);
						w.setSize(vw,vh);
						w.maximize();
					}
					w.uxOpenerPanel.setLoading(false);
				});
				ct.show();
			},0);
		};

		panelSide.uxOpenToTab=function(record){
			var action=record.data.action;
			if(action&&record.data.leaf){
				var mainTab=Ext.getCmp('AppViewportPanelBody')
					,tabId='AVPTAB_'+action.replace(/\./g,'_')
					,tabCont=Ext.ComponentManager.get(tabId)
				;
				mainTab.setLoading(true);
				setTimeout(function(){
					if(!tabCont){
						tabCont=ExtApp.pull(action,{
							id:tabId
							,title:record.data.text
							,ioParam:{openerMenuData:record.data}
							,uxMainTab:mainTab
							,closable:true
						});
						if(!tabCont){
							mainTab.setLoading(false);
							return;
						}
					}
					if(!mainTab.contains(tabCont)){
						mainTab.add(tabCont);
					}
					mainTab.setActiveTab(tabId);
					mainTab.setLoading(false);
				},0)
			};
		};
		
		panelSide.store=ExtApp.storeBy('AppViewportPanelSide$TreeStore',{
				fields: ['text', 'modified', 'size', 'permissions', 'action']
			},null,true);
		panelSide.listeners={afterlayout:function(cmp){
				if(!cmp.uxReadyLayout){
					cmp.uxReadyLayout=true;
					ExtApp.uxOpenWindow=cmp.uxOpenWindow;
					ExtApp.uxOpenToTab=cmp.uxOpenToTab;
					cmp.getView().setLoading(true);
					var st=cmp.getStore();
					st.uxOwner=cmp;
					st.on('fillcomplete',function(){st.uxOwner.getView().setLoading(false)});

					ExtApp.ajax('./app-data/menu-tree-data.js',null,'GET',function(args){
						var da=Ext.decode(args[2].responseText,true);
						ExtApp.storeBy('AppViewportPanelSide$TreeStore',null,da.root,true);
					});
				}
			}
			,itemclick: function(el, record) {
				console.log(record);
				ExtApp.uxOpenToTab(record);
			}
		};
		
		initConfig.items=[panelHead,panelSide,panelBody,panelFoot];
		
		Ext.apply(me, initConfig);
		me.callParent();
	}
}
}/*eof:initCmpFn*/

,function(){
	var fnSz=((new Ext.form.field.Picker).expand.toString()),myCt=this;
	myCt.setLoading(true);
	setTimeout(function(){eval('('+fnSz.replace(/this/,'myCt')+')()')},0);
}

);
