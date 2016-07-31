$(document).ready(function(){
	$('.full-picture-btn').click(function(){
		$('.full-picture').fadeIn(500);
	});
	$('.full-picture').click(function(){
		$(this).fadeOut(500);
	});
});