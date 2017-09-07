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
			dockedItems: [
				{
					xtype: 'toolbar', 
					dock: 'bottom', 
					items: [
						{xtype: 'button', text: '＜＜', handler: function(){
							if (ioParam.page > 1) {
								ioParam.page = 1;
								ExtApp.ajax('../club?page='+ioParam.page+'&size='+ioParam.size,null,'GET',function(args){
									var da=Ext.decode(args[2].responseText,true);
									ExtApp.storeBy('club',null,da.items);
									me.down('#currentPage').setValue(ioParam.page);
								});
							}
						}}
						,{xtype: 'button', text: '＜', handler: function(){
							if (ioParam.page > 1) {
								ioParam.page = ioParam.page - 1;
								ExtApp.ajax('../club?page='+ioParam.page+'&size='+ioParam.size,null,'GET',function(args){
									var da=Ext.decode(args[2].responseText,true);
									ExtApp.storeBy('club',null,da.items);
									me.down('#currentPage').setValue(ioParam.page);
								});
							}
						}}
						,{xtype: 'numberfield', itemId: 'currentPage'}
						,{xtype: 'button', text: '＞', handler: function(){
							if (ioParam.page < ioParam.totalPage){
								ioParam.page = ioParam.page + 1;
								ExtApp.ajax('../club?page='+ioParam.page+'&size='+ioParam.size,null,'GET',function(args){
									var da=Ext.decode(args[2].responseText,true);
									ExtApp.storeBy('club',null,da.items);
									me.down('#currentPage').setValue(ioParam.page);
								});
							}
						}}
						,{xtype: 'button', text: '＞＞', handler: function(){
							if (ioParam.page < ioParam.totalPage){
								ioParam.page = ioParam.totalPage;
								ExtApp.ajax('../club?page='+ioParam.page+'&size='+ioParam.size,null,'GET',function(args){
									var da=Ext.decode(args[2].responseText,true);
									ExtApp.storeBy('club',null,da.items);
									me.down('#currentPage').setValue(ioParam.page);
								});
							}
						}}
						,{xtype: 'button', itemId: 'totalPage'}
					]
				}
			],
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
		ioParam.page = 1;
		ioParam.size = 1;
		ExtApp.ajax('../club?page='+ioParam.page+'&size='+ioParam.size,null,'GET',function(args){
			var da=Ext.decode(args[2].responseText,true);
			ExtApp.storeBy('club',null,da.items);
			//总页数
			ioParam.totalPage = V.CINT(da.total / ioParam.size,1) + ((da.total % ioParam.size)===0?0:1);
			that.down('#currentPage').setValue(ioParam.page);
			that.down('#totalPage').setText('共' + ioParam.totalPage + '页');
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
