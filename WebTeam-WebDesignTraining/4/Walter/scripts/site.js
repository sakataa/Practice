(function(){
	$(".chkTodo").change(function(){
		var checkBox = $(this);
		var isChecked = checkBox.prop("checked");
		
		checkBox.parent().toggleClass("item-checked", isChecked);
	});

	$("#topMoving").click(function(){
		$(window).scrollTop(0);
	});

	$(".menu__item").click(function(){
		var element = $(this);
		var isActive = element.attr("aria-expanded") === "false";
		
		var iconExpand = element.find(".menu__item--icon-expand");
		if(isActive === true){
			iconExpand.removeClass("fa-angle-right").addClass("fa-angle-down");			
		}
		else{
			iconExpand.removeClass("fa-angle-down").addClass("fa-angle-right");
		}		
	});
})();