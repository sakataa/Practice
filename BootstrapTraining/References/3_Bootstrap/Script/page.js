$(window).resize(function() {
    $('body').removeClass();
    $width = window.innerWidth;
    if($width > 768 && $width < 1200) {
        $('body').addClass("site-menubar-fold");
    }
    else if( $width <= 768)  {
        $('body').addClass('site-menubar-hide').addClass("site-menubar-unfold");
    }
    else {
        $('body').addClass("site-menubar-unfold");
    }
});
