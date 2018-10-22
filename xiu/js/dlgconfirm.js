//阻止需要确认的表单的回车键提交
$(function() {
	$('form').submit(function(evt) {
		var confirm = $(this).data('confirm') || false;
		var result = (confirm == false || $(this).data('confirmed') == true);
		if (!result) {
			$(confirm).modal('show');
		}
		return result;
	});
	$('[data-submit]').click(function(evt) {
		$(this).parents('form').data('confirmed', true).submit();
		return true;
	});
});