(function(){
	$(".navbar__item--notification").click(function(){
		$(this).parent().find(".block__notification").toggle();
	});
	
	$(".navbar__item--notification").blur(function(){
		$(this).parent().find(".block__notification").hide();
	});
	
	$(".menu--item-main").click(function(){
		var element = $(this);
		var parent = element.parent();
		var isActive = parent.hasClass("menu-active");
		var subMenu = parent.find(".submenu-content-main");
		
		$(".menu--item-icon-expand")
			.removeClass("fa-angle-down")
			.addClass("fa-angle-right");
			
		$(".menu--item-main").parent().removeClass("menu-active");
		$(".submenu-content-main").css({"max-height": "0px"});
		
		if(!isActive){
			element.find(".menu--item-icon-expand")
			.removeClass("fa-angle-right")
			.addClass("fa-angle-down");
			
			var itemHeight = 35;
			var itemSubmenu = subMenu.find("li");
			var height = itemSubmenu.length * itemHeight;
			subMenu.css({"max-height": height + "px"});
		}
		parent.toggleClass("menu-active", !isActive);		
	});
	
	$("#menu-toggle").click(function(){
		var mainMenu = $(".block__nav--menu");
		mainMenu.toggleClass("toggleMainMenu");	
		$("#mainContent").toggleClass("mainpage--container-fullwidth");		
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