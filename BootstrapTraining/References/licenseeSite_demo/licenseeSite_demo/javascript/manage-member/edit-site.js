/* global Namespace, ONEbook */

'use strict';
$(document).ready(function () {
    var editSitePage = new ONEbook.Site.EditSite();
    editSitePage.Initialize();
});

Namespace.Register('ONEbook.Site.EditSite');
ONEbook.Site.EditSite = function () {
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

    var alertMessage = function (messageType, messageText, timeOut) {
        var $message = $('#messageNotification');
        var $body = $('body');
        if ($message.length === 0) {
            $message = $('<div id="alert-message" class="alert message-popup" style="display:none;"> \
                            <a href="#" class="close" data-dismiss="alert">&times;</a>\
                            <div class="alert-message-content"></div>\
                        <div>').appendTo($body);
        }
        var $messageContent = $message.find('.alert-message-content');
        //timeOut = timeOut;
        switch (messageType) {
            case cachedDOM.messageType.warning:
                $message.addClass('alert-warning').removeClass('alert-danger').removeClass('alert-success');
                break;
            case cachedDOM.messageType.error:
                $message.addClass('alert-danger').removeClass('alert-warning').removeClass('alert-success');
                timeOut = 5000;
                break;
            case cachedDOM.messageType.info:
                $message.addClass('alert-success').removeClass('alert-danger').removeClass('alert-warning');
                break;
        }

        $messageContent.empty().html(messageText).alert();
        $message.show();
        if (timeOut) {
            var timeOutId = setTimeout(function () {
                //$message.hide();
                $messageContent.alert('close');
                clearTimeout(timeOutId);
            }, timeOut);
        }
    }
    
    var initializeDateRange = function () {
        cachedDOM.dpkDate.datetimepicker({
            defaultDate: new Date(),
            pickTime: false,
            useCurrent: false
        });
    }

    var initializePopupMessage = function ()  {
        alertMessage(0, "There was a problem with your network connection.");
    }

    me.Initialize = function () {
        cacheElements();
        initializeDateRange();
        initializePopupMessage();
    };
};