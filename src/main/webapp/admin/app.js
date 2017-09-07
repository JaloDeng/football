(function(window){
	var ExtApp=window.ExtApp=window.ExtApp||{}
	,ldcFn=Ext.Loader.setConfig,DC='disableCaching'
	,lcf={enabled:true},appConf=ExtApp.applicationConfig={
		name : 'App',
		appFolder : '.',
		autoCreateViewport: true
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