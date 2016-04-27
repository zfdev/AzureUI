/**
 * @namespace
 * @global
 * @author Jason Zhang <v-zhlong@microsoft.com>
 */
var AUI = AUI || {};

;(function(AUI) {
	"use strict";

	/**
	 * @name AUI.VERSION
	 * @description Azure UI javascript library version
	 */
	AUI.VERSION = "0.0.1";

	/**
	 * @name AUI.debug
	 * @description Debug mode switch
	 */
	AUI.debug = ture;

	/**
	 * @method AUI#Class
	 * @example
	 * @return {Function}
	 */
	AUI.Class = function() {
		
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
	}
})(AUI);