define(['ScreenTest'], function(ScreenTest) {
	'use strict';
	var AutoHeight = function(oContainer) {
		this.o$Container = $(oContainer);
		this.aChildDomArr = fGetAllChildDom($(oContainer));
		this.bEnble = false;
		this.update();
		this.maxHeight = 640;
	}
	AutoHeight.prototype.update = function() {
		if (!ScreenTest.screen.bIsDesktopMode) {
			this.reset();
			this.bEnble = false;
			return;
		}
		this.bEnble = true;
		var nMaxHeight;
		var o$AutoHeightContainer = this.o$Container;
		var aChildDomArr = this.aChildDomArr;
		var nFixHeightInDesktopView = o$AutoHeightContainer.data('mdheight');
		if (nFixHeightInDesktopView) {
			nMaxHeight = nFixHeightInDesktopView;
		} else {

			var nHeightArr = fGetAllChildDomHeightArr(aChildDomArr, this.maxHeight);
			//log(nHeightArr);
			nMaxHeight = fGetMaxHeight(nHeightArr);
		}

		o$AutoHeightContainer.css('height', nMaxHeight);
		//			if(nMaxHeight>600){
		//				o$AutoHeightContainer.css('height', 600);	
		//			}
		$.each(aChildDomArr, function() {
			$(this).css('height', nMaxHeight);
		});
	}
	AutoHeight.prototype.reset = function() {
		if (!this.bEnble) {
			return;
		}
		this.o$Container.css('height', 'auto');
		$.each(this.aChildDomArr, function() {
			$(this).css('height', 'auto');
		});
	}
	var fGetMaxHeight = function(nHeightArr) {
		return Math.max.apply(null, nHeightArr);
	}
	var fGetAllChildDom = function(o$AutoHeightContainer) {
		var aChildDomArr = [];
		var sChildSelector = o$AutoHeightContainer.data('child');
		var aChildSelectorArr = sChildSelector.split('|');
		
		$.each(aChildSelectorArr, function(index, element) {
			var o$ChildDom = o$AutoHeightContainer.find(element);
			if (o$ChildDom.length > 1) {
				o$ChildDom.each(function() {
					aChildDomArr.push($(this));
				});
			} else {
				aChildDomArr.push(o$ChildDom);
			}

		});
		aChildDomArr.push(o$AutoHeightContainer);
		return aChildDomArr;
	}
	var fGetAllChildDomHeightArr = function(aChildDomArr, nMaxHeight) {
		var nHeightArr = [];
		$.each(aChildDomArr, function() {
			var nHeight = $(this).innerHeight();
			if (nHeight >= nMaxHeight) {
				nHeight = nMaxHeight;
				$(this).addClass('scrollable');
			}
			nHeightArr.push(nHeight);
		});
		return nHeightArr;
	}
	return AutoHeight;
});