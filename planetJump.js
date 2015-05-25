var cameraPosX, cameraPosY, cameraPosZ, controlsRotSpeed, zoomLevel, moonPosX, moonPosY, maxRadius;

//Bigger number, further away from object
var planetZoom = 1.6;
var moonZoom = 0.5;
var galaxyZoom = 650;
jumpInAction = false;
smallJump = false;

function planetBools(){
	if(jumpMoonOk){
		smallJump = true;		
	} else {
		smallJump = false;
	}

	if(!jumpInAction) {
		if(activePlanet){
			jumpPlanetOk = true;
			jumpMoonOk = false;
			jumpSolarOk = false;
		}
	}
}

function moonBools(){
	if(jumpPlanetOk){
		smallJump = true;
	} else {
		smallJump = false;
	}
	if(!jumpInAction)
		if(activeMoon){
			jumpPlanetOk = false; 
			jumpMoonOk = true; 
			jumpSolarOk = false;
		}
}
function solarBools(){
	if(jumpSolarOk)
		resetSolarView = true; 
	if(!jumpInAction){
		jumpPlanetOk = false; 
		jumpMoonOk = false; 
		jumpSolarOk = true;
	}
}



function planetJump(){	
	//Aktiveras när man klickar på en annan planet.
	if(activePlanet != previousObject) {
		if(timer == 0){
			//Timern börjar på pi och går ner till 0.
			timer = Math.PI;
			jumpInAction = true;
			//Spara den förra planetens position och rotation.
			posx = galaxyGroup.position.x;
			posz = galaxyGroup.position.y;
			roty = galaxyGroup.rotation.z + rotationGroup.rotation.z;
			
			//Spara kamerans förra position
			cameraPosX = camera.position.x;
			cameraPosY = camera.position.y;
			cameraPosZ = camera.position.z;
			//Spara kamerans rotations-hastighet
			controlsRotSpeed = controls.rotateSpeed;
			//Beräkna zoom-nivå beroende på planetens radie och storlek
			for (var i = 0; i < planetOrbitRadiuses.length; ++i) {
					if (planetOrbitRadiuses[i][0] == activePlanet)
						zoomLevel = activePlanet.scale.x*planetZoom/(planetOrbitRadiuses[i][1]/60);
			}
			//Möjliggör ändring av transparens
			planetOrbitMaterial.transparent = true;

			console.log("Paborjar hopp");
		}
		//Skapa en mjuk övergång mellan nya och gamla positionen mha cosinus.
		galaxyGroup.position.x = posx*(1-Math.cos(timer))/2 - activePlanet.position.x*(1+Math.cos(timer))/2;
		galaxyGroup.position.y = posz*(1-Math.cos(timer))/2 - activePlanet.position.y*(1+Math.cos(timer))/2;
		rotationGroup.rotation.z = roty*(1-Math.cos(timer))/2 - activePlanet.rotation.z*(1+Math.cos(timer))/2;
		//Zooma kameran till rätt nivå beroende på planetens storlek, med en mjuk övergång.
		camera.position.x = cameraPosX*(1+Math.cos(Math.PI - timer))/2 - (activePlanet.position.x*(1+Math.cos(timer))/2)*zoomLevel;
		camera.position.y = cameraPosY*(1+Math.cos(Math.PI - timer))/2 - (activePlanet.position.y*(1+Math.cos(timer))/2)*zoomLevel;
		camera.position.z = cameraPosZ*(1+Math.cos(Math.PI - timer))/2 - (activePlanet.position.z*(1+Math.cos(timer))/2)*zoomLevel;
		
		if(!smallJump){
			//Dimma ut omloppsbanor och hover-sfärer
			planetOrbitMaterial.opacity = Math.cos(Math.PI/2 - timer/2);
			planetHoverMaterial.opacity = Math.cos(Math.PI/2 - timer/2)*hoverOpacity;
			moonOrbitMaterial.opacity = Math.cos(Math.PI/2 - timer/2)*hoverOpacity;
		} else {
			moonHoverMaterial.opacity = Math.cos(timer/2)*hoverOpacity;
		}

		controls.rotateSpeed = 0;
		//Hastigheten med vilken förflyttningen sker.
		timer -= 0.02;
			
		if(timer < 0){
			timer = 0;
			jumpInAction = false;
			//När förflyttningen är klar sätts previousObject (det klickade objektet) till objektet som nu är i fokus.
			previousObject = activePlanet;
			//Denna loop ska se till att rotationen inte nollställs direkt efter ett hopp.
			for(var i = 0; i < clickableObjects.length; i++)
				if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2)
					clickableObjects[i].rotation.z = clickableObjects[i].rotation.z - Math.PI*2;
				
			console.log("Fardig med hopp");
			controls.rotateSpeed = controlsRotSpeed;
		}
	} else {
		//Detta sker när det inte är ett hopp på g.
		galaxyGroup.position.x = -activePlanet.position.x;
		galaxyGroup.position.y = -activePlanet.position.y;
		//Motverkar planeten i fokus's rotation så att den står stilla.
		rotationGroup.rotation.z = -activePlanet.rotation.z;

		//Denna loop nollställer planetens rotation vid ett helt varv.
		for(var i = 0; i < clickableObjects.length; i++)
			if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2)
				clickableObjects[i].rotation.z = 0;
	}
}

