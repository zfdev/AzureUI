//Judge link target attribute
define(['jquery', 'AX'], function($, AX){
	'use strict';
	var log = AX.Util.log;
	var oConfig = {};
	var oDefaults = {
		$linkContainer:　$('body'),
		target: '_blank',
		domainName: 'auzre.cn'
	}
	
	//Get all links
	var fGetAllLinks = function(o$LinkContainer){
		return o$LinkContainer.find('a');	
	}
	
	//
	var fIsExternalLink = function(sURL){
		return ((sURL.indexOf(':') > -1) || (sURL.indexOf('//') > -1));
	}
	
	var fTestAllLinks = function(aAllLinks){
		aAllLinks.each(function(nIndex, oElement){
			if($(this).attr('href') && ($(this).attr('href') !== '#') && fIsExternalLink($(this).attr('href'))){
				fSetLinkAttribute($(this));		
			}
		});
	}
	
	//
	var fSetLinkAttribute = function(o$Link){
		if(!o$Link.attr('target')){
			o$Link.attr('target', oConfig.target);	
		}
	}
	
	//Initialization
	var fInit = function(oCustomConfig) {
		oConfig = $.extend({}, oDefaults, oCustomConfig);
		fTestAllLinks(fGetAllLinks(oConfig.$linkContainer));
	}
	return {
		init: fInit,
		isExternalLink: fIsExternalLink
	}	
});