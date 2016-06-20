/**
 * @namespace
 * @global
 * @author Jason Zhang <v-zhlong@microsoft.com>
 */
var AX = AX || {};

(function(AX) {
	'use strict';

	/**
	 * @name AX.VERSION
	 * @description Azure UI javascript library version
	 */
	AX.VERSION = "0.0.1";

	/**
	 * @name AX.debug
	 * @description Debug mode switch
	 */
	AX.debug = false;

	/**
	 * @method AX.Class
	 * @example
	 * AX.Class.extend({
	 * 	init: function(){
	 * 	
	 * }
	 * });
	 * @return {Function}
	 */

	AX.Class = (function() {
		
		//Mix custom property
		var _mix = function(targetObject, sourceObject) {
			for (var property in sourceObject) {
				if (sourceObject.hasOwnProperty(property)) {
					targetObject[property] = sourceObject[property];
				}
			}
		}
		
		//
		var _extend = function() {
			this.initPrototype = true;
			var prototype = new this();
			this.initPrototype = false;
			
			var items = Array.prototype.slice.call(arguments) || [];
			var item;
			while(item = items.shift()){
				_mix(prototype, item.prototype || item);
			}
			
			var SubClass = function() {
				if(!SubClass.initPrototype && this.init){
					this.init.apply(this, arguments);
				}			
			}			
			SubClass.prototype = prototype;
			SubClass.prototype.constructor = SubClass;
			SubClass.extend = _extend;
			return SubClass;
		}
		
		//Super Class
		var Class = new Function();
		Class.extend = _extend;
		return Class;
	})();
	
	//Base Class
	AX.Base = AX.Class.extend({
		init: function(oConfig){
			this._config = oConfig;
			this.bind();
			this.render();				
		},
		get: function(sKey){
			return this._config[sKey];	
		},
		set: function(sKey, oValue){			
			this._config[sKey] = oValue;
		},
		bind: function(){
				
		},
		render: function(){
			
		},
		destory: function(){
			
		}
	});

//	AX.Device = AX.Class.extend({
//		init:　function(){
//			
//		},
//		device: {
//			bIsMobileMode: ,
//			bIsTabletMode: ,
//			bIsDesktopMode 
//		}
//	});
	
	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		define(function() {
			return AX;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = AX;
	} else {
		window.AX = AX;
	}
	
})(AX);