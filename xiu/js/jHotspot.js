(function($) {
	$.fn.hotspot = function(options) {
		var me = $(this);
		options = $.extend({
					tip : '.hottip'
				}, options);
		var bindHotspot = function(i, e) {
			var me = $(e);
			var parent = me.parent();
			var tip = me.next(options.tip);
			tip.css('visibility', 'visible');
			tip.hide();
			me.fadeOut(100);
			parent.mousemove(function() {
						me.stop().clearQueue().fadeTo(100, 0.6).delay(2000)
								.fadeOut(200);
						tip.fadeOut(200);
					});
			me.mousemove(function(evt) {
						evt.stopPropagation();
						me.stop().clearQueue().fadeTo(50, 1);
					});
			me.hover(function(evt) {
						var left = me.position().left + me.width();
						console.log(tip.width());

						if (left > parent.width() - 210) {
							left = me.position().left - 205;
						}
						tip.css({
									top : me.position().top,
									left : left
								});
						me.fadeTo(50, 1);
						tip.stop().clearQueue().fadeTo(100, 0.6);
					});

			me.hover(function(evt) {
						me.fadeTo(50, 0);
					}, function(evt) {
					});
			return;
			// 鼠标悬停在提示上时
			me.next(options.tip).mousemove(function(evt) {
						// 阻止容器事件
						evt.stopPropagation();
					}).hover(function(evt) {
						evt.stopPropagation();
						me.stop().clearQueue().fadeTo(50, 1);
						me.next(options.tip).stop().clearQueue()
								.fadeTo(50, 0.6);
					}, function(evt) {
						evt.stopPropagation();
						me.next(options.tip).fadeOut(150);
					}).hide();
			me.parent().mousemove(function(event) {
						// 显示热点
						me.stop().clearQueue().fadeTo(50, 0.6).delay(1000)
								.fadeOut(50);
					});
			me.mousemove(function(evt) {
				evt.stopPropagation();
					// evt.preventDefault();
				});
			me.hover(function(evt) {// 绑定热点事件
						evt.stopPropagation();
						me.next(options.tip).css({
									top : me.position().top,
									left : me.position().left + me.width()
								});
						me.stop().clearQueue();
						me.next(options.tip).stop().clearQueue().fadeTo(100,
								0.6, function() {
									me.fadeTo(50, 1)
								});
					}, function(evt) {
						evt.stopPropagation();
						me.stop().delay(800).fadeOut(150).next(options.tip)
								.delay(500).fadeOut(150);
					}).fadeOut();
		};
		return me.each(bindHotspot);
	};
})(jQuery);