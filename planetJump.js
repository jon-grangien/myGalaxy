var cameraPosX, cameraPosY, cameraPosZ, controlsRotSpeed;

function planetJump(){
	//Aktiveras n�r man klickar p� en annan planet.
	if(activePlanet != previousObject) {
		if(timer == 0){
			//Timern b�rjar p� pi och g�r ner till 0.
			timer = Math.PI;
			//Spara den f�rra planetens position och rotation.
			posx = galaxyGroup.position.x;
			posz = galaxyGroup.position.y;
			roty = galaxyGroup.rotation.z + rotationGroup.rotation.z;
			
			cameraPosX = camera.position.x;
			cameraPosY = camera.position.y;
			cameraPosZ = camera.position.z;
			controlsRotSpeed = controls.rotateSpeed;

			console.log("Paborjar hopp");
		}
		//Skapa en mjuk �verg�ng mellan nya och gamla positionen mha cosinus.
		galaxyGroup.position.x = posx*(1-Math.cos(timer))/2 - activePlanet.position.x*(1+Math.cos(timer))/2;
		galaxyGroup.position.y = posz*(1-Math.cos(timer))/2 - activePlanet.position.y*(1+Math.cos(timer))/2;
		rotationGroup.rotation.z = roty*(1-Math.cos(timer))/2 - activePlanet.rotation.z*(1+Math.cos(timer))/2;
		//Zooma kameran till r�tt niv� beroende p� planetens storlek, med en mjuk �verg�ng.
		camera.position.x = cameraPosX*(1+Math.cos(Math.PI - timer))/2 - activePlanet.position.x*(1+Math.cos(timer))/2;
		camera.position.y = cameraPosY*(1+Math.cos(Math.PI - timer))/2 - activePlanet.position.y*(1+Math.cos(timer))/2;
		camera.position.z = cameraPosZ*(1+Math.cos(Math.PI - timer))/2 - activePlanet.position.z*(1+Math.cos(timer))/2;

		controls.rotateSpeed = 0;
		//Hastigheten med vilken f�rflyttningen sker.
		timer -= 0.02;
			
		if(timer < 0){
			timer = 0;
			//N�r f�rflyttningen �r klar s�tts previousObject (det klickade objektet) till objektet som nu �r i fokus.
			previousObject = activePlanet;
			//Denna loop ska se till att rotationen inte nollst�lls direkt efter ett hopp.
			for(var i = 0; i < clickableObjects.length; i++)
				if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2) {
					clickableObjects[i].rotation.z = clickableObjects[i].rotation.z - Math.PI*2;
					console.log("Planet-rotation nollstalld under hopp");
				}
			console.log("Fardig med hopp");
			controls.rotateSpeed = controlsRotSpeed;
		}
	} else {
		//Detta sker n�r det inte �r ett hopp p� g.
		galaxyGroup.position.x = -activePlanet.position.x;
		galaxyGroup.position.y = -activePlanet.position.y;
		//Motverkar planeten i fokus's rotation s� att den st�r stilla.
		rotationGroup.rotation.z = -activePlanet.rotation.z;

		//Denna loop nollst�ller planetens rotation vid ett helt varv.
		for(var i = 0; i < clickableObjects.length; i++)
			if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2) {
				clickableObjects[i].rotation.z = 0;
				console.log("Planet-rotation nollstalld utanfor hopp");
			}
	}
}

function jumpToSun(){
	//Aktiveras n�r man vill g� tillbaka till att ha solen centrerad.
	if(sunSphere != previousObject) {
		if(timer == 0){
			//Timern b�rjar p� pi och g�r ner till 0.
			timer = Math.PI;
			//Spara den f�rra planetens position och rotation.
			posx = galaxyGroup.position.x;
			posz = galaxyGroup.position.y;
			roty = galaxyGroup.rotation.z + rotationGroup.rotation.z;
			
			cameraPosX = camera.position.x;
			cameraPosY = camera.position.y;
			cameraPosZ = camera.position.z;
			controlsRotSpeed = controls.rotateSpeed;

			console.log("Paborjar hopp");
		}
		//Skapa en mjuk �verg�ng mellan nya och gamla positionen mha cosinus.
		galaxyGroup.position.x = posx*(1-Math.cos(timer))/2 - sunSphere.position.x*(1+Math.cos(timer))/2;
		galaxyGroup.position.y = posz*(1-Math.cos(timer))/2 - sunSphere.position.y*(1+Math.cos(timer))/2;
		//Zooma kameran till r�tt niv� beroende p� planetens storlek, med en mjuk �verg�ng.
		camera.position.x = cameraPosX*(1+Math.cos(Math.PI - timer))/2;
		camera.position.y = cameraPosY*(1+Math.cos(Math.PI - timer))/2;
		camera.position.z = cameraPosZ*(1+Math.cos(Math.PI - timer))/2 - 200*(1+Math.cos(timer))/2;

		controls.rotateSpeed = 0;
		//Hastigheten med vilken f�rflyttningen sker.
		timer -= 0.02;
			
		if(timer < 0){
			timer = 0;
			//N�r f�rflyttningen �r klar s�tts previousObject (det klickade objektet) till objektet som nu �r i fokus.
			previousObject = sunSphere;
			//Denna loop ska se till att rotationen inte nollst�lls direkt efter ett hopp.
			for(var i = 0; i < clickableObjects.length; i++)
				if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2) {
					clickableObjects[i].rotation.z = clickableObjects[i].rotation.z - Math.PI*2;
					console.log("Planet-rotation nollstalld under hopp");
				}
			console.log("Fardig med hopp");
			controls.rotateSpeed = controlsRotSpeed;
		}
	} else {
		//Detta sker n�r det inte �r ett hopp p� g.
		galaxyGroup.position.x = 0;
		galaxyGroup.position.y = 0;

		//Denna loop nollst�ller planetens rotation vid ett helt varv.
		for(var i = 0; i < clickableObjects.length; i++)
			if(Math.abs(clickableObjects[i].rotation.z) > Math.PI*2) {
				clickableObjects[i].rotation.z = 0;
				console.log("Planet-rotation nollstalld utanfor hopp");
			}
	}
	
}