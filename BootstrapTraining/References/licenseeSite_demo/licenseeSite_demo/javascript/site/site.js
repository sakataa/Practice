/* global Namespace, ONEbook */

'use strict';
$(document).ready(function () {
    var htmlRules = new ONEbook.Site.Genaral();

    htmlRules.Initialize();
});

Namespace.Register('ONEbook.Site.Genaral');
ONEbook.Site.Genaral = function () {
    var me = this;
    var cachedDOM = {
        leftPanel: null,
        iconSubmenu: null,
        boxExpand: null,
        rightPanel: null,
        menu: null,
        tooltip: null
    };

    // Cache DOM elements for later uses.
    var cacheElements = function () {
        cachedDOM.leftPanel = $('.scroll-bar');
        cachedDOM.iconSubmenu = $('.icon-submenu');
        cachedDOM.boxExpand = $('.colExp');
        cachedDOM.rightPanel = $('.right-panel');
        cachedDOM.menu = $('.menu');
        cachedDOM.tooltip = $('[data-toggle="tooltip"]');
    };

    var loadScrollbar = function () {
        cachedDOM.leftPanel.slimScroll({
            width: 'auto',
            height: '100%',
            size: '8px',
            position: 'right',
            color: '#ccc',
            railColor: '#f5f5f5',
            railOpacity: 0.2,
            wheelStep: 20
        });
    };

    var registerEvent = function () {
        showSubmenuCollapse();
        showSubmenu();
        showTooltip();
        collapseLeftPanel();
    }

    var showSubmenu = function () {
        cachedDOM.iconSubmenu.on('click', function (event) {
            var $this = $(this),
                menu = $this.parents('.menu'),
                submenu = $this.parents('.menu').children('.submenu');

            if ($this.hasClass('active')) {
                $this.addClass('mdi-hardware-keyboard-arrow-down').removeClass('active mdi-hardware-keyboard-arrow-up');
                menu.removeClass('active');
                submenu.slideToggle('fast');
            } else {
                $this.removeClass('mdi-hardware-keyboard-arrow-down').addClass('active mdi-hardware-keyboard-arrow-up');
                menu.addClass('active');
                submenu.slideToggle('fast');
            }

            event.stopPropagation();
            return false;
        });
    }

    var showSubmenuCollapse = function () {
        cachedDOM.menu.on('click', function (event) {
            var $this = $(this),
                submenu = $this.children('.submenu');
            //submenu.hide();
            //submenu.stop().toggle();
            submenu.slideToggle('fast');
            //setTimeout("$('.submenu').hide();", 5000);

        });
    }

    var collapseLeftPanel = function () {
        cachedDOM.boxExpand.on('click', function (event) {
            var $this = $(this);
            var leftPanel = $('#left-panel');
            var rightPanel = $('#right-panel');
            if (leftPanel.hasClass('collapse-left-panel')) {
                leftPanel.removeClass('collapse-left-panel');
                rightPanel.removeClass('expand-right-panel');
            }
            else {
                leftPanel.addClass('collapse-left-panel');
                rightPanel.addClass('expand-right-panel');
            }

        });
    };

    var showTooltip = function () {
        cachedDOM.tooltip.tooltip();
    }

    me.Initialize = function () {
        cacheElements();
        loadScrollbar();
        registerEvent();
    };
};