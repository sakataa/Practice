(function(){
	$(window).scroll(function(){
		var currentHeight = $(this).scrollTop();
		if(currentHeight > 0){
			$('#btnMoveTop').show();
		}
		else{
			$('#btnMoveTop').hide();
		}
	});

	$('.product-img').hover(function(){
		$(this).parent()
			.find('.block-action').css('display', 'block');
	});

	$('.block-action').mouseout(function(){
		$(this).css('display', 'none');
	});

})();