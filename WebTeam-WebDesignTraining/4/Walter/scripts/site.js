(function(){
	$(".chkTodo").change(function(){
		var checkBox = $(this);
		var isChecked = checkBox.prop("checked");
		
		checkBox.parent().toggleClass("item-checked", isChecked);
	});

	$("#topMoving").click(function(){
		$(window).scrollTop(0);
	});
})();