!function(def,classFn){
	def('App.lib.BaseWindowForUx',classFn());
}(Ext.define,
function(){
	return {extend:'Ext.window.Window',mixins:['App.lib.BaseMixinForUx']};
}
);
