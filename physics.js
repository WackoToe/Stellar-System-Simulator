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

function forceInPoint(x, y, plist)
{
    var G = 6.67 * Math.pow( 10, 1 ); // Universal gravitation constant
	var a = [0,0]; // acceleration x, y
	plist.map(function(p)
	{
		if(p.x == x && p.y==y) return
		var r = Math.sqrt( Math.pow(p.x-x, 2 ) + Math.pow(p.y-y, 2 ) ); // distance from planet center to point (x,y)
		a[0] += ((p.x-x)*G* p.mass / Math.pow(r, 2))/CANVAS_SCALE; // acceleration on x. Formula: -dx*G*M / r^2 
		a[1] += ((p.y-y)*G* p.mass / Math.pow(r, 2))/CANVAS_SCALE;
	});
	return a; // return acceleration
}

function updatePlanets(planets, t)
{
 	var updated = planets.map(function(old_p)
 	{ // For every planet
 		var a = forceInPoint(old_p.x, old_p.y, planets);
 		var ax = a[0];
 		var ay = a[1];
 		var new_p = { // creo un pianeta nuovo
 			planetName: old_p.planetName,
			radius: old_p.radius,
			mass: old_p.mass,
			x: space( t, old_p.x, old_p.speedX, ax ), //updating position
			y: space( t, old_p.y, old_p.speedY, ay ),
			speedX: speed( t, old_p.speedX, ax ), // updating speed
			speedY: speed( t, old_p.speedY, ay ),
			colorTheme: old_p.colorTheme
 		};
 		return new_p; // return the new planet
 	});
 	return updated; // the new planets are now updated and we return them
 }
 
 
 function calculateForces(positionX, positionY)
 {
	var G = 6.67 * Math.pow( 10, 1 ); // Gravitational constant
	var f = [0,0]; // force on x and y
	plist.map(function(p)
	{
		var r = Math.sqrt( Math.pow(p.x-positionX, 2 ) + Math.pow(p.y-positionY, 2 ) ); // distance from the point (x,y) to the planet p
		f[0] += (p.x-positionX)*G* p.mass / Math.pow(r, 2); // force on X. Formula: -dx*G*M / r^2 
		f[1] += (p.y-positionY)*G* p.mass / Math.pow(r, 2);
	});
	return f;
 }
 
 function collisionResolution(planets)
 {
	 var i;
     var atLeastOneCollision = 0;
	 var updatedDirty = planets.map(function(old_p, index)
	 {
		for(i=index+1; i<planets.length; ++i)
		{
			var distance = Math.sqrt( Math.pow(planets[i].x-old_p.x, 2 ) + Math.pow(planets[i].y-old_p.y, 2 ) ) - (planets[i].radius)/CANVAS_SCALE - (old_p.radius)/CANVAS_SCALE;
		
			if(distance<=0)
			{
				var newRadius = Math.cbrt(Math.pow(old_p.radius, 3) + Math.pow(planets[i].radius, 3));
                var newSpeedX = (old_p.speedX*old_p.mass + planets[i].speedX*planets[i].mass)/(old_p.mass+planets[i].mass);
				var newSpeedY = (old_p.speedY*old_p.mass + planets[i].speedY*planets[i].mass)/(old_p.mass+planets[i].mass);
                var heavierPlanet;
				
				if(old_p.mass > planets[i].mass) heavierPlanet = old_p;
				else heavierPlanet = planets[i];
					
				var new_p = 
				{
					planetName: old_p.planetName + " + " + planets[i].planetName,
					radius: newRadius,
					mass: old_p.mass + planets[i].mass,
					x: heavierPlanet.x,
					y: heavierPlanet.y,
					speedX:  newSpeedX,
					speedY: newSpeedY,
					colorTheme: heavierPlanet.colorTheme
				}
				planets[i] = new_p;
				
                atLeastOneCollision = 1;
				return null;
			}    
		}
		return old_p;
	 })
	 
     if(atLeastOneCollision)
     {
        var updated = [];
        for(i=0; i<updatedDirty.length; ++i) if(updatedDirty[i]) updated.push(updatedDirty[i]);
        return updated;         
     }
     else return updatedDirty;

 }