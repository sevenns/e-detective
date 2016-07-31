var welcome, overlay, solveBlock, solveWindow, task,
		html = document.documentElement;

$(document).ready(function() {
	init();

	setCustomScroll($('#picture'), '5px', '#696969');
	setCustomScroll($('.workplace-tab'), '5px', 'html.clientHeight-120',
																															'#696969');
	setCustomScroll($('.control-panel'), '3px', '#d9d9d9');

	//Workplace tabs
	$('.workplace-caption li').hover(function(event) {
		event.preventDefault();
		$('.workplace-caption .active').removeClass('active');
		$(this).addClass('active');
		var tab = $(this).attr('target');
		$('.workplace-tab').not(tab).css({'display':'none'});
		$(tab).fadeIn(0);
	});

	//Zoom img
	Intense($('.zoom'))

	setSwitcherForSmallDevice();

	setFullHeight($('#picture'), 60);
	setFullHeight($('.workplace-tab'), 120);
	setFullHeight($('.control-panel'), 90);
});

$(window).resize(function() {
	setSwitcherForSmallDevice();

	setFullHeight($('#picture'), 60);
	setFullHeight($('.workplace-tab'), 120);
	setFullHeight($('.control-panel'), 90);
});

$(window).load(function() {
	setFullHeight($('#picture'), 60);
	setFullHeight($('.workplace-tab'), 120);
	setFullHeight($('.control-panel'), 90);
});

function init() {
	solveWindow=$("#solveWindow");
	solveBlock=$("#solve");
	solveWindow.detach();
	overlay=$("#overlay");
	task=new LogicTask({story:"picture"});
}

function solveButton() {
	$("body").append(solveWindow);
	solveBlock.append("<p>Идёт расследование...</p>");
	overlay.fadeIn(400);
	setTimeout(task.solve,1000);
}

function closeSolution() {
	overlay.fadeOut(400);
	solveBlock.text("");
	solveWindow.detach();
}

function setCustomScroll(elem, width, height = 'auto', color) {
	elem.slimScroll({
		height: height,
		size: width,
		color: color,
		wheelStep: 35
	});
}

function setSwitcherForSmallDevice() {
	if($('.show-workplace').is(':visible')) {
		$('.workplace').css("display", "none");
	}
	
	if($('.show-workplace').is(':hidden')) {
		$('.workplace').css("display", "block");
		$('#picture').css("display", "block");
	} else {
		if($('.show-history').hasClass('active')) {
			$('.workplace').css("display", "none");
			$('#picture').css("display", "block");
		} else  {
			$('.workplace').css("display", "block");
			$('#picture').css("display", "none");
		}
	}

	$('.show-history').click(function() {
		$('.show-history').addClass('active');
		$('.show-workplace').removeClass('active');
		$('#picture').css("display", "block");
		$('.workplace').css("display", "none");
	});

	$('.show-workplace').click(function() {
		$('.show-history').removeClass('active');
		$('.show-workplace').addClass('active');
		$('#picture').css("display", "none");
		$('.workplace').css("display", "block");
	});
}