(function(){
	$(".chkTodo").change(function(){
		var checkBox = $(this);
		var isChecked = checkBox.prop("checked");
		
		if(isChecked === true){
			checkBox.parent().addClass("item-checked");
		}
		else{
			checkBox.parent().removeClass("item-checked");
		}
	});
})();