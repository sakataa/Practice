/* global Namespace, ONEbook */

'use strict';
$(document).ready(function () {
    var productStatusPage = new ONEbook.Site.ProductStatus();
    productStatusPage.Initialize();
});

Namespace.Register('ONEbook.Site.ProductStatus');
ONEbook.Site.ProductStatus = function () {
    var me = this;
    var cachedDOM = {
        toolTip: null
    };

    // Cache DOM elements for later uses.
    var cacheElements = function () {
        cachedDOM.toolTip = $('[data-toggle="tooltip"]');
    };

    var loadTooltip = function () {
        cachedDOM.toolTip.tooltip();
    };

    var collapseGroup = function () {
        var panelHeading = $('.panel-heading a');

        panelHeading.on('click', function () {
            var $this = $(this),
			    panelBody = $this.parents('.panel').find('.panel-body');
			if(panelBody.hasClass('first-body')) {
				if ($this.hasClass('active')) {
					$this.removeClass('active').find('span').removeClass('mdi-content-add-circle').addClass('mdi-content-remove-circle');
				} else {
					$this.addClass('active').find('span').addClass('active mdi-content-add-circle').removeClass('mdi-content-remove-circle');
				}
			} else {
				if ($this.hasClass('active')) {
					$this.removeClass('active').find('span').removeClass('mdi-content-remove-circle').addClass('mdi-content-add-circle');
				} else {
					$this.addClass('active').find('span').addClass('active mdi-content-remove-circle').removeClass('mdi-content-add-circle');
				}
			}
			
            panelBody.slideToggle('fast');
        });
    };

    me.Initialize = function () {
        cacheElements();
        loadTooltip();
        collapseGroup();
    };
};