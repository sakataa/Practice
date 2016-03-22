$(document).ready(function() {
  initCarouselPlugin("owl-carousel", "prev", "next");
  initCarouselPlugin("owl-carousel-aboutTeam", "photoPrev", "photoNext");
  initEvent();
  

  function initCarouselPlugin(idElement, idPrev, idNext){
    $('#' + idElement).owlCarousel({
        pagination: false,
        slideSpeed: 500,
        itemsDesktop : [2560,1],
        itemsDesktopSmall : [979,1],
        itemsTablet: [768, 1]
    });

    $('#' + idPrev).click(function () {
        $('#' + idElement).trigger('owl.prev');
    });

    $('#' + idNext).click(function () {
        $('#' + idElement).trigger('owl.next');
    });   
  }

  function initEvent(){
    $(window).scroll(function() {    
        var scroll = $(window).scrollTop();    
        if (scroll > 60) {
            $("#headerNavbar").addClass("fixed-top");
        }
        else {
             $("#headerNavbar").removeClass("fixed-top");
        }
            
    });
  }
 
});