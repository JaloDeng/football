/**
 * asset/common.js 在此文件存放公共函数或常数
 */
!function(n,t,e,r,i){var o=t[n],u=t.document,f="getElementsByTagName",c="indexOf",a={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\","\v":"\\u000b"},l=function(n,t){return'"'+n.replace(t?/[\\\"\x00-\x1f]/g:/[\\\"\x00-\x1f\x7f-\uffff]/g,function(n){var t=a[n];return"string"==typeof t?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"'},p=function(n,t){var e=typeof n;if(t=t||"","string"===e)return l(n,t[c]("c")<0);if("object"===e){if(null===n)return"null";if(n instanceof Array){for(var r=[],i=n.length,o=0;i>o;o++)r.push(p(n[o],t));return["[",r.join(","),"]"].join("")}if(n instanceof Date)return t[c]("d")<0?["new Date(",+n,")"].join(""):t[c]("i")<0?['"*UTC*',+n,'"'].join(""):+n;if(n instanceof RegExp)return t[c]("r")<0?n.toString():'"[object RegExp]"';var r=[];for(var u in n)r.push(p(u)+":"+p(n[u],t));return["{",r.join(","),"}"].join("")}return"function"===e?t[c]("f")<0?n.toString():'"[object Function]"':n},s=function(n,t){return n&&n instanceof Array?n:n&&"string"!=typeof n&&n.length!==i?n:t===i?[n]:t};if(o===i){var g=function(n){return n===i?0:null==n?1:"function"==typeof n?5:"string"==typeof n?8:"object"==typeof n?9:i},v=function(n){return function(t,e){return e=9==g(t)?t:8==g(t)?u.getElementById(t):i,n?t?t[f]?t[f](n):e?e[f](n):i:u[f](n)[0]:e}};o=t[n]=v(),o.$=v,o.K=g,o[r[0]]=r}o.ARR=s,o.RPS=function(n,t,e){return n.replace(new RegExp("{{"+t+"}}","g"),e)},o.CINT=function(n,t,e){return e=parseInt(n,10),isNaN(e)?t===i?!1:t:e},o.CNUM=function(n,t,e){return e=parseFloat(n),isNaN(e)?t===i?!1:t:e},o.CSS=function(n,t,e){var r="style",i=r+"Sheet",f=i+t,c=o(f),a=o.$("head")();e&&c&&a.removeChild(c),n&&!o(f)&&(c=u.createElement(r),n=u.createTextNode(n),c.type="text/css",c.id=f,c[i]?c[i].cssText=n.nodeValue:c.appendChild(n),a.appendChild(c))},o.FORO=function(n,t,e){e=e||n;var r,i=0,o={o:n};for(r in n)if(n.hasOwnProperty(r)){if(o.i=i,o.k=r,o.v=n[r],t.call(e,o)===!1)return i;i++}return i},o.FORA=function(n,t,e,r){n=s(n);var i,o=n.length||0,u={o:n,l:o};if(r!==!0){for(i=0;o>i;i++)if(u.i=i,u.k=i,u.v=n[i],t.call(e||n[i],u)===!1)return i}else for(i=o-1;i>-1;i--)if(u.i=i,u.k=i,u.v=n[i],t.call(e||n[i],u)===!1)return i;return!0},o.TPL=function(n,t){return t===i&&(t="T"),new Function(t,"_","_='';_+='"+n.replace(/[\r\t\n]/g," ").replace(/\'(?=[^#]*#>)/g,"\t").split("'").join("\\'").split("\t").join("'").replace(/<#=(.+?)#>/g,"';_+=$1;_+='").split("<#").join("';").split("#>").join("_+='")+"'; return _;")},o.EUC=function(n){var e=t.encodeURIComponent,r=[];return 9===o.K(n)?(o.FORO(n,function(n){s(n.v,!1)?o.FORA(n.v,function(t){r.push([n.k,"=",e(t.v)].join(""))}):r.push([n.k,"=",e(n.v)].join(""))}),r.join("&")):e(n)},o.JSO=e,o.JST=p}("V",this,function(n,t){try{return"string"==typeof n?eval(["(",n,")"].join("")):n}catch(e){return[t,n,e]}},["VER",{V_ABBR_HELPER:20170830.3},"{cdfir:V.JST([],V.VER[2|3])}","cdfr"]);
(function(window,UND){
	var V=window.V,ExtApp=window.ExtApp=window.ExtApp||{},SATR='setAttribute'
	;
	if(V===UND){return};

/*!
  * $script.js JS loader & dependency manager
  * https://github.com/ded/script.js
  * (c) Dustin Diaz 2014 | License MIT
  */
	(function (name, definition) {
		V[name] = definition();

		try{
			var CAP='APP_CAPTION',HTM='innerHTML',CNT='content',TIT='title'
				,$state=V('stateLoadingJsLibs'),$hft=V('HTML_FILE_TITLE')
				,titpl=V.RPS($hft.getAttribute(CNT),CAP,ExtApp[CAP])
			;
			$hft.removeAttribute(CNT);
			$hft[SATR](CNT,titpl);
			if(document[TIT]){
				document[TIT]=titpl
			}else{
				V.$(TIT)(V.$('head')())[0][HTM]=titpl
			}
			if($state)$state[HTM]=V.RPS($state[HTM],CAP,ExtApp[CAP]);
		}catch(e){}

		if (window.console===UND) {
			window.console={log:function(){}};
		}

	})('JS', function () {
		var 
			head = V.$('head')(),
			f = false,
			push = 'push',
			readyState = 'readyState',
			onreadystatechange = 'onreadystatechange',
			list = {},
			ids = {},
			delay = {},
			scripts = {},
			scriptpath;

		function every(ar, fn) {
			for (var i = 0, j = ar.length; i < j; ++i)
				if (!fn(ar[i])) return f
			return 1
		}

		function each(ar, fn) {
			every(ar, function(el) {
				fn(el);
				return 1
			})
		}

		function $script(paths, idOrDone, optDone) {
			paths = paths[push] ? paths : [paths]
			var idOrDoneIsDone = idOrDone && idOrDone.call,
				done = idOrDoneIsDone ? idOrDone : optDone,
				id = idOrDoneIsDone ? paths.join('') : idOrDone,
				queue = paths.length;

			function loopFn(item) {
				return item.call ? item() : list[item]
			}

			function callback() {
				if (!--queue) {
					list[id] = 1;
					done && done();
					for (var dset in delay) {
						every(dset.split('|'), loopFn) && !each(delay[dset], loopFn) && (delay[dset] = [])
					}
				}
			}
			setTimeout(function() {
				each(paths, function loading(path, force) {
					if (path === null) return callback();

					if (!force && scriptpath) {
						path = (path.indexOf('.js') === -1) ? scriptpath + path + '.js' : scriptpath + path;
					}

					if (scripts[path]) {
						if (id) ids[id] = 1;
						return (scripts[path] == 2) ? callback() : setTimeout(function() {
							loading(path, true)
						}, 0)
					}

					scripts[path] = 1;
					if (id) ids[id] = 1;
					create(path, callback);
				})
			}, 0);
			return $script
		}

		function create(path, fn) {
			var el = document.createElement('script'),
				loaded;
			el.onload = el.onerror = el[onreadystatechange] = function() {
				if ((el[readyState] && !(/^c|loade/.test(el[readyState]))) || loaded) return;
				el.onload = el[onreadystatechange] = null;
				loaded = 1;
				scripts[path] = 2;
				fn()
			};
			el[SATR]('charset','UTF-8');
			el[SATR]('async','async');
			el.src = path;
			head.insertBefore(el, head.lastChild)
		}

		$script.get = create;

		$script.order = function(scripts, id, done) {
			(function callback(s) {
				s = scripts.shift(), !scripts.length ? $script(s, id, done) : $script(s, callback)
			}())
		};

		$script.path = function(p) {
			scriptpath = p
		};

		$script.ready = function(deps, ready, req) {
			deps = deps[push] ? deps : [deps]
			var missing = [];
			!each(deps, function(dep) {
					list[dep] || missing[push](dep);
				}) && every(deps, function(dep) {
					return list[dep]
				}) ?
				ready() : !function(key) {
					delay[key] = delay[key] || [];
					delay[key][push](ready);
					req && req(missing);
				}(deps.join('|'));
			return $script
		};

		$script.done = function(idOrDone) {
			$script([null], idOrDone)
		};

		return $script
	});

})(this);
