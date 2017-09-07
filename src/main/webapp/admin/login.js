(function(window){
	var ExtApp=window.ExtApp=window.ExtApp||{}
	,ldcFn=Ext.Loader.setConfig,DC='disableCaching'
	,lcf={enabled:true},appConf=ExtApp.applicationConfig={
		name : 'App',
		launch: function() {
			var createViewport=function(){
				Ext.create('Ext.container.Viewport', {
					layout:'border'
					,items: [
						{xtype:'container',region:'north',layout:{type:'hbox',align:'middle'},defaults:{xtype:'box'}
						,height:50,style:'background-color:#059;color:#fff'
						,items:[{
								html :ExtApp.APP_CAPTION,
								style:"color:#FFF;margin-left:8px;font:700 20px/20px 'Microsoft YaHei',Arial"
							}
						]}

						,{xtype:'tabpanel',region:'center',items:[
							{xtype:'panel',title:'\u6b22\u8fce',layout:{type:'vbox',align:'center'}
								,dockedItems:[
									{xtype:'toolbar',dock:'top',items:['\u6b22\u8fce\u4f7f\u7528\u300a'+ExtApp.APP_CAPTION+'\u300b\uff01']}
								]
							,items:[{xtype:'box',flex:1,html:'\u8bf7\u60a8\u5148\u767b\u5f55'}
									,{xtype:'button',width:'30%',style:'margin:5px',flex:2,text:'\u5e10\u53f7\u5bc6\u7801\u767b\u5f55'
										,handler:function(){
											var w=Ext.create('Ext.window.Window',ExtApp.duxLoginByNameAndPassword);
											w.center().show();
										}
									}
									,{xtype:'button',width:'30%',style:'margin:5px',flex:2,text:'\u626b\u4e8c\u7ef4\u7801\u767b\u5f55',disabled:true}
									,{xtype:'button',width:'30%',style:'margin:5px',flex:2,text:'\u5237\u667a\u80fd\u5361\u767b\u5f55',disabled:true}
									,{xtype:'button',width:'30%',style:'margin:5px',flex:2,text:'\u6307\u7eb9\u8bc6\u522b\u767b\u5f55',disabled:true}
									,{xtype:'box',flex:4,html:'&#160;'}
								]
								
								}
							]}
						,{xtype:'toolbar',region:'south',ui:'footer',enableOverflow:true,items:['->','\u7248\u6743\u6240\u6709 &#169; ___2016___ XingLianFs']
								,listeners:{afterlayout:function(cmp){
										var cl=cmp.child(':last');
										if(!cl.uxReadyLayout){
											cl.uxReadyLayout=true;
											var	el=cl && cl.el,dd=ExtApp['serverDate']||new Date(),dy=(dd.getFullYear&&dd.getFullYear());
											el && el.setHTML(el.getHTML().replace(/_+2016_+/,['2016',(isNaN(dy)?'2017':dy)].join('-') ));
										}
									}}
							}
					]
					,listeners:{boxready:function(vp){
							var p=vp.items.get(1);
							p.setLoading(true);
							Ext.Loader.loadScript({
								url:'./view/login-username-password.js'
								,onLoad:function(){
									var w=Ext.create('Ext.window.Window',ExtApp.duxLoginByNameAndPassword);
									w.center().show();
									p.setLoading(false);
								}
							});
						}
					}
				});
			};
			
			createViewport()
			
			
			
		}
	},aFn=Ext.application
	;
	if(!ExtApp.DEBUG_MODE){
		lcf[DC]=false;
		ldcFn(lcf);
		aFn(appConf);
		delete lcf.enabled;lcf[DC]=true;
		ldcFn(lcf);
	}else{
		ldcFn(lcf);
		aFn(appConf);
	}
})(this);