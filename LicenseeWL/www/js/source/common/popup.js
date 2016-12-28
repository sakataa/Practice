define(['jquery', 'components/jquery.flatpopup'], function ($) {
    "use strict";

    function onClosePopupWithIframe(){
        $("#popupFrame").attr('src', "about:blank");
    }

    var _me = {
        openPopup: function (element, option) {
            return $(element).flatPopup(option);
        },

        openPopupWithIframe: function (url, option) {
            var $popUp = $("#" + option.id);
            if ($popUp.length > 0) {
                $("#popupFrame").attr('src', url);
            } else {
                $popUp = $('<div id="' + option.id + '" class="popup-frame"><iframe id="popupFrame" src="' + url + '" ></iframe></div>');
            }

            if(!option.onClose){
                option.onClose = onClosePopupWithIframe;
            }

            return $popUp.flatPopup(option);
        },

        updateCurrentPopup: function (url, option) {
            var $popUp;
            var $frame = parent.$("#popupFrame");
            if (option.id) {
                $popUp = $("#" + option.id);
            }

            if (!$popUp || $popUp.length === 0) {
                $popUp = $frame.closest(".popup-frame");
                option.id = $popUp.attr('id');
            }

            if ($popUp.length === 0) {
                return;
            }

            if (url && url !== '') {
                $frame.attr('src', url);
            }

            if (option.title !== "") {
                $popUp.find(".txt-title").html(option.title);
            }

            if(!option.onClose){
                option.onClose = onClosePopupWithIframe;
            }

            return $popUp.flatPopup(option);
        }
    };

    return _me;
});