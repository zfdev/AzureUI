//Bread crumb
define(['jquery', 'AX'], function($, AX){
	'use strict';
	var log = AX.Util.log;
	var oConfig = {};
	var oDefaults = {
		//dataURL: './../temp/breadcrumb.json',
		dataURL: 'https://wacnstoragestaging.blob.core.chinacloudapi.cn/tech-content/Content/breadcrumb.json',
		//level2Title: '',
		$Container: $('.bread-crumb'),
		linkTemplate: '<li><span>&gt;</span></li><li><a href="<%=link%>" title="<%=title%>"><%=title%></a></li>'
	}

	//Get service name
	var fGetService = function() {
		return $('tags').attr('ms.service') || '';
	}

	var fGetJSON = function(sServiceName, fSuccessCallback, fFailCallback){
		log('sServiceName', sServiceName);
		if (sServiceName) {
			var sRequestUrl = oConfig.dataURL;
			$.ajax({
				type: "GET",
				url: sRequestUrl,
				dataType: 'json'
			}).done(function(oData) {
				var oBreadCrumbData = {};
				$.each(oData, function(){
					//log('bread crumb:', this);
					if(this.service === sServiceName){
						oBreadCrumbData['title'] = this.title;
						oBreadCrumbData['link'] = this.link;
						return;	
					}
				});
				fSuccessCallback && fSuccessCallback(oBreadCrumbData);
			}).fail(function() {
				fFailCallback && fFailCallback();
				log('Bread crumb initialization failed', 'Can not load the JSON.');
			});
		} 
	}
	
	var fRenderDom = function(oData){
		log('Bread crumb data', oData);
		if($.isEmptyObject(oData)){
			return;	
		}
		var sLandingPageLink = AX.Util.Template(oConfig.linkTemplate, oData);
		oConfig.$Container.find('ul').append(sLandingPageLink);
	}
	
	var fInit = function(oCustomConfig) {
		oConfig = $.extend({}, oDefaults, oCustomConfig);
		fGetJSON(fGetService(), fRenderDom);
	}
	return {
		init: fInit
	}	
});