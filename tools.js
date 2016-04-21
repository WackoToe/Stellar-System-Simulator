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

/* Ripristina lo stile di tutti i bottoni */
function allButtonsStyleRestore()
{
	$("#panMenuElement").css("background", "");
	$("#zoomInMenuElement").css("background", "");
	$("#zoomOutMenuElement").css("background", "");
    $("#fastAddMenuElement").css("background", "");
	$("#deletePlanetMenuElement").css("background", "");
}