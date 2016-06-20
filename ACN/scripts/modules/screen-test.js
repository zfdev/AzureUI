//TODO: Need to refactor.
define(['jquery'], function($){
	'use strict';
	var win = window;
	var o$Win = $(win);
	var o$Html = $('html');
	var oScreen = {};
	var oConfig = {};
	var oDefaults = {
		breakPoint: {
			min: {
				mobile: 320,
				tablet: 768,
				desktop: 980,
				large: 1280
			},
			max: {
				mobile: 321,
				tablet: 769,
				desktop: 981,
				large: 1281
			}
		},
		class: {
			bIsMobileMode: 'mobile',
			bIsTabletMode: 'tablet',
			bIsDesktopMode: 'desktop'
		}
	}
	var fScreenTest = function() {
		if (win.matchMedia) {
			oScreen.bIsMobileMode = win.matchMedia("only screen and (max-width: " + oConfig.breakPoint.max.tablet + "px)").matches;
			oScreen.bIsTabletMode = win.matchMedia("only screen and (min-width: " + oConfig.breakPoint.min.tablet + "px) and (max-width: " + oConfig.breakPoint.max.desktop + "px)").matches;
			//bIsDesktopMode = win.matchMedia("only screen and (min-width: " + oConfig.breakPoint.min.desktop + "px) and (max-width: " + oConfig.breakPoint.max.large + "px)").matches;
			oScreen.bIsDesktopMode = win.matchMedia("only screen and (min-width: " + oConfig.breakPoint.min.desktop + "px)").matches;
		}else{
			//TODO: Other device test method.
		}
		fMarkDevice();
	}
	
	var fMarkDevice = function(){
		var sBodyClass = '';
		var aAllClass = [];
		for(var index in oConfig.class){
			aAllClass.push(oConfig.class[index]);
			if(oScreen[index] === true){
				sBodyClass = oConfig.class[index];	
			}
		}
		o$Html.removeClass(aAllClass.join(' '));
		o$Html.addClass(sBodyClass);
		o$Html.data('device', sBodyClass);
	}
		//		var fIsResponsivePage = function() {
		//			return o$Body.hasClass('no-responsive');
		//		}
	var oCallbacks = $.Callbacks();
	var fAdd = oCallbacks.add;
	var fInit = function(oCustomConfig) {
		oConfig = $.extend({}, oDefaults, oCustomConfig);
		//			if (fIsResponsivePage()) {
		//				bIsDesktopMode = true;
		//			} else {
		fScreenTest();
		o$Win.on('resize', function() {
			fScreenTest();
			oCallbacks.fire();
		})
			//			}
	}

	return {
		screen: oScreen,
		add: fAdd,
		init: fInit
	}	
});