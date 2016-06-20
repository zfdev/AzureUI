define(['jquery', 'AX', 'IsExternalLink'], function($, AX, IsExternalLink) {
	'use strict';
	var log = AX.Util.log;
	//Config
	var oDefaults = {
		endCallback: $.noop,
		$leftNavContainer: $('.documentation-navigation'),
		successStamp: 'success',
		failedStamp: 'failed',
		titleLengthLimit: 10,
		currentClass: 'active',
		$article: $('.pure-content'),
		dataHost: './../temp/',
		template: {
			templateLevel1Title: '<a href="#" id="<%=id%>" class="menu-title" title="<%=title%>"><span class="nav-title"><%=name%></span><span class="icon icon-arrow-top"></span></a>',
			templateSelectOption: '<option value="<%=url%>"><%=title%></option>',
			templateLevel2Title: '<li><a href="<%=url%>" id="<%=id%>" title="<%=title%>"><%=title%></a></li>'
		},
		serviceMappingJSON: {
			"active-directory": "identity.json",
			"application-gateway": "application-gateway.json",
			"app-service": "web-sites.json",
			"app-service-web": "web-sites.json",
			"automation": "automation.json",
			"azure-resource-manager": "",
			"azure-security": "",
			"backup": "backup.json",
			"batch": "batch.json",
			"best-practice": "",
			"cache": "redis-cache.json",
			"cdn": "cdn.json",
			"cloud-services": "cloud-services.json",
			"event-hubs": "event-hubs.json",
			"expressroute": "expressroute.json",
			"HDInsight": "hdinsight.json",
			"iot-hub": "iot-hub.json",
			"key-vault": "key-vault.json",
			"media-services": "media-services.json",
			"mobile-services	": "mobile-services.json",
			"multi-factor-authentication	": "multi-factor-authentication.json",
			"multiple": "",
			"mysql": "mysql.json",
			"na": "",
			"notification-hubs": "notification-hubs.json",
			"scheduler": "scheduler.json",
			"service-bus	": "service-bus.json",
			"site-recovery": "site-recovery.json",
			"sql-database": "sql-databases.json",
			"sql-data-warehouse": "sql-data-warehouse.json",
			"sql-server-stretch-database": "sql-server-stretch-database.json",
			"storage": "storage.json",
			"stream-analytics": "stream-analytics.json",
			"traffic-manager": "traffic-manager.json",
			"virtual-machine": "virtual-machines.json",
			"virtual-machines": "virtual-machines.json",
			"virtual-network": "networking.json",
			"vpn-gateway": "vpn-gateway.json",
			"web-sites": "web-sites.json",
			"virtual-machines-windows": "virtual-machines-windows.json",
			"virtual-machines-linux": "virtual-machines-linux.json "
		}
	};
	var oConfig = {};
	var o$LeftNavigation = null;
	var o$Select = null;
	//Get service name
	var fGetService = function() {
			var sServiceName = $('tags').attr('ms.service') || '';
			sServiceName = sServiceName.toLowerCase();
			return sServiceName;
		}
		//Get JSON from storage
	var fGetJSON = function(fServiceName, fSuccessCallback, fFailedCallback) {
		var sServiceName = fServiceName();
		if (sServiceName) {
			var sRequestUrl = '';
			if (oConfig.serviceMappingJSON[sServiceName]) {
				sRequestUrl = oConfig.dataHost + oConfig.serviceMappingJSON[sServiceName];
			} else {
				sRequestUrl = oConfig.dataHost + sServiceName + '.json';
			}
			$.ajax({
				type: "GET",
				url: sRequestUrl,
				dataType: 'json'
			}).done(function(oData) {
				fSuccessCallback(oData);
			}).fail(function() {
				fFailedCallback();
				log('Left navigation initialization failed', 'Can not load the JSON.');
			});
		} else {
			fFailedCallback();
			log('Left navigation initialization failed', 'The ms.service is undefined.');
		}

	}

	//TODO: Highlight current link
	var fIsCurrentLink = function(sURL) {
		return window.location.pathname === sURL;
	}
	var fHighlightCurrent = function(nActiveIndex, nCurrentIndex, sActiveOptionValue) {
		if (nActiveIndex != -1 && nCurrentIndex != -1) {
			var o$ActiveLi = o$LeftNavigation.children('li').eq(nActiveIndex).find('li').eq(nCurrentIndex);
			o$ActiveLi.addClass(oConfig.currentClass);
		}
		if (sActiveOptionValue != '') {
			var sOptionSelector = "option[value='" + sActiveOptionValue + "']";
			o$Select.find(sOptionSelector).prop('selected', true);
		}
	}

	var fBindEvent = function() {
		o$Select.find('select').on('change', function() {
			//log('value', $(this).val());
			var sLinkUrl = $(this).val();
			if (IsExternalLink.isExternalLink(sLinkUrl)) {
				//				var oWin = window.open(sLinkUrl, '_blank');
				//				oWin.focus();
				//				if(oWin === null){
				//					window.location.href = sLinkUrl;
				//				}
				window.location.href = sLinkUrl;
			} else {
				window.location.href = window.location.origin + $(this).val();
			}
		});
		return o$Select;
	}

	//Render list DOM
	var fRenderList = function(oData) {
		log(oData);
		var sServiceName = oData.service;
		var oListData = oData.navigation;
		var nActiveIndex = -1;
		var nCurrentIndex = -1;
		var sActiveOptionValue = '';
		var sListDomString = '';
		var sSelectString = '';
		sListDomString += ('<h3>' + sServiceName + '</h3>');
		sListDomString += '<ul>';
		sSelectString += '<div class="select hidden-md hidden-lg"><select>';
		$.each(oListData, function(nIndex) {
			var sListTitle = oListData[nIndex]['group'];
			//var sListTitleCutOff = AX.Util.textLimit(sListTitle, oConfig.titleLengthLimit, '...');
			var sId = oListData[nIndex]['id'];
			var aChildData = oListData[nIndex]['articles'];
			sListDomString += '<li>';
			sSelectString += ('<optgroup label="' + sListTitle + '">');
			sListDomString += AX.Util.Template(oConfig.template.templateLevel1Title, {
				id: sId,
				title: sListTitle,
				name: sListTitle
			});
			sListDomString += '<ul class="menu-child">';
			$.each(aChildData, function(nChildIndex) {
				var sChildListTitle = aChildData[nChildIndex]['title'];
				var sChildListLink = aChildData[nChildIndex]['link'];
				var sChildListId = aChildData[nChildIndex]['id'];
				var oLevel2TitleData = {};
				if (fIsCurrentLink(sChildListLink)) {
					nActiveIndex = nIndex;
					nCurrentIndex = nChildIndex;
					sActiveOptionValue = sChildListLink;
				}
				oLevel2TitleData = {
					id: sChildListId,
					title: sChildListTitle,
					url: sChildListLink
				}
				sListDomString += AX.Util.Template(oConfig.template.templateLevel2Title, oLevel2TitleData);
				sSelectString += AX.Util.Template(oConfig.template.templateSelectOption, oLevel2TitleData);
			});
			sListDomString += '</ul>';
			sSelectString += '</optgroup>';
			//log(oListData[nIndex]);		
		});
		sListDomString += '</ul>';
		sSelectString += '</select><span class="icon icon-arrow-top"></span></div>';
		o$Select = $(sSelectString);
		o$LeftNavigation = $(sListDomString);
		oConfig.$leftNavContainer.empty().append(o$LeftNavigation);
		oConfig.$article.prepend(o$Select);
		fBindEvent();
		fHighlightCurrent(nActiveIndex, nCurrentIndex, sActiveOptionValue);

		var oLeftNavData = {};
		oLeftNavData['status'] = oConfig.successStamp;
		oLeftNavData['index'] = nActiveIndex;
		oConfig.endCallback && oConfig.endCallback(oLeftNavData);

		//log(sListDomString);
		log('Left navigation initialization success.');
	}

	var fFailedCallback = function() {
		var oLeftNavData = {};
		oLeftNavData['status'] = oConfig.failedStamp;
		oLeftNavData['index'] = -1;
		oConfig.endCallback && oConfig.endCallback(oLeftNavData);
	}

	//Initialization
	var fInit = function(oCustomConfig) {
		oConfig = $.extend({}, oDefaults, oCustomConfig);
		fGetJSON(fGetService, fRenderList, fFailedCallback);
	}

	return {
		init: fInit
	}
});