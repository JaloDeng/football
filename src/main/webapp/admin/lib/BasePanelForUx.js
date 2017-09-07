!function(def,classFn){
	def('App.lib.BasePanelForUx',classFn());
}(Ext.define,
function(){
	return {extend:'Ext.panel.Panel',mixins:['App.lib.BaseMixinForUx']};
}
);
