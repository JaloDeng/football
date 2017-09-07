!function(window){
	var ExtApp=window.ExtApp=window.ExtApp||{}
	,addTipText=function(target,text){
		Ext.tip.QuickTipManager.register({
			target:target,text:text
		});
	}
	,captchaImageUrl=ExtApp['CAPTCHA_IMAGE_URL']+'&_='
	,captchaTip='\u8bf7\u70b9\u51fb\u6216\u6309\u952e\u76d8F2\u66f4\u65b0\u9a8c\u8bc1\u7801\u56fe\u7247'
	,fnBtnLoginClick=function(btn){
		var wn=btn.up('window');
		var un=wn.down('#username');
		var pw=wn.down('#password');
		var cp=wn.down('#captcha');
		if(un.validate()&&pw.validate()&&cp.validate()){
			un=un.getValue();
			cp=cp.getValue();
			pw=CY.Utf8( pw.getValue() ).toString();
			if(CY.Utf8("123456")=="ecddea4a449f93b5e555f0ac44e6b87ec8ab4ed3"){

				var opts={
					url: './login',
					method:'POST',
					params:{username:un,password:pw,captcha:cp},
					callback:function( options , success, response){
						console.log(arguments);
					}
				};
				Ext.Ajax.request(opts);


			}
		}
	}
	,fnBtnResetClick=function(btn){
		var wn=btn.up('window');
		wn.down('#username').setValue('').focus();
		wn.down('#password').setValue('');
		wn.down('#captcha').setValue('');
	}
	,fnInpKeyUp=function( el, e, eOpts ){
		var wn=el.up('window');
		if(e.getKey()==e.ENTER){
			fnBtnLoginClick(wn.down('#btnSubmit'))
		}
	}
	;
	ExtApp.duxLoginByNameAndPassword={
		title:'\u5e10\u53f7\u5bc6\u7801\u767b\u5f55 - '+ExtApp.APP_CAPTION
		,layout:'border',height:240+(ExtApp['CAPTCHA_IMAGE_HI']||30),width:460,minWidth:300,minHeight:130
		,constrain:true
		,modal:true
		,items:[
		{xtype:'panel',bodyStyle:'padding:5px',region:'south',layout:{type:'hbox',align:'stretch'},height:40,items:[
			{xtype:'button',itemId:'btnSubmit',flex:4,text:'\u767b\u5f55',handler:fnBtnLoginClick}
			,{xtype:'button',text:'&#160;',disabled:true,listeners:{boxready:function(bn){bn.el.setOpacity(0)}}}
		,{xtype:'button',flex:2,text:'\u91cd\u7f6e',handler:fnBtnResetClick}
			,{xtype:'button',text:'&#160;',disabled:true,listeners:{boxready:function(bn){bn.el.setOpacity(0)}}}
			,{xtype:'button',flex:2,text:'\u5173\u95ed',handler:function(b){b.up('window').close()}}
			]}
		,{xtype:'panel',bodyStyle:'padding:15px',region:'center',layout:{type:'vbox',align:'stretch'},autoScroll:true
			,defaults:{allowBlank:false,labelAlign:'right',labelWidth:80}
			,items:[
				{xtype:'textfield',itemId:'username',fieldLabel:'\u767b\u5f55\u5e10\u53f7'
		,enableKeyEvents:true,listeners:{keyup:fnInpKeyUp}
				}
				,{xtype:'textfield',itemId:'password',fieldLabel:'\u767b\u5f55\u5bc6\u7801'
					,inputType:'password'
					,enableKeyEvents:true,listeners:{keyup:fnInpKeyUp}
				}
				,{xtype:'textfield',itemId:'captcha',fieldLabel:'\u9a8c\u8bc1\u7801'
					,enableKeyEvents:true,listeners:{keyup:fnInpKeyUp}
				}


				,{xtype:'container',layout:'fit',style:'padding-left:85px;padding-bottom:10px',items:[
					,{xtype:'image',width:ExtApp['CAPTCHA_IMAGE_WI']||80,height:ExtApp['CAPTCHA_IMAGE_HI']||30,maxWidth:ExtApp['CAPTCHA_IMAGE_WI']||80,src:''
						,autoEl: {
							tag:'img',onclick:"this.src='"+captchaImageUrl+"'+(+new Date)",alt:captchaTip
						}
						,listeners: {
							boxready: function(_this) {
								_this.el.dom.src=captchaImageUrl+(+new Date);
							}
						}
					}]
				}


				,{xtype:'radiogroup',fieldLabel:'\u81ea\u52a8\u767b\u5f55',items:[
			{ boxLabel: '\u8bb0\u4f4f\u5bc6\u7801', name: 'rb', inputValue: '1',listeners:{boxready:function(r){addTipText(r.id,'\u8fd8\u9700\u8981\u6bcf\u6b21\u8f93\u5165\u9a8c\u8bc1\u7801\u767b\u5f55')}} }
			,{boxLabel: '\u4fdd\u6301\u767b\u5f55', name: 'rb', inputValue: '2',listeners:{boxready:function(r){addTipText(r.id,'\u671f\u9650\u4e3a\u4e00\u4e2a\u6708')} }}
			,{boxLabel: '\u624b\u52a8\u767b\u5f55', name: 'rb', inputValue: '0',checked: true}


				]}
			]}
		]
		,listeners:{
			show:function(cmp){
				cmp.down('#username').focus();
			}
		}
	};
}(this);var CY=CY||function(t,r){{var n={},e=n.lib={},i=e.Base=function(){function t(){}return{extend:function(r){t.prototype=this;var n=new t;return r&&n.mixIn(r),n.$super=this,n},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var r in t)t.hasOwnProperty(r)&&(this[r]=t[r]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.$super.extend(this)}}}(),s=e.WordArray=i.extend({init:function(t,n){t=this.words=t||[],this.sigBytes=n!=r?n:4*t.length},toString:function(t){return(t||o).stringify(this)},concat:function(t){var r=this.words,n=t.words,e=this.sigBytes,i=t.sigBytes;if(this.clamp(),e%4)for(var s=0;i>s;s++){var a=n[s>>>2]>>>24-s%4*8&255;r[e+s>>>2]|=a<<24-(e+s)%4*8}else if(n.length>65535)for(var s=0;i>s;s+=4)r[e+s>>>2]=n[s>>>2];else r.push.apply(r,n);return this.sigBytes+=i,this},clamp:function(){var r=this.words,n=this.sigBytes;r[n>>>2]&=4294967295<<32-n%4*8,r.length=t.ceil(n/4)},clone:function(){var t=i.clone.call(this);return t.words=this.words.slice(0),t},random:function(r){for(var n=[],e=0;r>e;e+=4)n.push(4294967296*t.random()|0);return s.create(n,r)}}),a=n.enc={},o=a.Hex={stringify:function(t){for(var r=t.words,n=t.sigBytes,e=[],i=0;n>i;i++){var s=r[i>>>2]>>>24-i%4*8&255;e.push((s>>>4).toString(16)),e.push((15&s).toString(16))}return e.join("")},parse:function(t){for(var r=t.length,n=[],e=0;r>e;e+=2)n[e>>>3]|=parseInt(t.substr(e,2),16)<<24-e%8*4;return s.create(n,r/2)}},c=a.Latin1={stringify:function(t){for(var r=t.words,n=t.sigBytes,e=[],i=0;n>i;i++){var s=r[i>>>2]>>>24-i%4*8&255;e.push(String.fromCharCode(s))}return e.join("")},parse:function(t){for(var r=t.length,n=[],e=0;r>e;e++)n[e>>>2]|=(255&t.charCodeAt(e))<<24-e%4*8;return s.create(n,r)}},h=a.Utf8={stringify:function(t){try{return decodeURIComponent(escape(c.stringify(t)))}catch(r){throw new Error("badUtf8")}},parse:function(t){return c.parse(unescape(encodeURIComponent(t)))}},f=e.bbAlgo=i.extend({reset:function(){this._data=s.create(),this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=h.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_parse:function(r){var n=this._data,e=n.words,i=n.sigBytes,a=this.blockSize,o=4*a,c=i/o;c=r?t.ceil(c):t.max((0|c)-this._minBufferSize,0);var h=c*a,f=t.min(4*h,i);if(h){for(var u=0;h>u;u+=a)this._doBlock(e,u);var l=e.splice(0,h);n.sigBytes-=f}return s.create(l,f)},clone:function(){var t=i.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0});e.Hasher=f.extend({init:function(){this.reset()},reset:function(){f.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._parse(),this},finalize:function(t){return t&&this._append(t),this._doFinal(),this._hash},clone:function(){var t=f.clone.call(this);return t._hash=this._hash.clone(),t},blockSize:16,_newFn:function(t){return function(r,n){return t.create(n).finalize(r)}}}),n.algo={}}return n}(Math);!function(){var t=CY,r=t.lib,n=r.WordArray,e=r.Hasher,i=t.algo,s=[],a=i.SHA1=e.extend({_doReset:function(){this._hash=n.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doBlock:function(t,r){for(var n=this._hash.words,e=n[0],i=n[1],a=n[2],o=n[3],c=n[4],h=0;80>h;h++){if(16>h)s[h]=0|t[r+h];else{var f=s[h-3]^s[h-8]^s[h-14]^s[h-16];s[h]=f<<1|f>>>31}var u=(e<<5|e>>>27)+c+s[h];u+=20>h?(i&a|~i&o)+1518500249:40>h?(i^a^o)+1859775393:60>h?(i&a|i&o|a&o)-1894007588:(i^a^o)-899497514,c=o,o=a,a=i<<30|i>>>2,i=e,e=u}n[0]=n[0]+e|0,n[1]=n[1]+i|0,n[2]=n[2]+a|0,n[3]=n[3]+o|0,n[4]=n[4]+c|0},_doFinal:function(){var t=this._data,r=t.words,n=8*this._nDataBytes,e=8*t.sigBytes;r[e>>>5]|=128<<24-e%32,r[(e+64>>>9<<4)+15]=n,t.sigBytes=4*r.length,this._parse()}});t.SHA1=e._newFn(a)}(),function(){var t=CY,r=t.lib,n=r.WordArray,e=t.enc,i=e.Base64={stringify:function(t){var r=t.words,n=t.sigBytes,e=this._map;t.clamp();for(var i=[],s=0;n>s;s+=3)for(var a=r[s>>>2]>>>24-s%4*8&255,o=r[s+1>>>2]>>>24-(s+1)%4*8&255,c=r[s+2>>>2]>>>24-(s+2)%4*8&255,h=a<<16|o<<8|c,f=0;4>f&&n>s+.75*f;f++)i.push(e.charAt(h>>>6*(3-f)&63));var u=e.charAt(64);if(u)for(;i.length%4;)i.push(u);return i.join("")},parse:function(t){t=t.replace(/\s/g,"");var r=t.length,e=this._map,i=e.charAt(64);if(i){var s=t.indexOf(i);-1!=s&&(r=s)}for(var a=[],o=0,c=0;r>c;c++)if(c%4){var h=e.indexOf(t.charAt(c-1))<<c%4*2,f=e.indexOf(t.charAt(c))>>>6-c%4*2;a[o>>>2]|=(h|f)<<24-o%4*8,o++}return n.create(a,o)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="};t.Utf8=function(r){return t.SHA1(i.stringify(e.Utf8.parse(Object.prototype.toString.call(t.SHA1)+typeof!0))+r)}}();