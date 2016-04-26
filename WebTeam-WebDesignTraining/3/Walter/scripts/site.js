(function(){
	$(".navbar__item--notification").click(function(){
		$(this).parent().find(".block__notification").toggle();
	});
	
	$(".navbar__item--notification").blur(function(){
		$(this).parent().find(".block__notification").hide();
	});
	
	$(".menu--item-main").click(function(){
		var element = $(this);
		var isActive = element.hasClass("menu-active");
		
		$(".menu--item-icon-expand")
			.removeClass("fa-angle-down")
			.addClass("fa-angle-right");
			
		if(!isActive){
			element.find(".menu--item-icon-expand")
			.removeClass("fa-angle-right")
			.addClass("fa-angle-down");
		}
		
		$(".menu--item-main").removeClass("menu-active");
		element.toggleClass("menu-active", !isActive);
	});
	
	$("#menu-toggle").click(function(){
		$(".block__nav--menu").toggle();
	});
	
	$(".chkTodo").change(function(){
		var checkBox = $(this);
		var isChecked = checkBox.prop("checked");
		
		if(isChecked === true){
			checkBox.parent().addClass("article__content--item-checked");
		}
		else{
			checkBox.parent().removeClass("article__content--item-checked");
		}
	});
	
	$("#topMoving").click(function(){
		$(window).scrollTop(0);
	});
})();