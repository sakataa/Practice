/* global Namespace, ONEbook */

'use strict';
$(document).ready(function () {
    var siteInfoPage = new ONEbook.Site.SiteInfo();
    siteInfoPage.Initialize();
});

Namespace.Register('ONEbook.Site.SiteInfo');
ONEbook.Site.SiteInfo = function () {
    var me = this;
    var cachedDOM = {
        messageType: {
            warning: 0,
            error: 1,
            info: 2
        },
        dpkDate: null
    };

    // Cache DOM elements for later uses.
    var cacheElements = function () {
        cachedDOM.dpkDate = $('.txt-date');
    };

    var initializeDateRange = function () {
        cachedDOM.dpkDate.datetimepicker({
            defaultDate: new Date(),
            pickTime: false,
            useCurrent: false
        });
    }

    me.Initialize = function () {
        cacheElements();
        initializeDateRange();
    };
};