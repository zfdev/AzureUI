//TODO: Need to refactor.
//Accordian Menu
define(['jquery', 'AX'], function($, AX){
	'use strict';
	var log = AX.Util.log;
	var AccordianMenu = AX.Base.extend({
		defaults: {
			$container: null,
			expand: -1,
			enable: true
		},
		init: function(oConfig){
			this._config = $.extend({}, this.defaults, oConfig);
			var $container = this.get('$container');
			if($container === null){
				return;	
			}
			if(!$container.hasClass('accordian-menu')){
				$container.addClass('accordian-menu');
			}
			this.set('$allTitle', $container.children('li').children('.menu-title'));
			this.set('interaction', $container.data('accordianinteraction'));
			this.bind();
			this.render();
		},
		update: function(){
			var sDevice = $('html').data('device');
			var oController = this.get('$container').data('accordiandisabled');
			if(oController){
				var aController = oController.split('|');
				//log(aController);
				for(var i=0; i<aController.length; i++){				
					if(sDevice === aController[i]){
						this.set('enable', false);
						break;
					}else{
						this.set('enable', true);
					}
				}								
			}			
		},
		reset: function(){
			this.get('$allTitle').each(function(){
				if($(this).hasClass('expand')){
					$(this).removeClass('expand');
					$(this).next('.menu-child').slideUp();				
				}
			});
		},
		collapse: function(oEvent){
			oEvent.data.update();
			if(!oEvent.data.get('enable')){
				return;	
			}
			if(oEvent.data.get('interaction') === 'exclusive'){				
				if($(this).hasClass('expand')){
					oEvent.data.reset();				
				}else{
					oEvent.data.reset();
					$(this).addClass('expand');
					$(this).next('.menu-child').stop(true, true).slideDown();		
				}
			}else{
				oEvent.data.toggleClass($(this));					
			}		
			return false;
		},
		toggleClass: function($menuTitle){
			if($menuTitle.hasClass('expand')){
				$menuTitle.removeClass('expand');
				$menuTitle.next('.menu-child').stop(true, true).slideUp();
			}else{
				$menuTitle.addClass('expand');	
				$menuTitle.next('.menu-child').stop(true, true).slideDown();
			}				
		},
		expandByIndex: function(nIndex){
			if(nIndex < 0){
				return;
			}
			this.get('$allTitle').removeClass('expand').eq(nIndex).addClass('expand');
			this.render();
		},
		bind: function(){
			var self = this;
			this.get('$container').off('click.AccordianMenu').on('click.AccordianMenu', '.menu-title', self, self.collapse);
		}, 
		render: function(){
			this.update();
			if(!this.get('enable')){
				return;	
			}
			this.get('$allTitle').each(function(){
				if($(this).hasClass('expand')){
					$(this).next('.menu-child').slideDown();		
				}else{
					$(this).next('.menu-child').slideUp();
				}
			});
		}
	});
	return AccordianMenu;
});