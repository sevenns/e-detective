		var welcome, overlay, solveBlock, solveWindow, task;
		function init()
		{
			//alert("init");
			welcome=$("#welcome");
			solveWindow=$("#solveWindow");
			solveBlock=$("#solve");
			solveWindow.detach();
			overlay=$("#overlay");
			overlay.append(welcome);
			task=new LogicTask({story:"picture"});
		}
		function hideWelcome()
		{
			welcome.detach();
			//overlay.append(solve);
			overlay.fadeOut(400);
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
			}, 800);
			return false;
		});
	});
});