$(document).ready(function() {
 
  $("#owl-carousel").owlCarousel({
  		pagination: false,
  		slideSpeed: 500,
      itemsDesktop : [2560,1],
      itemsDesktopSmall : [979,1],
      itemsTablet: [768, 1]
  });

  $('#next').click(function () {
    	$('#owl-carousel').trigger('owl.next');
	});

	$('#prev').click(function () {
    	$('#owl-carousel').trigger('owl.prev');
	});
 
});