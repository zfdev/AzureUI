//TODO: Need to refactor.
define(function() {
	'use strict';
	var Tab = function($tabNavContainer) {
		this.$tabNavContainer = $tabNavContainer;
	}
	Tab.prototype.init = function() {
		this.eventHandler = this.$tabNavContainer.data('event') || 'click';
		this._bind();
	}
	Tab.prototype._bind = function() {
		var self = this;
		var oEventType = self.eventHandler + '.tab';
		self.$tabNavContainer.find('[data-toggle="tab"]').each(function() {
			if ($(this).parent('li').hasClass('active')) {
				show($(this));
			}
		});
		self.$tabNavContainer.on(oEventType, '[data-toggle="tab"]', self, activate);
		self.$tabNavContainer.on('touchend', '[data-toggle="tab"]', self, activate);
		self.$tabNavContainer.on('click.tab', '[data-toggle="tab"]', self, fPreventDefault);
	}
	var fPreventDefault = function() {
		return false;
	}
	var show = function($tabLink) {
		var sTargetId = $tabLink.attr("href");
		var regExp = /^#\S+/g;
		if (regExp.test(sTargetId)) {
			$(sTargetId).parents(".tab-content").find(".tab-panel").removeClass("show-md");
			$(sTargetId).addClass("show-md");
		}
	}
	var activate = function(event) {
		event.data.$tabNavContainer.find('li').removeClass("active");
		$(this).parent('li').addClass("active");
		show($(this));
	}
	return Tab;
});