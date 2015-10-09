jQuery( document ).ready(function() {
	var top_show = 500;
	var delay = 200;
	$(document).ready(function() {
		$(window).scroll(function () {
			if ($(this).scrollTop() > top_show)
				$('div[class*=go-up]').stop().animate({
					left: "0"
				}, delay);
			else
				$('div[class*=go-up]').stop().animate({
					left: "-100px"
				}, delay);
		});
		$('div[class*=go-up]').click(function () {
			$('body, html').stop().animate({
				scrollTop: 0
			}, delay);
		});
	});
});