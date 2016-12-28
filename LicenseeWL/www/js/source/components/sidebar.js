'use strict';

define(["jquery"], function ($) {
    function activeMenuItem($target) {
        $(this).find('.collapsible-body li.active').removeClass('active');
        $target.closest('li').addClass('active');
        var $groupHeader = $target.closest('.menu-item').find('.collapsible-header');
        if ($groupHeader.hasClass('active') === false) {
            $groupHeader.trigger("click");
        }
    }

    function init (options) {
        var defaults = {
            accordion: undefined
        };

        options = $.extend(defaults, options);
        var touch = 'ontouchstart' in window || navigator.maxTouchPoints;

        return this.each(function () {

            var $this = $(this);

            if (!$this.parent().hasClass('site-menu')) return;

            var $panel_headers = $(this).find('> li > .collapsible-header');

            var collapsible_type = $this.data("collapsible");
            var menu = {};

            // Turn off any existing event handlers
            $this.off('click.collapse2', '> li > .collapsible-header');
            $panel_headers.off('click.collapse2');

            /****************
            Helper Functions
            ****************/

            // Accordion Open
            function accordionOpen(object) {
                $panel_headers = $this.find('> li > .collapsible-header');
                if (object.hasClass('active')) {
                    object.parent().addClass('active');
                } else {
                    object.parent().removeClass('active');
                }
                if (object.parent().hasClass('active')) {
                    object.siblings('.collapsible-body').stop(true, false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function complete() {
                            $(this).css('height', '');
                        } });
                } else {
                    object.siblings('.collapsible-body').stop(true, false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function complete() {
                            $(this).css('height', '');
                        } });
                }

                $panel_headers.not(object).removeClass('active').parent().removeClass('active');
                $panel_headers.not(object).parent().children('.collapsible-body').stop(true, false).slideUp({
                    duration: 350,
                    easing: "easeOutQuart",
                    queue: false,
                    complete: function complete() {
                        $(this).css('height', '');
                    }
                });
            }

            // Expandable Open
            function expandableOpen(object) {
                if (object.hasClass('active')) {
                    object.parent().addClass('active');
                } else {
                    object.parent().removeClass('active');
                }
                if (object.parent().hasClass('active')) {
                    object.siblings('.collapsible-body').stop(true, false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function complete() {
                            $(this).css('height', '');
                        } });
                } else {
                    object.siblings('.collapsible-body').stop(true, false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function complete() {
                            $(this).css('height', '');
                        } });
                }
            }

            /**
             * Check if object is children of panel header
             * @param  {Object}  object Jquery object
             * @return {Boolean} true if it is children
             */
            function isChildrenOfPanelHeader(object) {

                var panelHeader = getPanelHeader(object);

                return panelHeader.length > 0;
            }

            /**
             * Get panel header from a children element
             * @param  {Object} object Jquery object
             * @return {Object} panel header object
             */
            function getPanelHeader(object) {

                return object.closest('li > .collapsible-header');
            }

            /*****  End Helper Functions  *****/

            function collapseWithOverlay($this, event) {

                collapse($this, event);

                if ($('#sidenav-overlay').length > 0) {

                    if (!$($this).hasClass('active')) {
                        $('#sidenav-overlay').unbind("click");
                        $('#sidenav-overlay').remove();
                    }
                } else {
                    var overlay = $('<div id="sidenav-overlay"></div>');
                    overlay.css('opacity', 0).click(function () {
                        collapse($this, event);
                        overlay.velocity({ opacity: 0 }, {
                            duration: 300, queue: false, easing: 'easeOutQuad',
                            complete: function complete() {
                                $(this).remove();
                            }
                        });
                    });
                    $('body').append(overlay);
                    overlay.velocity({ opacity: 1 }, {
                        duration: 300, queue: false, easing: 'easeOutQuad',
                        complete: function complete() {}
                    });
                }
            };

            function collapse($this, event) {
                var $header = $($this),
                    element = $(event.target);

                if (isChildrenOfPanelHeader(element)) {
                    element = getPanelHeader(element);
                }

                element.toggleClass('active');

                if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) {
                    // Handle Accordion
                    accordionOpen(element);
                } else {
                    // Handle Expandables
                    expandableOpen(element);

                    if ($header.hasClass('active')) {
                        expandableOpen($header);
                    }
                }
            };

            if (!touch) {
                $this.on('mouseover.opensub', '> li > .collapsible-header', function (e) {
                    if ($('body').hasClass('site-menubar-fold')) collapse(this, e);
                });
            }

            // Add click handler to only direct collapsible header children
            $this.on('click.collapse2', '> li > .collapsible-header', function (e) {
                return touch && $('body').hasClass('site-menubar-fold') ? collapseWithOverlay(this, e) : collapse(this, e);
            });

            if (!touch) {
                // Add focusout event
                $this.on('mouseleave.closesub', '> li > .collapsible-body', function (e) {
                    var $header = $(this),
                        element = $(e.target);
                    var temp = element.closest('li > .collapsible-body');

                    var element = temp.parent().find('.collapsible-header');

                    if ($('body').hasClass('site-menubar-fold') && element.hasClass('active')) {

                        element.toggleClass('active');

                        if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) {
                            // Handle Accordion
                            accordionOpen(element);
                        } else {
                            // Handle Expandables
                            expandableOpen(element);

                            if ($header.hasClass('active')) {
                                expandableOpen($header);
                            }
                        }
                    }
                });
            }

            //click menu event
            $this.on('click.menuevent', '> li > .collapsible-body  a', function (e) {
                var url = $(this).attr("data-url");
                $('#mainFrame').prop('src', url);

                var element = $(e.target);
                if (touch && $('body').hasClass('site-menubar-fold')) {                   
                    var temp = element.closest('li > .collapsible-body');

                    temp.parent().find('.collapsible-header').trigger("click");
                }
                activeMenuItem.call($this, element);
            });

            // Open first active
            var $panel_headers = $this.find('> li > .collapsible-header');
            if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) {
                // Handle Accordion
                accordionOpen($panel_headers.filter('.active').first());
            } else {
                // Handle Expandables
                $panel_headers.filter('.active').each(function () {
                    expandableOpen($(this));
                });
            }
        });
    };

    var methods = {
        init: init,
        activeMenuItem: activeMenuItem
    };

    $.fn.collapsibleMenu = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.collapsibleMenu');
        }
    }
});

$(document).ready(function () {
    $('.collapsible2').collapsibleMenu();
});

