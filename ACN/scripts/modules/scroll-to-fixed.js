define(['jquery', 'AX'], function($, AX) {
	'use strict';
	var log = AX.Util.log;
	var oConfig = {};
	var oDefaults = {
		fixedClass: 'fixed-top',
		fixBottomClass: 'fixed-bottom',
		scrollTop: 100,
		topFixedPos: 20,
		$container: $('.pure-content'),
		contentPadding: 60
	}
	var o$Win = $(window);
	
	var fRightPos = function(o$FixedDom) {
		var nFixedRightPos;
		var o$FixedDomContainer = o$FixedDom.parent();
		nFixedRightPos = o$Win.width() - (o$FixedDomContainer.offset().left + o$FixedDomContainer.outerWidth() - o$FixedDomContainer.css('padding-left'));
		return Math.floor(nFixedRightPos);
	}

	var fDomWidth = function(o$FixedDom) {
		return o$FixedDom.parent().width();
	}

	var fDomHeight = function(o$FixedDom){
		return o$FixedDom.parent().height();
	}

	var fSetPosData = function(o$FixedDom, nTop, nRight, nWidth) {
		var nWidth = nWidth || fDomWidth(o$FixedDom);
		var nRight = nRight || fRightPos(o$FixedDom);
		var nTop = nTop || oConfig.topFixedPos;
		//o$FixedDom.attr('data-right', nRight);
		//o$FixedDom.data('top', nTop);
		o$FixedDom.data('width', nWidth);
		if(o$FixedDom.hasClass(oConfig.fixBottomClass)){
			o$FixedDom.removeData('top');
			o$FixedDom.data('bottom', 0);	
		}else{
			o$FixedDom.removeData('bottom');
			o$FixedDom.data('top', nTop);
		}
	}

	var fSetFixedDomStyle = function(o$FixedDom) {
		var oPosData = o$FixedDom.data();
		if(oPosData.hasOwnProperty('bottom')){
			oPosData['top'] = '';
		}else{
			oPosData['bottom'] = '';
		}
		o$FixedDom.css(oPosData);			
	}

	var fResetDomStyle = function(o$FixedDom){
		o$FixedDom.css({
			top: '',
			//right: '',
			width: '',
			height: '',
			bottom: ''
		});		
	}

	var fFixToTop = function(o$FixedDom, nFixedTop) {
		
		oConfig.scrollTop = nFixedTop || oConfig.scrollTop;
		fSetPosData(o$FixedDom);
		var nWinHeight = o$Win.height();
		var nDomHeight = fDomHeight(o$FixedDom);
		var nFooterHeight = $('.footer').outerHeight();
		if(nDomHeight > nWinHeight){
			//TODO： Auto scroll
		}

		o$Win.on('scroll.fixtop', function() {
			var nScrollTop = o$Win.scrollTop();
			var nDocHeight = $(document).height();
			var nScrollBottomJudge = nScrollTop + o$FixedDom.height();
			var bIsOverFooter = nScrollBottomJudge > (nDocHeight - nFooterHeight - oConfig.contentPadding);
			
			if (nScrollTop >= nFixedTop && !bIsOverFooter) {
				o$FixedDom.removeClass(oConfig.fixBottomClass);
				o$FixedDom.addClass(oConfig.fixedClass);
				fSetPosData(o$FixedDom);
				//fSetPosData(o$FixedDom, 0);
				fSetFixedDomStyle(o$FixedDom);
			}else if(bIsOverFooter){
				o$FixedDom.removeClass(oConfig.fixedClass);
				o$FixedDom.addClass(oConfig.fixBottomClass);
				o$FixedDom.parent().height(oConfig.$container.height());
				o$FixedDom.parent().css('position', 'relative');
				//var nTopOffset = -(nDocHeight - nScrollBottomJudge);
				fSetPosData(o$FixedDom);
				//fSetPosData(o$FixedDom, nTopOffset);
				fSetFixedDomStyle(o$FixedDom);
			}else {
				o$FixedDom.removeClass(oConfig.fixBottomClass);
				o$FixedDom.removeClass(oConfig.fixedClass);
				fResetDomStyle(o$FixedDom);
			}		
		}).on('resize.fixtop', function() {
			fSetPosData(o$FixedDom);
			fSetFixedDomStyle(o$FixedDom);
		});
	}

	//Initialization
	var fInit = function(oCustomConfig) {
		oConfig = $.extend({}, oDefaults, oCustomConfig);
	}
	return {
		init: fInit,
		scrollToFixed: fFixToTop
	}
});