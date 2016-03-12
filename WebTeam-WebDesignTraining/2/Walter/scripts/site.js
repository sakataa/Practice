$(document).ready(function() {
 
  $("#owl-carousel").owlCarousel({
  		pagination: false,
  		slideSpeed: 500,
  		items : 2,
      	itemsDesktop : [1199,2],
      	itemsDesktopSmall : [979,2]
  });

  $('#next').click(function () {
    	$('#owl-carousel').trigger('owl.next');
	});

	$('#prev').click(function () {
    	$('#owl-carousel').trigger('owl.prev');
	});
 
});