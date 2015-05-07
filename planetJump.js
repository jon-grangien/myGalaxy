
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
			
				console.log("posx: " + posx + ", posz " + posz);

			camzoom = camera.position.z;
			console.log("Paborjar hopp");
		}
		//Skapa en mjuk övergång mellan nya och gamla positionen mha cosinus.
		galaxyGroup.position.x = posx*(1-Math.cos(timer))/2 - activePlanet.position.x*(1+Math.cos(timer))/2;
		galaxyGroup.position.y = posz*(1-Math.cos(timer))/2 - activePlanet.position.y*(1+Math.cos(timer))/2;
		rotationGroup.rotation.z = roty*(1-Math.cos(timer))/2 - activePlanet.rotation.z*(1+Math.cos(timer))/2;
		//OBS: raden under är en idé för att klara av sista punkten under planetförflyttning,
		//	dvs att automatisk skala zoomnivån efter planetens radie. För att den ska gå att implementera måste
		//	det gå att komma åt en planets radie på ett bra sätt. /Albin
		//camera.position.z = camzoom + (1-Math.cos(timer))*(1/2)*activePlanet.;

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
			
				console.log("posx: " + posx + ", posz " + posz);

			camzoom = camera.position.z;
			console.log("Paborjar hopp");
		}
		//Skapa en mjuk övergång mellan nya och gamla positionen mha cosinus.
		galaxyGroup.position.x = posx*(1-Math.cos(timer))/2 - sunSphere.position.x*(1+Math.cos(timer))/2;
		galaxyGroup.position.y = posz*(1-Math.cos(timer))/2 - sunSphere.position.y*(1+Math.cos(timer))/2;
		//OBS: raden under är en idé för att klara av sista punkten under planetförflyttning,
		//	dvs att automatisk skala zoomnivån efter planetens radie. För att den ska gå att implementera måste
		//	det gå att komma åt en planets radie på ett bra sätt. /Albin
		//camera.position.z = camzoom + (1-Math.cos(timer))*(1/2)*activePlanet.;

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
			console.log("Fardig med hopp");
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