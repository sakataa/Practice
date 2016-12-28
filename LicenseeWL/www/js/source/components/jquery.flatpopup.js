"use strict";
define(['jquery'], function ($) {
    var $blockBody;

    var _methods = {
        init: function (options) {
            var defaultOptions = {
                width: 640,
                height: 480,
                id: "popup-content",
                title: "&nbsp;",
                container: "body",
                modal: true,
                onOpen: null,
                onClose: null
            };

            $blockBody = $(".popup-block-body");
            options = $.extend(defaultOptions, options || {});
            return this.each(function () {
                var $self = $(this);
                $self.addClass("flat-popup");

                var $container = $(options.container);

                if (options.modal && $blockBody.length === 0) {
                    $blockBody = $('<div class="popup-block-body" style="display: none"></div>');
                    $container.append($blockBody);
                }

                var isNew = $container.find("#" + options.id).length === 0;
                if (isNew) {
                    $self.attr("id", options.id);
                    $self.children().wrapAll("<div class='wrapContent'></div>");
                    $self.hide()
                         .prepend('<div class="title-bar popup-title"><div class="txt-title">' + options.title + '</div><a class="popup-close" href="javascript:;"><i class="icon-close"></i></a></div>')

                    $self.find('a.popup-close').on('click', function () {
                        if (options.onClose) {
                            options.onClose.apply($self);
                        }

                        _methods.hide.apply($self);
                    });

                    $container.append($self);
                }

                $self.width(options.width);
                $self.height(options.height);

                if (options.onOpen) {
                    options.onOpen.apply($self);
                }

                _methods.show.call($self, options.modal);
            });
        },

        show: function (modal) {
            var $self = this;
            //Set the center alignment padding + border see css style
            var left = ($(window).width() - $self.width()) / 2;
            var top = ($(window).height() - $self.height()) / 2;

            $self.css({
                'top': top + "px",
                'left': left + "px"
            });

            if (modal) {
                $blockBody.show();
            }

            $self.fadeIn(300);
        },

        hide: function () {
            $(this).fadeOut(300);
            $blockBody.hide();
            return false;
        }
    }

    $.fn.flatPopup = function (methodOrOptions) {
        if (_methods[methodOrOptions]) {
            return _methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return _methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.flatPopup');
        }
    };
});