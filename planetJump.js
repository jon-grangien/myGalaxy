var cameraPosX, cameraPosY, cameraPosZ, controlsRotSpeed, zoomLevel, previousOpacity;

function planetJump(){
	//Aktiveras när man klickar på en annan planet.
	if(activePlanet != previousObject) {
		if(timer == 0){
			//Timern börjar på pi och går ner till 0.
			timer = Math.PI;
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
						zoomLevel = activePlanet.scale.x*0.5/(planetOrbitRadiuses[i][1]/60);
			}
			//Möjliggör ändring av transparens
			planetOrbitMaterial.transparent = true;
			moonOrbitMaterial.transparent = true;
			previousOpacity = planetHoverMaterial.opacity;

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
		//Dimma ut omloppsbanor och hover-sfärer
		planetOrbitMaterial.opacity = Math.cos(Math.PI/2 - timer/2);
		planetHoverMaterial.opacity = Math.cos(Math.PI/2 - timer/2);
		moonOrbitMaterial.opacity = Math.cos(Math.PI/2 - timer/2);
		moonHoverMaterial.opacity = Math.cos(Math.PI/2 - timer/2);


		controls.rotateSpeed = 0;
		//Hastigheten med vilken förflyttningen sker.
		timer -= 0.02;
			
		if(timer < 0){
			timer = 0;
			//När förflyttningen är klar sätts previousObject (det klickade objektet) till objektet som nu är i fokus.
			previousObject = activePlanet;
			//Denna loop ska se till att rotationen inte nollställs direkt efter ett hopp.
			for(var i = 0; i < clickableObjects.length; i++)
				if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2) {
					clickableObjects[i].rotation.z = clickableObjects[i].rotation.z - Math.PI*2;
					console.log("Planet-rotation nollstalld under hopp");
				}
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
			if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2) {
				clickableObjects[i].rotation.z = 0;
				console.log("Planet-rotation nollstalld utanfor hopp");
			}
	}
}

function jumpToSun(){
	//Aktiveras när man vill gå tillbaka till att ha solen centrerad.
	if(sunSphere != previousObject) {
		if(timer == 0){
			//Timern börjar på pi och går ner till 0.
			timer = Math.PI;
			//Spara den förra planetens position och rotation.
			posx = galaxyGroup.position.x;
			posz = galaxyGroup.position.y;
			roty = galaxyGroup.rotation.z + rotationGroup.rotation.z;
			
			cameraPosX = camera.position.x;
			cameraPosY = camera.position.y;
			cameraPosZ = camera.position.z;
			controlsRotSpeed = controls.rotateSpeed;
			
			previousOpacity = planetHoverMaterial.opacity;
			console.log(previousOpacity);

			console.log("Paborjar hopp");
		}
		//Skapa en mjuk övergång mellan nya och gamla positionen mha cosinus.
		galaxyGroup.position.x = posx*(1-Math.cos(timer))/2 - sunSphere.position.x*(1+Math.cos(timer))/2;
		galaxyGroup.position.y = posz*(1-Math.cos(timer))/2 - sunSphere.position.y*(1+Math.cos(timer))/2;
		//Zooma kameran till rätt nivå beroende på planetens storlek, med en mjuk övergång.
		camera.position.x = cameraPosX*(1+Math.cos(Math.PI - timer))/2;
		camera.position.y = cameraPosY*(1+Math.cos(Math.PI - timer))/2;
		camera.position.z = cameraPosZ*(1+Math.cos(Math.PI - timer))/2 - 200*(1+Math.cos(timer))/2;
		//Dimma ut omloppsbanor och hover-sfärer
		planetOrbitMaterial.opacity = Math.cos(timer);
		planetHoverMaterial.opacity = Math.cos(timer);
		moonOrbitMaterial.opacity = Math.cos(timer);
		moonHoverMaterial.opacity = Math.cos(timer);

		controls.rotateSpeed = 0;
		//Hastigheten med vilken förflyttningen sker.
		timer -= 0.02;
			
		if(timer < 0){
			timer = 0;
			//När förflyttningen är klar sätts previousObject (det klickade objektet) till objektet som nu är i fokus.
			previousObject = sunSphere;
			//Denna loop ska se till att rotationen inte nollställs direkt efter ett hopp.
			for(var i = 0; i < clickableObjects.length; i++)
				if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2) {
					clickableObjects[i].rotation.z = clickableObjects[i].rotation.z - Math.PI*2;
					console.log("Planet-rotation nollstalld under hopp");
				}
			//Möjliggör ändring av transparens
			planetOrbitMaterial.transparent = false;
			moonOrbitMaterial.transparent = false;
			
			console.log("Fardig med hopp");
			controls.rotateSpeed = controlsRotSpeed;
		}
	} else {
		//Detta sker när det inte är ett hopp på g.
		galaxyGroup.position.x = 0;
		galaxyGroup.position.y = 0;

		//Denna loop nollställer planetens rotation vid ett helt varv.
		for(var i = 0; i < clickableObjects.length; i++)
			if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2) {
				clickableObjects[i].rotation.z = 0;
				console.log("Planet-rotation nollstalld utanfor hopp");
			}
	}
	
}