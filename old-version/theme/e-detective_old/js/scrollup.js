jQuery( document ).ready(function() {
	var top_show = 150;
	var delay = 500;
	$(document).ready(function() {
		$(window).scroll(function () {
			if ($(this).scrollTop() > top_show)
				$('div#independent-block').fadeIn();
			else
				$('div#independent-block').fadeOut();
		});
		$('div#independent-block').click(function () {
			$('body, html').animate({
				scrollTop: 0
			}, delay);
		});
	});
});