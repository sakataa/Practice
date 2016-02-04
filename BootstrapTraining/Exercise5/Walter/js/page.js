$(document).ready(function(){
	$('#menu-toggle').click(function(){
		var leftPanel = $('#left-panel');
		var headerLeft = $('#header-left');
		var rightPanel = $('.right-side');

		$('.wrapper').toggleClass('expand');
	});
});