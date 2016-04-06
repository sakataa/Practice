(function(){
	var headerHeight = $("header").outerHeight(true);
	$(window).scroll(function(){
		var currentHeight = $(this).scrollTop();
		if(currentHeight > 0){
			$('#btnMoveTop').fadeIn(1000);

			if(currentHeight > headerHeight + 20){
				$('#menu').addClass("fixed-top");
			}
			else{
				$('#menu').removeClass("fixed-top");
			}
		}
		else{
			$('#btnMoveTop').fadeOut(2000);
			$('#menu').removeClass("fixed-top");
		}
	});

	$('#btnMoveTop').click(function(){
		$(window).scrollTop(0);
	});

})();