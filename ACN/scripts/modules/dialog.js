//TODO: Need to refactor.
define(function() {
	'use strict';
	var Dialog = function(o$link) {
		this.width = 0;
		this.height = 0;
		this.$link = o$link;
	}
	Dialog.prototype.init = function() {
		//get dom
		var sDialogIdSelector = this.$link.attr('href');
		//log(sDialogIdSelector);
		this.$dialog = $(sDialogIdSelector);
		this.$dialogContent = this.$dialog.find('.dialog-content');
		this.$closeBtn = this.$dialog.find('.dialog-header .close-btn');
		this.$mask = this.$dialog.find('.dialog-mask');
		//load config for dialog
		this.width = this.$dialog.data('width');
		this.height = this.$dialog.data('height');
		this._bind(); //bind event
		this.update();
	}
	Dialog.prototype.open = function() {
		this.$dialog.addClass('open');
		//return false;
	}
	Dialog.prototype.update = function() {
		this.$dialogContent.width(this.width);
		this.$dialogContent.height(this.height);
		this.$dialogContent.css('margin-left', -this.width / 2);
		this.$dialogContent.css('margin-top', -this.height / 2);
	}
	Dialog.prototype._bind = function() {
		var self = this;
		this.$link.off('click.Dialog');
		this.$link.on('click.Dialog.link', function(e) {
			self.open();
			e.preventDefault();
			e.stopPropagation();
		});
		this.$closeBtn.on('click.Dialog.closeBtn', function(e) {
			self.close();
			e.preventDefault();
			e.stopPropagation();
		});
		this.$mask.on('click.Dialog.mask', function() {
			self.close();
		});

	}
	Dialog.prototype.close = function() {
		this.$dialog.removeClass('open');
		//log('Dialog.close');	
	}
	return Dialog;
});