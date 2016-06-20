require(['Common', 'DocLeftNav', 'DocRightBookmark', 'Layout', 'AccordianMenu', 'BreadCrumb' , 'IsExternalLink', 'Highlight'], function(Common, DocLeftNav, DocRightBookmark, Layout, AccordianMenu, BreadCrumb, IsExternalLink, Highlight) {
	var sLayout = 'col3';
	var sLeftNavStatus = '';
	Common.init();
	Layout.init();
	$('pre code').each(function(i, block) {
    	Highlight.highlightBlock(block);
    });	
	DocLeftNav.init({
		//dataHost: 'https://wacnstoragestaging.blob.core.chinacloudapi.cn/tech-content/Content/leftnav/',
		endCallback: function(oLeftNavData) {
			var nExpandIndex = oLeftNavData.index;
			var sBreadcrumbLevel2Title = '';
			sLeftNavStatus = oLeftNavData.status;
			var oMenuConfig = {
				$container: $('.left-navigation ul')
			};
			var oAccordian = new AccordianMenu();
			oAccordian.init(oMenuConfig);
			oAccordian.expandByIndex(nExpandIndex);
			BreadCrumb.init();
//			if(nExpandIndex !== -1){
//				sBreadcrumbLevel2Title = AccordianMenu.expandByIndex(nExpandIndex).attr('title') || '';	
//			}
			IsExternalLink.init();
			console.log('Left nav load status', sLeftNavStatus);
			DocRightBookmark.init({
				endCallback: function(sRightBmStatus) {
					console.log('Right bookmark load status', sRightBmStatus);
					if (sLeftNavStatus === 'failed' && sRightBmStatus === 'success') {
						sLayout = 'col2r';	
					}
					if (sLeftNavStatus === 'success' && sRightBmStatus === 'failed') {
						sLayout = 'col2l';	
					}
					if (sLeftNavStatus === 'failed' && sRightBmStatus === 'failed') {
						sLayout = 'col1';
					}
					Layout.switchLayout(sLayout);
				}
			});
		}
	});
});