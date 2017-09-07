/**
 * asset/config.js 在此文件存放公共参数
 */
(function(window,undefined){
	var ExtApp=window.ExtApp=window.ExtApp||{}
	;

	//请修改为具体项目文件夹必需带末尾斜杠
	ExtApp['APP_HTTP_PREFIX']='/fsqtsc/';

	//请修改为具体项目显示标题
	ExtApp['APP_CAPTION']='佛山质安培训业务管理系统';

	//具体项目采用不同的验证码参数；--&noise=red
	ExtApp['CAPTCHA_IMAGE_URL']=ExtApp['APP_HTTP_PREFIX']+'./security/captcha?width=200&height=50&producer=number&length=5';
	ExtApp['CAPTCHA_IMAGE_WI']=200;
	ExtApp['CAPTCHA_IMAGE_HI']=50;

	ExtApp['REL_ROOT_PATH']='../';

//	ExtApp.DEBUG_MODE=true;
//	ExtApp.DEBUG_MODE=ExtApp.DEBUG_MODE && (/^((localhost|127\.0\.0\.1|\[::1\])(:\d+)?)$/i.test(location.host));
	
	ExtApp.DEBUG_MODE=false;

	//在extjs加载完成前显示效果的js文件；--将0改为1启用
	ExtApp['NILFX']=!1?'':ExtApp['REL_ROOT_PATH']+'asset/loading.js';

})(this);
