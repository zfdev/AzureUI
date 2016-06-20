//TODO: Need to refactor.
define(['jquery'], function(){
	'use strict';
	var fBindEvent = function(oPanelDom) {
		$(oPanelDom).on("click.panel", ".panel-title .icon-close", function() {
			$(this).parents(".panel-wrapper").removeClass("show");
			oBodyScroll.scroll();
			return false;
		});
	}
	var fInit = function() {
		$(".panel-wrapper").each(function(index, element) {
			fBindEvent(this);
		});
	}
	return {
		init: fInit
	}	
});	
