		var welcome, overlay, solveBlock, solveWindow, task;
		function init()
		{
			//alert("init");
			solveWindow=$("#solveWindow");
			solveBlock=$("#solve");
			solveWindow.detach();
			overlay=$("#overlay");
			task=new LogicTask({story:"picture"});
		}
		function hideWelcome()
		{
			welcome.detach();
			//overlay.append(solve);
			overlay.fadeOut(200);
		}
		function solveButton()
		{
			$("body").append(solveWindow);
			solveBlock.append("<p>Идёт расследование...</p>");
			overlay.fadeIn(400);
			setTimeout(task.solve,1000);
		}
		function closeSolution()
		{
			overlay.fadeOut(400);
			solveBlock.text("");
			solveWindow.detach();
		}
		$(document).ready(init);

$(document).ready(function(){
    $(function (){
		$(".check").click(function (){
			$("body,html").animate({
				scrollTop:0
			}, 200);
			return false;
		});
	});
});

var setFullHeight = function(){
	var html = document.documentElement;
	$('#picture').css(
		'height', html.clientHeight-141
	);
	$('.workplace').css(
		'height', html.clientHeight-141
	);
	$('.sidebar').css(
		'height', html.clientHeight
	);
	$('.nav-panel').css(
		'height', html.clientHeight
	);
};

$(window).resize(setFullHeight);
$(document).ready(setFullHeight);