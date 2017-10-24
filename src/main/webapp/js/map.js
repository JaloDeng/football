var input = document.getElementById('input');
var lnglat = document.getElementById('lnglat');

//定义地图
var map = new AMap.Map('container',{
    resizeEnable: true,
    zoom: 11,
    keyboardEnable: false
});

//添加插件
map.plugin(['AMap.Autocomplete', 'AMap.Geocoder', 'AMap.Geolocation', 'AMap.PlaceSearch', 'AMap.ToolBar'], function() {
    //获取浏览器当前位置
	geolocation = new AMap.Geolocation({
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });
    map.addControl(geolocation);
    geolocation.getCurrentPosition();

    // 定义标记
    var marker = new AMap.Marker({
        map:map,
        bubble:true
    });

	//搜索功能
    var placeSearch = new AMap.PlaceSearch({
			map: map
        });
 	//输入提示
	var autoOptions = {
	        input: 'input'//使用联想输入的input的id
        };
	var autocomplete= new AMap.Autocomplete(autoOptions);
    AMap.event.addListener(autocomplete, "select", function(e){
            //TODO 针对选中的poi实现自己的功能
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);
		});
    //添加点击搜索结果的标记
    AMap.event.addListener(placeSearch, "markerClick", function(e){
    		if (e && e.data) {
    			input.value = e.data.address;
    			lnglat.innerHTML = '经度 : ' + e.data.location.lng + ' 纬度 : ' + e.data.location.lat;
    		}
    	});
    var geocoder = new AMap.Geocoder({
        });
	//点击地图触发事件
	map.on('click',function(e){
            marker.setPosition(e.lnglat);
            geocoder.getAddress(e.lnglat,function(status,result){
              if(status=='complete'){
            	 input.value = result.regeocode.formattedAddress;
                 var lngLat = marker.getPosition().toString().split(",");
                 lnglat.innerHTML = '经度 : ' + lngLat[0] + ' 纬度 : ' + lngLat[1];
              }else{
            	 lnglat.innerHTML = '无法获取地址';
              }
            });
        });
    
	//添加缩放比例尺
    map.addControl(new AMap.ToolBar());
});