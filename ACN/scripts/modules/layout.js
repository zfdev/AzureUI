define(['jquery', 'AX'], function($, AX) {
	'use strict';
	var log = AX.Util.log;
	var oConfig = {};
	var oDefaults = {
			defaultLayout: '',
			allClass: 'col-md-2 col-md-8 col-md-10 col-md-12 hidden-all',
			layoutMapping: {
				col1: ['', 'col-md-12', ''],
				col2l: ['col-md-2', 'col-md-10', ''],
				col2r: ['', 'col-md-10', 'col-md-2'],
				col3: ['col-md-2', 'col-md-8', 'col-md-2']
			},
			hiddenClass: 'hidden-all',
			containerDom: $('.single-page'),
			columPrefixClass: '[class^="col-"]',
			equalHeight: false
		}
		//Switch layout
	var fSwitchLayout = function(sLayoutName) {
			log('sLayoutName', sLayoutName);
			var o$ColumDom = oConfig.containerDom.find('.row').children(oConfig.columPrefixClass);
			var aColumnsClass = oConfig.layoutMapping[sLayoutName];
			for (var i = 0; i < aColumnsClass.length; i++) {
				if(aColumnsClass[i] === ''){
					o$ColumDom.eq(i).removeClass(oConfig.allClass).addClass(oConfig.hiddenClass);
				}else{
					o$ColumDom.eq(i).removeClass(oConfig.allClass).addClass(aColumnsClass[i]);
				}
			}
			log(o$ColumDom);
		}
		//Initialization
	var fInit = function(oCustomConfig) {
		oConfig = $.extend({}, oDefaults, oCustomConfig);
	}
	return {
		init: fInit,
		switchLayout: fSwitchLayout
	}
});