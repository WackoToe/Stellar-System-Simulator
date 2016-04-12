//moto uniformemente accellerato
function space(t, s0, v0, a)
{
	a = a ? a : 0; // se a non è definita mettila a 0
	return s0 + t*v0 + (a*t*t)/2.0;
}

function speed(t, v0, a)
{
	a = a ? a : 0;
	return v0 + t*a;
}

function force(p0, plist)
{ // calcola l'accelerazione su p0 dovuta a plist (lista di pianeti)
	var G = 6.67 * Math.pow( 10, 1 ); // Costante di gravitazione universale
	var a = [0,0]; // accelerazione x, y
	plist.map(function(p)
	{
		if(p == p0) return; // il pianeta non applica forza a se stesso
		var r = Math.sqrt( Math.pow(p.x-p0.x, 2 ) + Math.pow(p.y-p0.y, 2 ) ); // distanza dai centri
		a[0] += (p.x-p0.x)*G* p.mass / Math.pow(r, 2); // accelerazione su x. Formula: -dx*G*M / r^2 
		a[1] += (p.y-p0.y)*G* p.mass / Math.pow(r, 2);
	});
	return a; // ritorna l'accelerazione
}


function updatePlanets(planets, t)
{
 	var updated = planets.map(function(old_p)
 	{ // Per ogni pianeta
 		var a = force(old_p, planets);
 		var ax = a[0];
 		var ay = a[1];
 		var new_p = { // creo un pianeta nuovo
 			planetName: old_p.planetName,
			radius: old_p.radius,
			mass: old_p.mass,
			x: space( t, old_p.x, old_p.speedX, ax ), //aggiorno le posizioni (moto uniforme)
			y: space( t, old_p.y, old_p.speedY, ay ),
			speedX: speed( t, old_p.speedX, ax ), // e le velocità
			speedY: speed( t, old_p.speedY, ay ),
			colorTheme: old_p.colorTheme
 		};
 		return new_p; // ritorno il nuovo pianeta
 	});
 	return updated; // i nuovi pianeti aggioranti vengono restituiti
 }
 
 
 function calculateForces(positionX, positionY)
 {
	var G = 6.67 * Math.pow( 10, 1 ); // Costante di gravitazione universale
	var f = [0,0]; // force on x and y
	plist.map(function(p)
	{
		var r = Math.sqrt( Math.pow(p.x-positionX, 2 ) + Math.pow(p.y-positionY, 2 ) ); // distance from the point (x,y) to the planet p
		f[0] += (p.x-positionX)*G* p.mass / Math.pow(r, 2); // force on X. Formula: -dx*G*M / r^2 
		f[1] += (p.y-positionY)*G* p.mass / Math.pow(r, 2);
	});
	return f;
 }