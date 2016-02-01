/* global Namespace, ONEbook */

'use strict';
$(document).ready(function () {
    var favorites = new ONEbook.Site.Favorites();

    favorites.Initialize();
});

Namespace.Register('ONEbook.Site.Favorites');
ONEbook.Site.Favorites = function () {
    var me = this;
    var cachedDOM = {
        favoriteCol: null
    };

    // Cache DOM elements for later uses.
    var cacheElements = function () {
        cachedDOM.favoriteCol = $('.list-favorrite');
    };

    var loadScrollbar = function () {
        cachedDOM.favoriteCol.slimScroll({
            height: '250px',
            size: '8px',
            position: 'right',
            color: '#ccc',
            railColor: '#f5f5f5',
            railOpacity: 0.2,
            wheelStep: 20
        });
    };
    
    me.Initialize = function () {
        cacheElements();
        loadScrollbar();
    };
};