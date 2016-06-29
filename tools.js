$("#gravFieldButton").click(function()
{
	if(gravityVisualizer == 0)
	{
		gravityVisualizer = 1;
		$("#gravFieldElement").css("background", "#009999");
	}
	else
	{
		gravityVisualizer = 0;
		$("#gravFieldElement").css("background", "");
	}
});

/* PAN HANDLER */
$("#panButton").click(function() 
{
	if(toolSelected == 0)
	{
		toolSelected = -1;
		allButtonsStyleRestore();
	}
	else
	{
		toolSelected = 0;
		allButtonsStyleRestore();
		$("#panMenuElement").css("background", "#0c7fb0");
	}
	
});


/* ZOOM HANDLER */
$("#zoomInButton").click(function() 
{
	if(toolSelected==1)
	{
		toolSelected = -1;
		allButtonsStyleRestore();
	}
	else
	{
		toolSelected = 1;
		allButtonsStyleRestore();
		$("#zoomInMenuElement").css("background", "#0c7fb0");
	}
});


$("#zoomOutButton").click(function() 
{
	if(toolSelected==2)
	{
		toolSelected = -1;
		allButtonsStyleRestore();
	}
	else
	{
		toolSelected = 2;
		allButtonsStyleRestore();
		$("#zoomOutMenuElement").css("background", "#0c7fb0");
		console.log("ZoomOut selected");
	}
});

/* FAST ADD PLANET HANDLER */
$("#fastAddButton").click(function()
{
	if(toolSelected==3)
	{
		toolSelected = -1;
		allButtonsStyleRestore();
	}
	else
	{
		toolSelected = 3;
		allButtonsStyleRestore();
		$("#fastAddMenuElement").css("background", "#0c7fb0");
		console.log("FastAdd selected");
	}
	
})


/* DELETE PLANET HANDLER */
$("#deletePlanetButton").click(function()
{
	if(toolSelected==4)
	{
		toolSelected = -1;
		allButtonsStyleRestore();
	}
	else
	{
		toolSelected = 4;
		allButtonsStyleRestore();
		$("#deletePlanetMenuElement").css("background", "#FF0000");
		console.log("deletePlanet slected");
	}
})

/* PAUSE SIMULATION HANDLER */

$("#pausePlayButton").click(function()
{
	if(pauseSimulation)
	{
		pauseSimulation = 0;
		$("#pausePlayElement").css("background", "");
	}
	else
	{
		pauseSimulation = 1;
		$("#pausePlayElement").css("background", "#FF9900");
		/*$("#pausePlayElement").css("animation-timing-function", "ease");
		$("#pausePlayElement").css("animation-duration", "3s");
		$("#pausePlayElement").WebkitTransition = 'pauseChangeColor 1s';
		$("#pausePlayElement").css("animation-iteration-count", "infinite");
		
		$("#pausePlayElement").style.WebkitAnimationName = "pauseChangeColor";
		$("#pausePlayElement").style.animationTimingFunction = "ease";
		$("#pausePlayElement").style.animationDuration = "3s";
		$("#pausePlayElement").style.animationIterationCount = "infinite";*/
		
	
	
	}
})

/* Ripristina lo stile di tutti i bottoni */
function allButtonsStyleRestore()
{
	$("#panMenuElement").css("background", "");
	$("#zoomInMenuElement").css("background", "");
	$("#zoomOutMenuElement").css("background", "");
	$("#fastAddMenuElement").css("background", "");
	$("#deletePlanetMenuElement").css("background", "");
}