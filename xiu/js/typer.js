(function($) {
	$.fn.extend({
		typer : function(options) {
			// console.log(this.size());
			return this.each(function() {
				var tags = /(<\/?\w+(?:(?:\s+\w+(?:\s*=\s*(?:".*?"|'.*?'|[^'">\s]+))?)+\s*|\s*)\/?>)/gim;
				var el = $(this);
				var html = el.html();
				el.html('');
				var setting = $.extend({}, {
							cursor : '_',
							delay : 90,
							splash : true
						}, options);
				var nextPos = function(num, str) {
					if (num > str.length)
						return str.length;
					var ch = str.charAt(num);
					if (ch != 0 && "<&".indexOf(ch) > -1) {
						while (((str.charAt(num) != '>' && ch == '<') || (str
								.charAt(num) != ';' && ch == '&'))
								&& num < str.length) {
							++num;
						}
						++num;
						num = nextPos(num, str)
					}
					return num;
				};
				var step = function(num, show) {
					num = nextPos(num, html);
					// console.log(num);
					var chtml = html.slice(0, num);// 取前一段
					var mark = setting.cursor;
					var ch = html.charAt(num);
					if (setting.splash
							&& (ch == ' ' || ch == '\n' || ch == '\t')) {
						if (show) {
							mark = setting.cursor;
						} else {
							mark = ' ';
						}
					}
					// chtml += mark;
					// console.log(chtml);
					var aphtml = html.slice(num);// 取后一段
					++num;
					var tmp = aphtml.split(tags);// 过滤非标签
					aphtml = '';
					for (var i = 0; i < tmp.length; ++i) {
						if (tmp[i].charAt(0) == '<')
							aphtml += tmp[i];
					}
					el.html(chtml + mark + '<b style="color:transparent;">_<b>'
							+ aphtml);
					// console.log(el.html());
					if (num < html.length) {
						setTimeout(function() {
									step(num, !show);
								}, setting.delay);
					} else {
						el.html(html);
						el.trigger('typerEnd', [el]);
						//console.log('---');
					}
					// console.log(el.html());
				};
				step(0, true);
			});

			// console.log(this);
		}
	});
})(jQuery);