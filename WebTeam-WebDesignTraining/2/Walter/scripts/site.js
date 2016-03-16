$(document).ready(function() {
 
  $("#owl-carousel").owlCarousel({
  		pagination: false,
  		slideSpeed: 500,
  		items : 1,
      	itemsDesktop : [1199,1],
      	itemsDesktopSmall : [979,1]
  });

  $('#next').click(function () {
    	$('#owl-carousel').trigger('owl.next');
	});

	$('#prev').click(function () {
    	$('#owl-carousel').trigger('owl.prev');
	});
 
});