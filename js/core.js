/*! Azure UI v0.0.1*/
;
(function(win) {
	"use strict";
	win.AUI = win.AUI || {};
	AUI.VERSION = "0.0.1";
	AUI.Class = function() {
		var _mix = function(r, s){
			for(var p in s){
				if(s.hasOwnProperty(p)){
					r[p] = s[p]
				}
			}
		}
		var _extend = function(){
			var prototype = new this();
			var SubClass = function(){
				this.init.apply(this, arguments);
			}
			SubClass.prototype = prototype;
			SubClass.prototype.constructor = SubClass;
			return SubClass;
		}
		var Class = new Function();
		Class.extend = _extend;
		return Class;
	}
	AUI.base = function(){
						
	}
	AUI.Template = (function() {
		var cache = {};
		var tmpl = function(str, data) {
			// Figure out if we're getting a template, or if we need to
			// load the template - and be sure to cache the result.
			var fn = !/\W/.test(str) ?
				cache[str] = cache[str] ||
				tmpl(document.getElementById(str).innerHTML) :

				// Generate a reusable function that will serve as a template
				// generator (and which will be cached).
				new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +

					// Introduce the data as local variables using with(){}
					"with(obj){p.push('" +

					// Convert the template into pure JavaScript
					str
					.replace(/[\r\t\n]/g, " ")
					.split("<%").join("\t")
					.replace(/((^|%>)[^\t]*)'/g, "$1\r")
					.replace(/\t=(.*?)%>/g, "',$1,'")
					.split("\t").join("');")
					.split("%>").join("p.push('")
					.split("\r").join("\\'") + "');}return p.join('');");

			// Provide some basic currying to the user
			return data ? fn(data) : fn;
		};
		return tmpl;
	})();

})(window);