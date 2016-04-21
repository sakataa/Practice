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

	var $productList = $('#productList');
	registerSlick($productList, 4, "#prevMainProduct", "#nextMainProduct");

	var $popularProducts = $('#popularProductList');
	registerSlick($popularProducts, 3, "#prevPopularProduct", "#nextPopularProduct");

	var $recentPost = $('#recentPost');
	registerSlick($recentPost, 2, "#prevPost", "#nextPost");

	var $ourBrandList = $('#ourBrandList');
	registerSlick($ourBrandList, 6, "#prevBrand", "#nextBrand");

	function registerSlick($element, slideToShow, idPrev, idNext){
		$element.slick({
		  	infinite: true,
		  	slidesToShow: slideToShow,
		  	slidesToScroll: 1,
		  	prevArrow: idPrev,
	        nextArrow: idNext
		});
	}

})();