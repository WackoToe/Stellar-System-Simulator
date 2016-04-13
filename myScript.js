
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
*/
var toolSelected = -1;

var planetSelected = -1;		//Tells the index of the selected planet in planetsArray

var gravitVisualizer = 0;

// When the user clicks the button, open the modal 
$("#planetButton").click(function() {
	$("#planetModal")[0].style.display = "block";
});

$("#starButton").click(function() {
	$("#starModal")[0].style.display = "block";
});

$("#planetModal .close").click(function() {
	$("#planetModal")[0].style.display = "none";
});

$("#starModal .close").click(function() {
	$("#starModal")[0].style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
$(window).click(function(event) {
	if (event.target == $("#planetModal")[0]) {
		$("#planetModal")[0].style.display = "none";
	}
	if (event.target == $("#starModal")[0]) {
		$("#starModal")[0].style.display = "none";
	}
});


//Insert a new planet in planetsArray when the planetSubmitButton is clicked
$("[name=planetSubmitButton]").click(function(){
	planetsArray.push({
		planetName: $('#planetModal [name=planetName]').val()||"planet",
		radius: parseInt( $('#planetModal [name=radius]').val() )||10,
		mass: parseInt( $('#planetModal [name=mass]').val() )||0,
		x: parseInt( $('#planetModal [name=x]').val() )||0,
		y: parseInt( $('#planetModal [name=y]').val() )||0,
		speedX: parseInt( $('#planetModal [name=speedX]').val() )||0,
		speedY: parseInt( $('#planetModal [name=speedY]').val() )||0,
		colorTheme: $('#planetModal [name=colorTheme]').val()||"#FFF"
	});
	//$("#planetModal input").val('');
	$("#planetModal")[0].style.display = "none";
});

$("#cleanAllButton").click(function(){
	for(i = planetsArray.length-1; i >= 0 ; i--) planetsArray.pop()
	planetsArray.map(planetsArray.pop());
});



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

		/* Funzione che restituisce un nuovo array con i pianeti aggiornati dopo il tempo t */
		planetsArray = updatePlanets(planetsArray, t);
		
		c.save();
		c.clearRect(canvasOrigin[0], canvasOrigin[1], can_w+5, can_h+5); // Pulisce tutto

		if(gravitVisualizer == 1) drawGravity()
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

	if(_planetSelected!= -1)return _planetSelected;
	else return -1;
}



/*PAN HANDLER*/
var startMouseX;
var startMouseY;
var traslX;
var traslY;
var md = 0;												//se e' uguale a 1 indica che il mouse e' cliccato, altrimenti e' uguale a 0
var canvasOrigin = [0, 0];


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

var tid;
var offsetTranslation=10;
var cp = $("#planetRender").children()[0];

function transl() 
{
	cp.style.backgroundPosition = "-"+offsetTranslation+"px 0";
	//cp.style.background = "100% / cover url(Images/shadow.png)";
	offsetTranslation=(++offsetTranslation)%1024;
}

$("#simulatorCanvas").mouseup(function(e)
{
	if((toolSelected==0) && (md == 1))
	{
		//console.log("bella");
		canvasOrigin[0] = canvasOrigin[0]+traslX;
		canvasOrigin[1] = canvasOrigin[1]+traslY;
		
		c.clearRect(-canvasOrigin[0], -canvasOrigin[1], can_w, can_h);		
		c.translate(e.offsetX- startMouseX, e.offsetY- startMouseY);

		/*planetsArray.push({
		planetName: "Origin",
		radius: 10,
		mass: 0,
		x: 0,
		y: 0,
		speedX: 0,
		speedY: 0,
		colorTheme: "yellow"*/
	}

		md = 0;
});

$("#simulatorCanvas").mousemove(function(e)
{
	if((toolSelected==0) && (md == 1))
	{
		trasl[0]=e.offsetX- startMouseX;
		trasl[1]=e.offsetY- startMouseY;
		
	}

});

$("#corpo").mouseup(function(e)
{
		md = 0;
});



/* Ripristina lo stile di tutti i bottoni */
function allButtonsStyleRestore()
{
	$("#panMenuElement").css("background", "");
	$("#zoomInMenuElement").css("background", "");
	$("#zoomOutMenuElement").css("background", "");
}



/*  Test vari */
planetsArray.push({
	planetName: "mars",
	radius: 30,
	mass: 10,
	x: 0,
	y: 450,
	speedX: 80,
	speedY: 0,
	colorTheme: "red"
});

planetsArray.push({
		planetName: "earthBlue",
		radius: 45,
		mass: 500,
		x: 200,
		y: 200,
		speedX: 0,
		speedY: 0,
		colorTheme: "green"
});

/*planetsArray.push({
		planetName: "Origin",
		radius: 10,
		mass: 0,
		x: 0,
		y: 0,
		speedX: 0,
		speedY: 0,
		colorTheme: "yellow"
});*/