
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
var canvasOrigin = [0, 0];



function drawPlanet(p){ // Disegna un singolo pianeta
	c.beginPath();
	c.arc(p.x, p.y, p.radius, 0, 2*Math.PI); 
	c.fillStyle = p.colorTheme;
	c.fill();
}

function begin()
{
	var start = null; // conterrà la time attuale in millisecondi

	var next = function(time)
	{
		if(!start) start = time; // inizializza start durante la prima chiamata di next()
		else c.restore();
		var t = (time - start)/1000.0; 										// Ad ogni ciclo t sarà il numero di secondi passati dal ciclo precedente
		start = time;

		planetsArray = collisionResolution(planetsArray);   				//Returns the updated array planet after the collisions are solved
		planetsArray = updatePlanets(planetsArray, t);     					//Returns the updated array planet after t time
				
		c.save();
		c.clearRect(canvasOrigin[0], canvasOrigin[1], can_w+5, can_h+5); 	// Clean all

		//if(gravityVisualizer == 1) drawGravity()
		planetsArray.map(drawPlanet);
		if( (toolSelected == 3) && (md == 1)) drawFastPlanet();
		window.requestAnimationFrame(next);
	}

	window.requestAnimationFrame(next); 									// Chiama l'esecuzione del primo ciclo
}

begin(); // Fa partire il ciclo grafico


//Funzione che restituisce l'indice nell'array planetsArray del pianeta selezionato
function bodySelected(x, y)
{
	var s1=0;									//Variabile di scorrimento
	var _planetSelected = -1;					//Variabile che indica se un pianeta e' stato selezionato
	for(s1=0; s1<planetsArray.length; ++s1)
	{
		if(Math.sqrt((x-planetsArray[s1].x)*(x-planetsArray[s1].x) + (y-planetsArray[s1].y)*(y-planetsArray[s1].y)) < planetsArray[s1].radius)
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
	c.arc(startMouseX, startMouseY, defaultFastPlanetRadius, 0, 2*Math.PI); 
	c.fillStyle = colorArray[colorArrayIndex];
	c.fill();
	
	c.beginPath();
	c.moveTo(startMouseX, startMouseY);
	c.lineTo(currentMouseX, currentMouseY);
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
			CANVAS_SCALE *= SCALE_FACTOR;
			break;
		}
		case 2:
		{
			CANVAS_SCALE /= SCALE_FACTOR;
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
			planetSelected = bodySelected(e.offsetX, e.offsetY);

			if(planetSelected != -1) 
			{
				var p = planetsArray[planetSelected];
				cp.style.background = "100% / cover url(Images/" + p.colorTheme + "/1.jpg)";
				cp.style.boxShadow = "inset 0px 0px 50px 15px rgba(0, 0, 0, 0.9)";
				
				cp.style.backgroundPosition = "0 0";
				clearInterval(tid);
				tid = setInterval(transl, 30);		
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
var offsetTranslation=0;
var cp = $("#planetRender").children()[0];

function transl() 
{
	cp.style.backgroundPosition = "-"+offsetTranslation+"px 0";
	offsetTranslation=(++offsetTranslation)%1024;
}



$("#simulatorCanvas").mouseup(function(e)
{
	if((toolSelected) == 3 && (bodySelected(e.offsetX, e.offsetY)== -1))
	{
		planetsArray.push({
			planetName: "fast planet" + fastPlanetNumber,
			radius: defaultFastPlanetRadius,
			mass: defaultFastPlanetMass,
			x: startMouseX,
			y: startMouseY,
			speedX: (e.offsetX - startMouseX)/4,
			speedY: (e.offsetY - startMouseY)/4,
			colorTheme: colorArray[colorArrayIndex]
		});
		colorArrayIndex = (colorArrayIndex+1)%colorArray.length;
		console.log(colorArrayIndex);

	}

	md = 0;
});

$("#simulatorCanvas").mousemove(function(e)
{  
	currentMouseX = e.offsetX;
	currentMouseY = e.offsetY;
});

$("#corpo").mouseup(function(e)
{
	md = 0;
});



/*  Test vari */
planetsArray.push({
		planetName: "earthBlue",
		radius: 50,
		mass: 500,
		x: 200,
		y: 200,
		speedX: 0,
		speedY: 0,
		colorTheme: "blue"
});

planetsArray.push({
	planetName: "mars",
	radius: 20,
	mass: 200,
	x: 50,
	y: 550,
	speedX: 10,
	speedY: -30,
	colorTheme: "red"
});