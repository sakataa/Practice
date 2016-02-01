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
        leftMenu: null,
        mainIframe: null,
        leftPanel: null,
        rightPanel: null,
        iconLeftPanel: null,
        iconNavSideLeft: null,
        navSideLeft: null,
        timeoutShowNavSideLeft: null,
        menuHorizontal: null,
        iconSubmenu: null
    };

    // Cache DOM elements for later uses.
    var cacheElements = function () {
        cachedDOM.leftPanel = $('.scroll-bar');
        cachedDOM.leftMenu = $('#left-menu > li > a');
        cachedDOM.mainIframe = $('#iframe-content > iframe');
        cachedDOM.iconLeftPanel = $('#icon-left-panel');
        cachedDOM.rightPanel = $('#right-panel');
        cachedDOM.iconNavSideLeft = $('#icon-navside-left');
        cachedDOM.navSideLeft = $('#navside-left');
        cachedDOM.menuHorizontal = $('.menu-horizontal li a');
        cachedDOM.iconSubmenu = $('.icon-submenu');
    };

    var loadIframe = function () {

        cachedDOM.leftMenu.on('click', function (e) {
            var $this = $(this);
            cachedDOM.mainIframe.attr('src', $(this).attr('href'));
        });

        cachedDOM.menuHorizontal.on('click', function (e) {
            var $this = $(this);
            cachedDOM.menuHorizontal.parent().removeClass('active');
            $this.parent().addClass('active');
            cachedDOM.mainIframe.attr('src', $(this).attr('href'));
        });
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
        collapseLeftPanel();
        showNavsideLeft();
        $('body').on('click', function () {
            hideLeftPanel();
        });
    };

    var collapseLeftPanel = function () {
        cachedDOM.iconLeftPanel.on('click', function () {
            var $this = $(this),
                breadcrumb = $this.parents('#left-panel').siblings('#right-panel').children('#iframe-content').contents().find('.breadcrumb');
            if ($this.hasClass('active')) {
                $this.removeClass('active mdi-editor-format-indent-increase');
                cachedDOM.iconLeftPanel.parents('#left-panel').removeClass('collapse-left-panel');
                cachedDOM.rightPanel.removeClass('expand-right');
                breadcrumb.removeClass('collapse-left-panel');
            } else {
                $this.addClass('active mdi-editor-format-indent-increase');
                cachedDOM.iconLeftPanel.parents('#left-panel').addClass('collapse-left-panel');
                cachedDOM.rightPanel.addClass('expand-right');
                breadcrumb.addClass('collapse-left-panel');
                $('#childframe').contents().find('#child_text_input').val()
            }
        });
    };

    var showNavsideLeft = function () {
        cachedDOM.iconNavSideLeft.on('click', function (event) {
            $('body').prepend('<div class="blockUI"></div>');
            var $this = $(this);
            if ($this.hasClass('active')) {
                $this.removeClass('active');
                cachedDOM.navSideLeft.removeClass('visible-left-panel');
                $('.blockUI').remove();
            } else {
                $this.addClass('active');
                cachedDOM.navSideLeft.addClass('visible-left-panel');
            }

            event.stopPropagation();
        });

        cachedDOM.navSideLeft.on('mouseleave', function () {
            cachedDOM.timeoutShowNavSideLeft = setTimeout(function () { hideLeftPanel(); }, 1000);
        });

        cachedDOM.navSideLeft.on('mouseenter', function () {
            clearTimeout(cachedDOM.timeoutShowNavSideLeft);
        });
    };

    var hideLeftPanel = function () {
        cachedDOM.iconNavSideLeft.removeClass('active');
        cachedDOM.navSideLeft.removeClass('visible-left-panel');
        $('.blockUI').remove();
    };

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

    me.Initialize = function () {
        cacheElements();
        loadIframe();
        loadScrollbar();
        registerEvent();
        showSubmenu();
    };
};