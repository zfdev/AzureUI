(function() {
    if (!window.require) {
        window.require = {
            config: function(config) {
                window.require = config;
            }
        };
    }

    require.config({
        baseUrl: './scripts',
        paths: {
        	//JQuery
        	jquery: ['//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.12.3.min', 'lib/jquery-1.12.3.min'],
        	
        	//Azure script libray	
        	AX: 'lib/azurex',
        	                	
        	//Common
        	Common: 'modules/common',
        	
        	//Modules
        	//UI Component
        	//Accordian menu
        	AccordianMenu: 'modules/accordian-menu',        	
        	//Documentation left navigation
        	DocLeftNav: 'modules/documentation-left-navigation',
        	//Documentation right bookmark
        	DocRightBookmark: 'modules/documentation-right-bookmark',
        	//Layout
        	Layout: 'modules/layout',
        	//Scroll to fixed
        	ScrollToFixed: 'modules/scroll-to-fixed',
        	//External link
        	IsExternalLink: 'modules/is-external-link',
        	//Bread crumb
        	BreadCrumb: 'modules/bread-crumb',
        	//Screen test
        	ScreenTest: 'modules/screen-test',
        	//Dialog
        	Dialog: 'modules/dialog',
        	//Tab
        	Tab: 'modules/tab',
        	//Panel
        	//Auto scroll
        	AutoScroll: 'modules/auto-scroll',
        	//Auto height
        	AutoHeight: 'modules/auto-height',
        	
        	//Plugin
        	FastClick: 'plugins/fastclick/fastclick.min',
        	Easing: 'plugins/easing/jquery.easing.1.3.min',
        	Highlight: ['//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.4.0/highlight.min','plugins/highlight/highlight.min']
        },
        shim: {
        	'Easing': {
        		deps: ['jquery'],
        		exports: 'Easing'
        	}
        }
    });
}());