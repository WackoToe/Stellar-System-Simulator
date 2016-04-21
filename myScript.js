
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

//var simCanvTransf = [ [1,0,0] , [0, 1, 0], [0, 0, 1]];


var i;
var SCALE_FACTOR = 1.1;
var CANVAS_SCALE = 1.0;

var trasl = [0, 0];



/* 	La variabile toolSelected indica quale strumento stiamo utilizzando:
*	-1: non stiamo utilizzando alcuno strumento
*	0: stiamo utilizzando il pan
*	1: stiamo utilizzando zoom-in
*	2: stiamo utilizzando zoom-out
*   3: stiamo aggiungendo rapidamente un pianeta
*   4: stiamo eliminando un pianeta
*/
var toolSelected = -1;

var planetSelected = -1;		//Tells the index of the selected planet in planetsArray

var gravityVisualizer = 0;

var colorArray = ["Blue", "brown", "green", "grey", "pink", "purple", "red", "silver", "white", "Yellow"]   //Contains all the available colors
var colorArrayIndex = 0;    //Used to decide what is the color of the planet added fast

var fastPlanetNumber = 0;           //Tells how many times we added a planet in the fast way
var defaultFastPlanetRadius = 50;   //Default radius when we do a fast planet add
var defaultFastPlanetMass = 50;     //Default mass when we do a fast planet add



function drawPlanet(p){ // Disegna un singolo pianeta
	c.beginPath();
	c.arc(p.x, p.y, p.radius, 0, 2*Math.PI); 
	c.fillStyle = p.colorTheme;
	c.fill();
}

function drawGravity()
{
	var i = 50/CANVAS_SCALE;
	var j = 50/CANVAS_SCALE;
	var f = [0,0];
	
	for(i; i<can_w; i=i+100/CANVAS_SCALE)
	{
		for(j; j<can_h; i=i+100/CANVAS_SCALE)
		{
			f = calculateForces(i,j);	
		}
	}
}

function begin()
{
	var start = null; // conterrà la time attuale in millisecondi

	var next = function(time)
	{
		if(!start) start = time; // inizializza start durante la prima chiamata di next()
		else c.restore();
		var t = (time - start)/1000.0; // Ad ogni ciclo t sarà il numero di secondi passati dal ciclo precedente
		start = time;

		planetsArray = collisionResolution(planetsArray);
		/* Funzione che restituisce un nuovo array con i pianeti aggiornati dopo il tempo t */
		planetsArray = updatePlanets(planetsArray, t);
				
		c.save();
		c.clearRect(canvasOrigin[0], canvasOrigin[1], can_w+5, can_h+5); // Pulisce tutto

		if(gravityVisualizer == 1) drawGravity()
		planetsArray.map(drawPlanet);
		c.translate(-trasl[0], -trasl[1]);
		window.requestAnimationFrame(next);
	}

	window.requestAnimationFrame(next); // Chiama l'esecuzione del primo ciclo
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

var startMouseX;
var startMouseY;
var traslX;
var traslY;
var md = 0;												//se e' uguale a 1 indica che il mouse e' cliccato, altrimenti e' uguale a 0
var canvasOrigin = [0, 0];


//Gestione di un click all'interno del canvas
$("#simulatorCanvas").mousedown(function(e)
{
	startMouseX=e.offsetX - trasl[0];
	startMouseY=e.offsetY - trasl[1];
	

	
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
			planetSelected = bodySelected(e.offsetX + canvasOrigin[0], e.offsetY + canvasOrigin[1]);
			console.log(planetSelected)
			if(planetSelected != -1) planetsArray.splice(planetSelected, 1);
            break;
		}
		default:
		{
			planetSelected = bodySelected(e.offsetX + canvasOrigin[0], e.offsetY + canvasOrigin[1]);

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
var offsetTranslation=10;
var cp = $("#planetRender").children()[0];

function transl() 
{
	cp.style.backgroundPosition = "-"+offsetTranslation+"px 0";
	offsetTranslation=(++offsetTranslation)%1024;
}

$("#simulatorCanvas").mouseup(function(e)
{
	if((toolSelected==0) && (md == 1))
	{
		canvasOrigin[0] = canvasOrigin[0]+traslX;
		canvasOrigin[1] = canvasOrigin[1]+traslY;
		
		c.clearRect(-canvasOrigin[0], -canvasOrigin[1], can_w, can_h);		
		c.translate(e.offsetX- startMouseX, e.offsetY- startMouseY);
	}
    
    if((toolSelected) == 3 && (bodySelected(e.offsetX + canvasOrigin[0], e.offsetY + canvasOrigin[1])== -1))
	{
		planetsArray.push({
			planetName: "fast planet" + fastPlanetNumber,
			radius: defaultFastPlanetRadius,
			mass: defaultFastPlanetMass,
			x: startMouseX,
			y: startMouseY,
			speedX: (e.offsetX - trasl[0] -startMouseX)/10 ,
			speedY: (e.offsetY - trasl[0] -startMouseY)/10,
			colorTheme: colorArray[colorArrayIndex]
		});
		colorArrayIndex = (colorArrayIndex+1)%colorArray.length;
		console.log(colorArrayIndex);

	}

	md = 0;
});

$("#simulatorCanvas").mousemove(function(e)
{  
	/*
	if( (toolSelected == 3) && (md == 1))
	{
		c.beginPath();
		c.arc(startMouseX, startMouseY, defaultFastPlanetRadius, 0, 2*Math.PI); 
		c.fillStyle = colorArray[colorArrayIndex];
		c.fill();
		
		c.beginPath();
		c.moveTo(startMouseX, startMouseY);
		c.lineTo(e.offsetX - trasl[0], e.offsetY-trasl[1])
		c.strokeStyle = "#0099FF";
		c.lineWidth="5";
		c.closePath();
	}*/

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
	radius: 10,
	mass: 100,
	x: 50,
	y: 550,
	speedX: 10,
	speedY: 10,
	colorTheme: "red"
});