$(function () {
    $(".categories-menu .btn-toggle").click(function () {
        var $btn = $(this);
        var isActive = $btn.hasClass("active");
        var toggleIcons = $btn.data("toggle-icons").split(",");

        if (isActive) {
            $(".categories-items.collapse").slideUp();
            $btn.removeClass("active");
            $btn.find("." + toggleIcons[1]).removeClass(toggleIcons[1]).addClass(toggleIcons[0]);
        } else {
            $(".categories-items.collapse").slideDown();
            $btn.addClass("active");
            $btn.find("." + toggleIcons[0]).removeClass(toggleIcons[0]).addClass(toggleIcons[1]);
        }
    });
});
