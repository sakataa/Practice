(function(){
	$(window).scroll(function(){
		var currentHeight = $(this).scrollTop();
		if(currentHeight > 0){
			$('#btnMoveTop').fadeIn(1000);;
		}
		else{
			$('#btnMoveTop').fadeOut(2000);
		}
	});

	$('.product-img').hover(function(){
		//$(this).parent()
		//	.find('.block-action').css('display', 'block');
	});

	$('.block-action').mouseout(function(){
		//$(this).css('display', 'none');
	});

	$('#btnMoveTop').click(function(){
		$(window).scrollTop(0);
	});

})();