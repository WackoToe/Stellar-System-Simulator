
var planetsArray = []; // Il mio array di pianeti

var can = $("#simulatorCanvas")[0];
var c = can.getContext("2d"); 	// Il contesto del canvas di simulazione

can.height = $("#autoscale")[0].clientHeight;
can.width = $("#autoscale")[0].clientWidth;
var can_w = can.width;
var can_h = can.height;
window.onresize = function(){
	can.height = can_h = $("#autoscale")[0].clientHeight;
	can.width = can_w = $("#autoscale")[0].clientWidth;
};

/* 	La variabile toolSelected indica quale strumento stiamo utilizzando:
*	-1: non stiamo utilizzando alcuno strumento
*	0: stiamo utilizzando il pan
*	1: stiamo utilizzando zoom-in
*	2: stiamo utilizzando zoom-out
*   3: stiamo aggiungendo rapidamente un pianeta
*   4: stiamo eliminando un pianeta
*/
var toolSelected = -1;
var i;
var SCALE_FACTOR = 1.1;
var CANVAS_SCALE = 1.0;
var planetSelected = -1;		                                                  							//Tells the index of the selected planet in planetsArray
var gravityVisualizer = 0;																					//Tells if gravity field line must be draw on simulatorCanvas
var pauseSimulation = 0;																					//Tells when the simulation is going
var colorArray = ["Blue", "brown", "green", "grey", "pink", "purple", "red", "silver", "white", "Yellow"]   //Contains all the available colors
var colorArrayIndex = 0;    																				//Used to decide what is the color of the planet added fast
var fastPlanetNumber = 0;           																		//Tells how many times we added a planet in the fast way
var defaultFastPlanetRadius = 50;   																		//Default radius when we do a fast planet add
var defaultFastPlanetMass = 50;     																		//Default mass when we do a fast planet add
var startMouseX;																							//Tells the X coordinate where a mouseDown event occurs
var startMouseY;																							//Tells the Y coordinate where a mouseDown event occurs
var currentMouseX;																							//Tells the current X coordinate after a mouseMove
var currentMouseY;																							//Tells the current Y coordinate after a mouseMove
var md = 0;																									//When is 1, tells that mouse is clicked. Otherwise is 0
var trasl = [0, 0];


// Draw a single planet
function drawPlanet(p)
{ 
	c.beginPath();
	c.arc(p.x , p.y , p.radius/CANVAS_SCALE, 0, 2*Math.PI); 
	c.fillStyle = p.colorTheme;
	c.fill();
}

function begin()
{
	var start = null; // start contains present time in milliseconds

	var next = function(time)
	{
		if(!start) start = time;                // set start during the first next() call
		var t = (time - start)/1000.0; 			// Ad ogni ciclo t sarà il numero di secondi passati dal ciclo precedente
		start = time;
		
		/*
		c.restore();
		c.save();
		*/
		
		c.clearRect(-trasl[0], -trasl[1], can_w+5, can_h+5); 	// Clean all
		
		/*
		c.translate(trasl[0], trasl[1]);
		c.scale(CANVAS_SCALE, CANVAS_SCALE);
		*/
		
		if(!pauseSimulation)												//When the simulation is paused, we don't need to update
		{
			planetsArray = collisionResolution(planetsArray);   			//Returns the updated array planet after the collisions are solved
			planetsArray = updatePlanets(planetsArray, t);     				//Returns the updated array planet after t time			
		}

		if((gravityVisualizer == 1)  ) drawGravity()
		planetsArray.map(drawPlanet);
		if( (toolSelected == 3) && (md == 1)) drawFastPlanet();
		window.requestAnimationFrame(next);
	}

	window.requestAnimationFrame(next); 									// Chiama l'esecuzione del primo ciclo
}

begin(); // Fa partire il ciclo grafico

function drawGravity()
{
	var i, j;
	var a = [0,0];
	var incr = 50;
	var lineWidth = 3;
	for(i=0-trasl[0]; i<can_w  - trasl[0]; i+=incr)
	{
		for(j=0-trasl[1]; j<can_h  - trasl[1] ; j+=incr)
		{
			if(bodySelected(i,j) == -1)
			{
				a = forceInPoint(i, j, planetsArray);
			
				c.beginPath();
				c.moveTo(i, j);
				c.lineTo(i+a[0]/4, j+a[1]/4);
				c.strokeStyle = "#66CC66";
				c.lineWidth=lineWidth;
				c.closePath();
				c.stroke();
			}
		}
	}
	//console.log("incr" +incr);
}


//Funzione che restituisce l'indice nell'array planetsArray del pianeta selezionato
function bodySelected(x, y)
{
	var s1=0;									//Variabile di scorrimento
	var _planetSelected = -1;					//Variabile che indica se un pianeta e' stato selezionato
	for(s1=0; s1<planetsArray.length; ++s1)
	{
		if(Math.sqrt((x-planetsArray[s1].x)*(x-planetsArray[s1].x) + (y-planetsArray[s1].y)*(y-planetsArray[s1].y)) < planetsArray[s1].radius/CANVAS_SCALE)
		{
			_planetSelected = s1;
			break;
		}
	}

	if(_planetSelected != -1)return _planetSelected;
	else return -1;
}

