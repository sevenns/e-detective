$(document).ready(function(){
	var menuOpened = false;

	$('.menu-icon').click(function() {
		if(!menuOpened)
		{
			$('.nav-panel').css(
				'display', 'block'
			);
			$('.nav-panel').stop().animate({
				left: "80px"
			}, 500);

			$('body').stop().animate({
				left: "365px"
			}, 500);
			menuOpened = true;
			$('.menu-icon').css(
				'color' , 'rgb(88,153,206)'
			);
		}
		else
		{
			$('.nav-panel').stop().animate({
				left: "-365px"
			}, 500);
			$('.nav-panel').css(
				'display', 'block'
			);

			$('body').stop().animate({
				left: "0"
			}, 500);
			menuOpened = false;
			$('.menu-icon').css(
				'color' , 'rgb(220,220,220)'
			);
		}
	});

	$('.menu-icon-xs').click(function() {
		var html = document.documentElement;
		if(!menuOpened)
		{
			$('.nav-panel-xs').css(
				'height', html.clientHeight-80,
				'top', -html.clientHeight-80
			);
			$('.nav-panel-xs').css(
				'top', -html.clientHeight-80
			);
			$('.nav-panel-xs').css(
				'display', 'block'
			);
			$('.nav-panel-xs').stop().animate({
				top: "80"
			}, 500);
			$('body').stop().animate({
				top: $('.nav-panel-xs').height()
			}, 500);
			menuOpened = true;
			$('.menu-icon-xs').css(
				'color' , 'rgb(88,153,206)'
			);
		}
		else
		{
			$('.nav-panel-xs').stop().animate({
				top: -$('.nav-panel-xs').height()
			}, 500);
			$('body').stop().animate({
				top: "0"
			}, 500);
			menuOpened = false;
			$('.menu-icon-xs').css(
				'color' , 'rgb(220,220,220)'
			);
		}
	});
});