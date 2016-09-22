
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
var ANIMATION_TIME = 1000.0;
var planetSelected = -1;		                                                  							//Tells the index of the selected planet in planetsArray
var gravityVisualizer = 0;																					//Tells if gravity field line must be draw on simulatorCanvas
var pauseSimulation = 0;																					//Tells when the simulation is going
var colorArray = ["Blue", "brown", "green", "grey", "pink", "purple", "red", "silver", "white", "Yellow"]   //Contains all the available colors
var colorArrayIndex = 0;    																				//Used to decide what is the color of the planet added fast
var fastPlanetNumber = 0;           																		//Tells how many times we added a planet in the fast way
var defaultFastPlanetRadius = 20;   																		//Default radius when we do a fast planet add
var defaultFastPlanetMass = 20;     																		//Default mass when we do a fast planet add
var startMouseX;																							//Tells the X coordinate where a mouseDown event occurs
var startMouseY;																							//Tells the Y coordinate where a mouseDown event occurs
var currentMouseX;																							//Tells the current X coordinate after a mouseMove
var currentMouseY;																							//Tells the current Y coordinate after a mouseMove
var md = 0;																									//When is 1, tells that mouse is clicked. Otherwise is 0
var alreadyMoved = 0;
var trasl = [0, 0];

begin(); // Fa partire il ciclo grafico

// Draw a single planet
function drawPlanet(p)
{ 
	c.beginPath();
	c.arc(p.x , p.y , p.radius, 0, 2*Math.PI); 
	c.fillStyle = p.colorTheme;
	c.fill();
}

function begin()
{
	var start = null; // start contains present time in milliseconds
	var next = function(time)
	{
		if(!start)
		{ 
			start = time;                // set start during the first next() call
			c.save();
		}
		var t = (time - start)/ANIMATION_TIME; 			// Ad ogni ciclo t sarà il numero di secondi passati dal ciclo precedente
		start = time;
		
		
		c.restore();
		c.save();
		c.clearRect(0, 0, can_w, can_h); 	// Clean all

		c.translate(trasl[0], trasl[1]);
		
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

function drawGravity()
{
	var i, j;
	var a = [0,0];
	var incr = 50;
	var lineWidth = 3;
	for(i=0-trasl[0]; i<can_w-trasl[0]; i+=incr)
	{
		for(j=0-trasl[1]; j<can_h-trasl[1] ; j+=incr)
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
}


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
	c.arc(startMouseX - trasl[0], startMouseY - trasl[1], defaultFastPlanetRadius, 0, 2*Math.PI); 
	c.fillStyle = colorArray[colorArrayIndex];
	c.fill();
    
	c.beginPath();
	c.moveTo(startMouseX - trasl[0] , startMouseY-trasl[1]);
    if(alreadyMoved) c.lineTo(currentMouseX - trasl[0], currentMouseY-trasl[1]);
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
	currentMouseX = e.offsetX - trasl[0];
	currentMouseY = e.offsetY - trasl[1];
	
	switch(toolSelected)
	{
		case 0:
		{
			md = 1;
			break;
		}
		case 1:
		{
			break;
		}
		case 2:
		{
			break;
		}
		case 3:
		{
			md = 1;
			break;	
		}
		case 4:
		{
			planetSelected = bodySelected(currentMouseX, currentMouseY);
			if(planetSelected != -1) planetsArray.splice(planetSelected, 1);
			break;
		}
		default:
		{
			planetSelected = bodySelected(currentMouseX, currentMouseY);

			if(planetSelected != -1) 
			{
				var p = planetsArray[planetSelected];
				cp.style.background = "100% / cover url(Images/" + p.colorTheme + "/1.jpg)";
				cp.style.boxShadow = "inset 0px 0px 50px 15px rgba(0, 0, 0, 0.9)";
				
				offsetTraslation = 0;
				cp.style.backgroundPosition = "0 0";
				clearInterval(tid);
				tid = setInterval(planetBackgroundTraslation, 10);		
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
});

var tid;
var offsetTraslation=0;
var cp = $("#planetRender").children()[0];

function planetBackgroundTraslation() 
{
	cp.style.backgroundPosition = "-"+offsetTraslation+"px 0";
	offsetTraslation=(++offsetTraslation)%403;
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
    if(md)alreadyMoved = 1;
		
	if((toolSelected == 0) && (md ==1))
	{
		trasl[0] += currentMouseX-startMouseX;
		trasl[1] += currentMouseY-startMouseY;
		startMouseX = currentMouseX;
		startMouseY = currentMouseY;
	}
});

$("#corpo").mouseup(function(e)
{
	console.log("traslX: " + trasl[0] + " traslY: " + trasl[1]);
	md = 0;
    alreadyMoved = 0;
});

//var audio = new Audio('b.mp3');
//audio.play();

myAudio = new Audio('audioBackground.mp3');
myAudio.volume = 0.15
myAudio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
myAudio.play();

/*  Schema iniziale */
planetsArray.push({
	planetName: "earthBlue",
	radius: 30,
	mass: 800,
	x: 700,
	y: 350,
	speedX: 0,
	speedY: 0,
	colorTheme: "blue"
});

planetsArray.push({
	planetName: "mars",
	radius: 20,
	mass: 20,
	x: 700,
	y: 500,
	speedX: 240,
	speedY: 30,
	colorTheme: "red"
});

planetsArray.push({
	planetName: "moon",
	radius: 20,
	mass: 20,
	x: 300,
	y: 300,
	speedX: 30,
	speedY: -210,
	colorTheme: "silver"
});