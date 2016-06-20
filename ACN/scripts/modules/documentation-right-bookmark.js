define(['jquery', 'AX', 'ScrollToFixed','Easing'], function($, AX, ScrollToFixed) {
	'use strict';
	var log = AX.Util.log;
	var oConfig = {};
	var oDefaults = {
		bookmarkSelector: 'h2',
		minTagNum: 3,
		topFixHeight: 120,
		speed: 1000,
		easing: 'easeOutExpo',
		titleMarginTop: 0,
		titleName: '在这篇文章中：',
		linkTemplate: '<li><a href="#<%=hash%>" data-index="<%=index%>"><%=name%></a></li>',
		highLightClassName: 'active',
		successStamp: 'success',
		failedStamp: 'failed',
		$contentContainer: $('.pure-content'),
		$bookmarkContainer: $('.documentation-bookmark'),
		endCallback: $.noop,
		$article: $('.pure-content .tags-date'),
		cloneAction: 'after'
	}
	/*
	 * {
	 * 	hash: ''
	 * 	title: '',
	 * 	top: 0
	 * }
	 */

	var o$AllH2Links = null;
	var oAllBookmarkData = [];
	var nCurrentIndex = 0;

	//Get title element offset top
	var fGetTitleTop = function(o$Element) {
		return Math.floor(o$Element.offset().top);
	}
	
	//Get all bookmark element name
	var fGetAllBookmark = function() {
			var oBookmarkData = [];
			o$AllH2Links = oConfig.$contentContainer.find(oConfig.bookmarkSelector);
			if(o$AllH2Links.length === 0){
				oConfig.endCallback && oConfig.endCallback(oConfig.failedStamp);
				return oBookmarkData;
			}
			//log(o$AllH2Links);
			$.each(o$AllH2Links, function() {
				var oElementData = {}
				oElementData['name'] = $(this).text();
				oElementData['top'] = fGetTitleTop($(this));
				//oElementData['bottom'] = fGetTitleTop($(this)) + $(this).height();
				//log($(this).text());
				oBookmarkData.push(oElementData);
				//log($(this).offset().top);
			})
			log(oBookmarkData);
			return oBookmarkData;
		}
	
	//Render right bookmark DOM
	var fRender = function(aData) {
			var sHtmlString = '';
			var o$BookmarkClone = null;
			sHtmlString += ('<h3>' + oConfig.titleName + '</h3>');
			sHtmlString += '<ul>';
			$.each(aData, function(nIndex, oElement) {
				var sElementHMTLString = AX.Util.Template(oConfig.linkTemplate, {
					index: nIndex,
					name: oElement.name,
					hash: nIndex
				})
				sHtmlString += sElementHMTLString;
			});
			sHtmlString += '</ul>';
			oConfig.$bookmarkContainer.empty().append(sHtmlString);
			o$BookmarkClone = $(sHtmlString).clone(true);
			o$BookmarkClone = o$BookmarkClone.wrapAll("<div class='book-mark " + oConfig.$bookmarkContainer.selector.substr(1) + " hidden-md hidden-lg'></div>").parent();
			oConfig.$article[oConfig.cloneAction](o$BookmarkClone);
			
		}
	
	//Highlight
	var fHighlightItem = function(nIndex){
		var o$AllItems = oConfig.$bookmarkContainer.find('li');
		o$AllItems.removeClass(oConfig.highLightClassName);
		o$AllItems.eq(nIndex).addClass(oConfig.highLightClassName);	
	}
	
	//Highlight by hash
	//Highlight by scrollposition
	//Is the element in view
	var fIsInView = function(o$Element){
		var $win = $(window);
		var nWindowViewTop = $win.scrollTop();
		var nElementTop = fGetTitleTop(o$Element);
		log(nWindowViewTop);
	}
	
	//Scroll To the position
	var fScrollToPos = function(nPosition) {
			$('html,body').animate({
				scrollTop: nPosition
			}, oConfig.speed, oConfig.easing);
		}
	
	//Check all element is in view
	var fCheckWhichInView = function(o$win, oAllElementData){
		var nWindowViewTop = o$win.scrollTop();
		var nWindowViewBottom = nWindowViewTop + o$win.height();
		var nActvieIndex;
		$.each(oAllElementData, function(nIndex, oElement) {
			//if((oElement['top'] >= nWindowViewTop) && (oElement['bottom'] <= nWindowViewBottom)){
			if(oElement['top'] - oConfig.titleMarginTop <= nWindowViewTop){
				//log(nIndex);
				return nActvieIndex = nIndex;		
			}
		});
		//log(nWindowViewBottom);
		return nActvieIndex;
	}

	//Event binding
	var fBindEvent = function(oAllBookmarkData) {
		fClickBMScrollToTitle();
		fScrollbarScroll(oAllBookmarkData);
		ScrollToFixed.init({
			topFixedPos: 0
		});
		ScrollToFixed.scrollToFixed(oConfig.$bookmarkContainer, oConfig.topFixHeight);
		oConfig.endCallback && oConfig.endCallback(oConfig.successStamp);
	}
	//Click bookmark link scroll to the title position.
	var fClickBMScrollToTitle = function() {
		$(document).on('click', oConfig.$bookmarkContainer.selector, function(e) {
			var o$ClickLink = $(e.target);
			var nIndex = o$ClickLink.data('index');
			var nScrollHeight = fGetTitleTop(o$AllH2Links.eq(nIndex));
			nScrollHeight = nScrollHeight - oConfig.titleMarginTop;
			//fHighlightItem(nIndex);
			fScrollToPos(nScrollHeight);
			return false;
		})
	}
	//Scroll scrollbar to highlight the bookmark.
	var fScrollbarScroll = function(oAllBookmarkData){
		var $win = $(window);
		$win.on('scroll', function(){
			var nActiveIndex = fCheckWhichInView($win, oAllBookmarkData);	
			//log(fCheckWhichInView($win, oAllBookmarkData));
			//TODO: Performance optimization
			if(nActiveIndex !== undefined){	
				//log(nActiveIndex);
				fHighlightItem(nActiveIndex);	
			};
		});
	}
	
	//Initialization
	var fInit = function(oCustomConfig) {
		oConfig = $.extend({}, oDefaults, oCustomConfig);
		oAllBookmarkData = fGetAllBookmark();
		log('oAllBookmarkData', oAllBookmarkData);
		if(oAllBookmarkData.length < oConfig.minTagNum){
			oConfig.endCallback && oConfig.endCallback(oConfig.failedStamp);
			return;	
		}
		fRender(oAllBookmarkData);
		//fHighlightItem(oConfig.$bookmarkContainer.find('li').eq(0));
		fBindEvent(oAllBookmarkData);
	}
	return {
		init: fInit
	}
});