function moonJump(){
	//Aktiveras när man klickar på en annan planet.
	if(activeMoon != previousObject) {
		if(timer == 0){
			//Timern börjar på pi och går ner till 0.
			timer = Math.PI;
			jumpInAction = true;
			//Spara den förra planetens position och rotation.
			posx = galaxyGroup.position.x;
			posz = galaxyGroup.position.y;
			roty = galaxyGroup.rotation.z + rotationGroup.rotation.z;
			
			//Spara kamerans förra position
			cameraPosX = camera.position.x;
			cameraPosY = camera.position.y;
			cameraPosZ = camera.position.z;
			//Spara kamerans rotations-hastighet
			controlsRotSpeed = controls.rotateSpeed;
			//Beräkna zoom-nivå beroende på planetens radie och storlek
			for(i = 0; i < planetOrbitRadiuses.length; i++)
				if(planetOrbitRadiuses[i][0] == activeMoon.parent.parent)
					var radiusFactor = 1/(planetOrbitRadiuses[i][1]/50);
				// console.log(radiusFactor);
			zoomLevel = activeMoon.scale.x*moonZoom*radiusFactor;

			//Möjliggör ändring av transparens
			planetOrbitMaterial.transparent = true;

			console.log("Paborjar hopp");
		}
		//Skapa en mjuk övergång mellan nya och gamla positionen mha cosinus.
		moonPosX = activeMoon.position.x+activePlanet.position.x;
		moonPosY = activeMoon.position.y+activePlanet.position.y;
		
		galaxyGroup.position.x = posx*(1-Math.cos(timer))/2 - moonPosX*(1+Math.cos(timer))/2;
		galaxyGroup.position.y = posz*(1-Math.cos(timer))/2 - moonPosY*(1+Math.cos(timer))/2;
		rotationGroup.rotation.z = roty*(1-Math.cos(timer))/2 - activeMoon.rotation.z*(1+Math.cos(timer))/2;
		//Zooma kameran till rätt nivå beroende på planetens storlek, med en mjuk övergång.
		camera.position.x = cameraPosX*(1+Math.cos(Math.PI - timer))/2 - (moonPosX*(1+Math.cos(timer))/2)*zoomLevel;
		camera.position.y = cameraPosY*(1+Math.cos(Math.PI - timer))/2 - (moonPosY*(1+Math.cos(timer))/2)*zoomLevel;
		camera.position.z = cameraPosZ*(1+Math.cos(Math.PI - timer))/2 - ((activeMoon.position.z+activePlanet.position.z)*(1+Math.cos(timer))/2)*zoomLevel;
		
		if(!smallJump){
			//Dimma ut omloppsbanor och hover-sfärer
			planetOrbitMaterial.opacity = Math.cos(Math.PI/2 - timer/2);
			planetHoverMaterial.opacity = Math.cos(Math.PI/2 - timer/2)*hoverOpacity;
			moonOrbitMaterial.opacity = Math.cos(Math.PI/2 - timer/2)*hoverOpacity;
		}
		moonHoverMaterial.opacity = Math.cos(Math.PI/2 - timer/2)*hoverOpacity;

		controls.rotateSpeed = 0;
		//Hastigheten med vilken förflyttningen sker.
		timer -= 0.02;
			
		if(timer < 0){
			timer = 0;
			jumpInAction = false;
			//När förflyttningen är klar sätts previousObject (det klickade objektet) till objektet som nu är i fokus.
			previousObject = activeMoon;
			//Denna loop ska se till att rotationen inte nollställs direkt efter ett hopp.
			for(var i = 0; i < clickableObjects.length; i++)
				if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2)
					clickableObjects[i].rotation.z = clickableObjects[i].rotation.z - Math.PI*2;
				
			console.log("Fardig med hopp");
			controls.rotateSpeed = controlsRotSpeed;
		}
	} else {
		
		moonPosX = activeMoon.position.x+activePlanet.position.x;
		moonPosY = activeMoon.position.y+activePlanet.position.y;
		
		//Detta sker när det inte är ett hopp på g.
		galaxyGroup.position.x = -moonPosX;
		galaxyGroup.position.y = -moonPosY;
		//Motverkar planeten i fokus's rotation så att den står stilla.
		rotationGroup.rotation.z = -activeMoon.rotation.z;

		//Denna loop nollställer planetens rotation vid ett helt varv.
		for(var i = 0; i < clickableObjects.length; i++)
			if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2)
				clickableObjects[i].rotation.z = 0;
	}
}

