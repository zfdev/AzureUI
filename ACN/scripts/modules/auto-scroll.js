//TODO: Need to refactor.
define(['ScreenTest'], function(ScreenTest) {
	'use strict';
	var AutoScroll = function(oContainer) {
		this.o$Container = $(oContainer);
		this.update();
	}

	AutoScroll.prototype.update = function() {	
		if (ScreenTest.screen.bIsDesktopMode) {
			this.reset();
			return;
		}
		var o$Container = this.o$Container;
		var nWinHeight = $(window).height();
		var nTopMargin = 0;			
		if (typeof o$Container.data("top") == "string") {
			//log("nWinHeight", nWinHeight);								
			nTopMargin = $("." + o$Container.data("top")).height();
			//log("nTopMargin", nTopMargin);
		}
		if (typeof o$Container.data("top") == "number") {
			nTopMargin = o$Container.data("top");
		}
		var nContentHeight = 0;
		o$Container.children().each(function() {
			nContentHeight += $(this).height();
		});
		var nHeight = nWinHeight - nTopMargin;
		//log("nContentHeight nTopMargin", nContentHeight + nTopMargin);
		//			o$Container.addClass("scroll-y");
		//			o$Container.innerHeight(nHeight);	
		if ((nContentHeight + nTopMargin) > nWinHeight) {
			o$Container.addClass("scroll-y");
			o$Container.innerHeight(nHeight);
		} else {
			this.reset();
			if (o$Container.data("fullscreen")) {
				o$Container.css("height", nHeight);
			}
		}
	}
	
	AutoScroll.prototype.reset = function(){
		this.o$Container.removeClass("scroll-y");
		this.o$Container.css("height", "auto");	
	}
	return AutoScroll;
});