function drawFastPlanet()
{
	c.beginPath();
	c.arc(startMouseX - trasl[0], startMouseY - trasl[1], defaultFastPlanetRadius/CANVAS_SCALE, 0, 2*Math.PI); 
	c.fillStyle = colorArray[colorArrayIndex];
	c.fill();
	
	c.beginPath();
	c.moveTo(startMouseX- trasl[0] , startMouseY- trasl[1]);
	c.lineTo(currentMouseX- trasl[0], currentMouseY- trasl[1]);
	c.strokeStyle = "#0099FF";
	c.lineWidth="5";
	c.closePath();
	c.stroke();
}

//Gestione di un click all'interno del canvas
$("#simulatorCanvas").mousedown(function(e)
{
	startMouseX=e.offsetX;
	startMouseY=e.offsetY;
	currentMouseX = e.offsetX;
	currentMouseY = e.offsetY;
	
	console.log("offsetX" + e.offsetX + "offsetY" + e.offsetY);
	
	switch(toolSelected)
	{
		case 0:
		{
			md = 1;
			break;
		}
		case 1:
		{
			c.save();
			c.translate(e.offsetX, e.offsetY);
			c.scale(SCALE_FACTOR, SCALE_FACTOR);
			c.translate(-e.offsetX, -e.offsetY);
			c.restore();
			CANVAS_SCALE /= SCALE_FACTOR;
			break;
		}
		case 2:
		{
			c.save();
			c.translate(e.offsetX, e.offsetY);
			c.scale(1/SCALE_FACTOR, 1/SCALE_FACTOR);
			c.translate(-e.offsetX, -e.offsetY);
			c.restore();
			CANVAS_SCALE *= SCALE_FACTOR;
            console.log(CANVAS_SCALE);
			break;
		}
		case 3:
		{
			md = 1;
			break;	
		}
		case 4:
		{
			planetSelected = bodySelected(e.offsetX, e.offsetY);
			console.log(planetSelected)
			if(planetSelected != -1) planetsArray.splice(planetSelected, 1);
			break;
		}
		default:
		{
			planetSelected = bodySelected(e.offsetX -trasl[0], e.offsetY -trasl[1]);

			if(planetSelected != -1) 
			{
				var p = planetsArray[planetSelected];
				cp.style.background = "100% / cover url(Images/" + p.colorTheme + "/1.jpg)";
				cp.style.boxShadow = "inset 0px 0px 50px 15px rgba(0, 0, 0, 0.9)";
				
				cp.style.backgroundPosition = "0 0";
				clearInterval(tid);
				tid = setInterval(planetBackgroundTraslation, 30);		
			}
			else
			{
				cp.style.background = "";
				cp.style.boxShadow ="";
				
			}
		}
	}
});

$("#cleanAllButton").click(function(){
	for(i = planetsArray.length-1; i >= 0 ; i--) planetsArray.pop()
	planetsArray.map(planetsArray.pop());
});

var tid;
var offsetTraslation=0;
var cp = $("#planetRender").children()[0];

function planetBackgroundTraslation() 
{
	cp.style.backgroundPosition = "-"+offsetTraslation+"px 0";
	offsetTraslation=(++offsetTraslation)%1024;
}



$("#simulatorCanvas").mouseup(function(e)
{
	switch(toolSelected)
	{
		case 3:
		{
			if(bodySelected(e.offsetX, e.offsetY)== -1)
			{
				planetsArray.push({
					planetName: "fast planet" + fastPlanetNumber,
					radius: defaultFastPlanetRadius,
					mass: defaultFastPlanetMass,
					x: startMouseX - trasl[0],
					y: startMouseY - trasl[1],
					speedX: (e.offsetX - startMouseX)/4,
					speedY: (e.offsetY - startMouseY)/4,
					colorTheme: colorArray[colorArrayIndex]
				});
				colorArrayIndex = (colorArrayIndex+1)%colorArray.length;
				console.log(colorArrayIndex);
			}
            break;
		}
	}


	md = 0;
});

$("#simulatorCanvas").mousemove(function(e)
{  
	currentMouseX = e.offsetX;
	currentMouseY = e.offsetY;
	
	
	if((toolSelected == 0) && (md ==1))
	{
		//c.save();
		c.translate((currentMouseX-startMouseX), (currentMouseY-startMouseY));
		trasl[0] += currentMouseX-startMouseX;
		trasl[1] += currentMouseY-startMouseY;
		//c.restore();
		startMouseX = e.offsetX;
		startMouseY = e.offsetY;
		console.log("X: " + trasl[0] + " Y: " + trasl[1]);
	}
	

});

$("#corpo").mouseup(function(e)
{
	md = 0;
});



/*  Test vari */
planetsArray.push({
		planetName: "earthBlue",
		radius: 50,
		mass: 600,
		x: 200,
		y: 200,
		speedX: 0,
		speedY: 0,
		colorTheme: "blue"
});

/*planetsArray.push({
	planetName: "mars",
	radius: 20,
	mass: 20,
	x: 50,
	y: 550,
	speedX: 100,
	speedY: 40,
	colorTheme: "red"
});*/