//Aktiveras när man vill gå tillbaka till att ha solen centrerad.
function jumpToSun(){
	if(sunSphere != previousObject || resetSolarView) {
		if(timer == 0){
			//Timern börjar på pi och går ner till 0.
			timer = Math.PI;
			jumpInAction = true;
			//Spara den förra planetens position och rotation.
			posx = galaxyGroup.position.x;
			posz = galaxyGroup.position.y;
			roty = galaxyGroup.rotation.z + rotationGroup.rotation.z;
			
			cameraPosX = camera.position.x;
			cameraPosY = camera.position.y;
			cameraPosZ = camera.position.z;
			controlsRotSpeed = controls.rotateSpeed;
			
			// console.log(hoverOpacity);

			console.log("Paborjar hopp");
		}
		maxRadius = 0;
		for(i = 0; i < planetOrbitRadiuses.length; i++)
			if(planetOrbitRadiuses[i][1] > maxRadius)
				maxRadius = planetOrbitRadiuses[i][1];
		zoomLevel = galaxyZoom + maxRadius*maxRadius*0.02 + maxRadius*Math.sin(maxRadius/300*Math.PI);
		
		//Skapa en mjuk övergång mellan nya och gamla positionen mha cosinus.
		galaxyGroup.position.x = posx*(1-Math.cos(timer))/2 - sunSphere.position.x*(1+Math.cos(timer))/2;
		galaxyGroup.position.y = posz*(1-Math.cos(timer))/2 - sunSphere.position.y*(1+Math.cos(timer))/2;
		//Zooma kameran till rätt nivå beroende på planetens storlek, med en mjuk övergång.
		camera.position.x = cameraPosX*(1+Math.cos(Math.PI - timer))/2;
		camera.position.y = cameraPosY*(1+Math.cos(Math.PI - timer))/2;
		camera.position.z = cameraPosZ*(1+Math.cos(Math.PI - timer))/2 - zoomLevel*(1+Math.cos(timer))/2;

		if(!resetSolarView) {
			//Dimma tillbaka omloppsbanor och hover-sfärer
			planetOrbitMaterial.opacity = Math.cos(timer/2);
			planetHoverMaterial.opacity = Math.cos(timer/2)*hoverOpacity;
			moonOrbitMaterial.opacity = Math.cos(timer/2)*hoverOpacity;
		}

		controls.rotateSpeed = 0;
		//Hastigheten med vilken förflyttningen sker.
		timer -= 0.02;
			
		if(timer < 0){
			timer = 0;
			jumpInAction = false;
			resetSolarView = false;
			//När förflyttningen är klar sätts previousObject (det klickade objektet) till objektet som nu är i fokus.
			previousObject = sunSphere;
			//Denna loop ska se till att rotationen inte nollställs direkt efter ett hopp.
			for(var i = 0; i < clickableObjects.length; i++)
				if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2)
					clickableObjects[i].rotation.z = clickableObjects[i].rotation.z - Math.PI*2;
					
			//Möjliggör ändring av transparens
			planetOrbitMaterial.transparent = false;
			
			console.log("Fardig med hopp");
			controls.rotateSpeed = controlsRotSpeed;
		}
	} else {
		//Detta sker när det inte är ett hopp på g.
		galaxyGroup.position.x = 0;
		galaxyGroup.position.y = 0;

		//Denna loop nollställer planetens rotation vid ett helt varv.
		for(var i = 0; i < clickableObjects.length; i++)
			if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2)
				clickableObjects[i].rotation.z = 0;
	}
	
}