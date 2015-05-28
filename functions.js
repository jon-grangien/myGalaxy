var textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare02.png" );
var textureFlare2 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare2.png" );
var textureFlare3 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare3.png" );



function addLight( h, s, l, x, y, z ) {

	var light = new THREE.PointLight( 0xffffff, 1.5, 4500 );
	light.color.setHSL( h, s, l );
	light.position.set( x, y, z );
	sunSphere.add( light );

	var flareColor = new THREE.Color( 0xffffff );
	flareColor.setHSL( h, s, l + 0.5 );

	lensFlare = new THREE.LensFlare( textureFlare0, 6400, 0.0, THREE.AdditiveBlending, flareColor );

	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

	lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

	lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	lensFlare.position.copy( light.position );

	sunSphere.add( lensFlare );
	
}

function addSun(){
	/************* SUN ****************/
	/* create custom material from the shader code above
	that is within specially labeled script tags */
	customSunMaterial = new THREE.ShaderMaterial( {
	    uniforms: {
			//cameraPos: { type: "v3", value: new THREE.Vector3() }
		},
		vertexShader:   document.getElementById( 'vertexShaderSun'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShaderSun' ).textContent,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );


		
	sunGeometry = new THREE.SphereGeometry( 19, 54, 54 );
	sunSphere = new THREE.Mesh( sunGeometry, customSunMaterial );
	activePlanet = sunSphere;
	clickedObject = sunSphere;


	//Procedural Sun	
    proceduralSunMaterial = new THREE.ShaderMaterial( {

	    uniforms: { 
	        tExplosion: {
	            type: "t", 
	            value: THREE.ImageUtils.loadTexture( 'textures/explosion.png' )
	        },
	        time: { // float initialized to 0
	            type: "f", 
	            value: 0.0 
	        }
	    },
	    vertexShader: document.getElementById( 'vertexShaderProcedural' ).textContent,
	    fragmentShader: document.getElementById( 'fragmentShaderProcedural' ).textContent,
	    side: THREE.BackSide,
		//blending: THREE.AdditiveBlending,
	    transparent: true
	    
	} );


    // create a sphere and assign the material
    proceduralSun = new THREE.Mesh( 
        new THREE.IcosahedronGeometry( 12, 5 ), 
        proceduralSunMaterial 
    );
	sunSphere.add(proceduralSun);
    

	galaxyGroup = new THREE.Object3D;
	rotationGroup = new THREE.Object3D;
	galaxyGroup.add(sunSphere);
	//clickableObjects.push(sunSphere);


	rotationGroup.add(galaxyGroup);

	scene.add(rotationGroup);

	//Origo
	addLight( 0.55, 0.9, 0.5, 0, 0.5, 1 );
	addLight( 0.08, 0.8, 0.5, 1, -0.5, 0 );

}

function turnOnLensFlare(bool){
	if(!bool)
		proceduralSun.material.side = THREE.FrontSide;
	else
		proceduralSun.material.side = THREE.BackSide;

	visibility(lensFlare, bool);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// Planet spawn
function addPlanet(id, ownerId, name, textureFile, radius, size, rotationSpeed, isLoadedPlanet){
	
	if(soundOn)
		document.getElementById('multiaudio1').play();
	
	thereArePlanets = true;
	activeMoon = null;

	//Turn off planet clicked background
	for (var i = 0; i < clickedShells.length; ++i) {
		if (clickedShells[i][0] == activePlanet) {
			mesh = clickedShells[i][0];	//Extraxt clicked-mesh from array
			visibility(mesh.children[2],false); //Show clicked background
		}
	}

	// Atmosphere
	var atmosphereGeometry = new THREE.SphereGeometry( 12.5, 60, 60 );
	var atmosphereMaterial = new THREE.ShaderMaterial( {
	    uniforms: {  },
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader2' ).textContent,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );

	var atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
	atmosphere.receiveShadow = false;
	atmosphere.castShadow = false;

	// orbit path
	var path = addOrbitPath(radius);
	sunSphere.add(path);

	// Planet
	var sphereGeometry = new THREE.SphereGeometry( 11, 60, 60 );
	var sphereMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/' + textureFile )} );
	activePlanet = new THREE.Mesh(sphereGeometry, sphereMaterial);	//activePlanet is a global var
	activePlanet.material.map.minFilter = THREE.NearestFilter;

	activePlanet.receiveShadow = true;
	activePlanet.castShadow = true;
	activePlanet.add(atmosphere);


	var activeGroup = new THREE.Object3D;
	activeGroup.position.x = 0;
	activeRotationSpeed = rotationSpeed;
	planetNeedsInitialShift = true;

	//Hover-background
	var hoverGeometry = new THREE.SphereGeometry( 12, 60, 60 );
	var hoverMaterial = new THREE.ShaderMaterial( {
			    uniforms: {  },
				vertexShader:   document.getElementById( 'torusVertexShader'   ).textContent,
				fragmentShader: document.getElementById( 'torusFragmentShader' ).textContent,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );
	hoverMaterial.side = THREE.BackSide;
	hoverShell = new THREE.Mesh(hoverGeometry, planetHoverMaterial);
	visibility(hoverShell, false);
	activePlanet.add(hoverShell);

	//Clicked-background
	var clickedGeometry = new THREE.SphereGeometry( 15, 60, 60 );
	var clickedMaterial = new THREE.ShaderMaterial( {
			    uniforms: {  },
				vertexShader:   document.getElementById( 'torusVertexShader'   ).textContent,
				fragmentShader: document.getElementById( 'torusFragmentShader' ).textContent,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );
	clickedMaterial.side = THREE.BackSide;
	clickedShell = new THREE.Mesh(clickedGeometry, planetHoverMaterial);
	visibility(clickedShell, false);
	activePlanet.add(clickedShell);

	activeGroup.add(activePlanet);
	clickableObjects.push(activePlanet);
	planetGroups.push(activeGroup);
	addMeteorbelt();

	for (var i = 0; i < planetGroups.length; ++i) {
	    if (planetGroups[i] == activeGroup){
	    	sunSphere.add(planetGroups[i]);
	    }
	}

	// to do: set sizes above instead
	activePlanet.scale.x = size;
	activePlanet.scale.y = size;
	activePlanet.scale.z = size;

	var tempArray;

	// Push to planetNames (planets|names)
	tempArray = [activePlanet, name];
	planetNames.push(tempArray);

	// Push to planetSpeeds (planets|rotationSpeeds)
	tempArray = [activePlanet, activeRotationSpeed, activeRotationSpeed];
	planetSpeeds.push(tempArray);

	// Push to planets (planets|moons)
	tempArray = [activePlanet];
	planets.push(tempArray);

	// Push to planetSizes
	tempArray = [activePlanet, size];
	planetSizes.push(tempArray);

	// Push to planetTextureFiles (planet|texture)
	tempArray = [activePlanet, textureFile];
	planetTextureFiles.push(tempArray);

	// Push to planetPaths
	tempArray = [activePlanet, path];
	planetPaths.push(tempArray);

	// Push to hoverShells
	tempArray = [activePlanet, hoverShell];
	hoverShells.push(tempArray);

	// Push to clickedShells
	tempArray = [activePlanet, clickedShell];
	clickedShells.push(tempArray);

	// Push to planetOrbitRadiuses
	tempArray = [activePlanet, radius];
	planetOrbitRadiuses.push(tempArray);

	if(isLoadedPlanet) {
		// Planet is loaded from db and needs id's specified
		var tempArray = [activePlanet, id, ownerId];
	    planetIds.push(tempArray);
	}
	
	//A group containing all houses on the planet, this is the 5:th child of a new planet.
	var houseGroup = new THREE.Object3D;
	activePlanet.add(houseGroup);
	//A group containing all temporary houses (hovering houses) on the planet.
	var houseHoverGroup = new THREE.Object3D;
	activePlanet.add(houseHoverGroup);

	if(!isLoadedPlanet) {
		// Planet is not loaded from db and needs to be stored in it
		saveNewPlanetToDB();
	}

	

}

function addMeteorbelt(){
	var meteorbelt = new THREE.Object3D;
	geometry = new THREE.Geometry();

	sprite1 = THREE.ImageUtils.loadTexture( "textures/sprites/meteor11.png" );
	//sprite2 = THREE.ImageUtils.loadTexture( "textures/sprites/meteor2.png" );


	for ( i = 0; i < 10000; i ++ ) {

		var vertex = new THREE.Vector3();

		sunRadius = 16;
		sunRadius = Math.random()*9 + sunRadius;

		var xTrans = (Math.random() -0.5)*2*sunRadius;
		var yTrans;
		if(Math.random() < 0.5){
			yTrans = Math.sqrt(sunRadius*sunRadius-xTrans*xTrans);
		}
		else
			yTrans = -Math.sqrt(sunRadius*sunRadius-xTrans*xTrans);

		var zTrans = 0;

		vertex.x = xTrans;
		vertex.y = yTrans;
		vertex.z = zTrans;

		geometry.vertices.push( vertex );
	}

	parameters = [ [ [0.0, 0.0, 0.0], sprite1, 0.05 ] ];


	for ( i = 0; i < parameters.length; i ++ ) {

		color  = parameters[i][0];
		sprite = parameters[i][1];
		size   = parameters[i][2];

		materials2[i] = new THREE.PointCloudMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: true, transparent : true} );
		particles = new THREE.PointCloud( geometry, materials2[i] );

		meteorbelt.add( particles );
	}

	visibility(meteorbelt,false);
	activePlanet.add(meteorbelt);

		var tempArray;
		// Push to meteorbelts (planets|meteorbelts)
		tempArray = [activePlanet, meteorbelt];
		meteorbelts.push(tempArray);
}


// Add orbit path torus about sun to planets
function addOrbitPath(radius) {
	var pathGeometry = new THREE.TorusGeometry( radius, 0.3, 16, 100 );

	var path = new THREE.Mesh( pathGeometry, planetOrbitMaterial );

	if(!showOrbits)
		path.visible = false;

	return path;
}

function addMoonOrbitPath(moonRadius) {
	var pathGeometry = new THREE.TorusGeometry( moonRadius, 0.2, 16, 100 );
	var pathMaterial = new THREE.ShaderMaterial( {
			    uniforms: {  },
				vertexShader:   document.getElementById( 'torusVertexShader'   ).textContent,
				fragmentShader: document.getElementById( 'torusMoonFragmentShader' ).textContent,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );

	var path = new THREE.Mesh( pathGeometry, moonOrbitMaterial );

	return path;
}

function updatePlanetTexture(textureFile) {
	activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/' + textureFile );
	activePlanet.material.map.minFilter = THREE.NearestFilter;
	activePlanet.material.needsUpdate = true;

	for (var i = 0; i < planetTextureFiles.length; ++i) {
		if (planetTextureFiles[i][0] == activePlanet) {
			planetTextureFiles[i][1] = textureFile;
		}
	}
}

// Add moon to active planet (gui)
function addMoon() {
	thereAreMoons = true;

	if(soundOn)
		document.getElementById('multiaudio8').play();

	//Turn off moon clicked background
	for (var i = 0; i < clickedMoonShells.length; ++i) {
		if (clickedMoonShells[i][0] == activeMoon) {

			mesh = clickedMoonShells[i][0];	//Extraxt clicked-mesh from array
			visibility(mesh.children[2],false); //Show clicked background
		}
	}

	var sphereGeometry = new THREE.SphereGeometry( 2, 32, 32 );
	var sphereMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/moontexture.jpg' )} );
	activeMoon = new THREE.Mesh(sphereGeometry, sphereMaterial);
	activeMoon.receiveShadow = true;
	activeMoon.castShadow = true;
	var activeGroup = new THREE.Object3D;
	activeGroup.add(activeMoon);

	var path = addMoonOrbitPath(20);
	activeMoon.parent.add(path);

	activeMoon.position.x = 0;
	activeRotationSpeed = 0.001;
	moonNeedsInitialShift = true;

	clickableObjects.push(activeMoon);
	// activePlanet.add(activeMoon);
	activePlanet.add(activeGroup);
	moonGroups.push(activeGroup);

	// Atmosphere
	var atmosphereGeometry = new THREE.SphereGeometry( 3, 32, 32 );
	var atmosphereMaterial = new THREE.ShaderMaterial( {
	    uniforms: {  },
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShaderMoonAtmos' ).textContent,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );

	var atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
	atmosphere.receiveShadow = false;
	atmosphere.castShadow = false;
	
	activeMoon.add(atmosphere);

	//hover on moon shell
	var hoverGeometry = new THREE.SphereGeometry( 2.8, 32, 32 );
	var hoverMaterial = new THREE.ShaderMaterial( {
			    uniforms: {  },
				vertexShader:   document.getElementById( 'torusVertexShader'   ).textContent,
				fragmentShader: document.getElementById( 'torusMoonFragmentShader' ).textContent,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );
	hoverMaterial.side = THREE.BackSide;
	hoverMoonShell = new THREE.Mesh(hoverGeometry, moonHoverMaterial);
	visibility(hoverMoonShell,false);
	activeMoon.add(hoverMoonShell);

	//click on moon shell
	var clickedGeometry = new THREE.SphereGeometry( 4, 32, 32 );
	var clickedMaterial = new THREE.ShaderMaterial( {
			    uniforms: {  },
				vertexShader:   document.getElementById( 'torusVertexShader'   ).textContent,
				fragmentShader: document.getElementById( 'torusMoonFragmentShader' ).textContent,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );
	clickedMaterial.side = THREE.BackSide;
	clickedMoonShell = new THREE.Mesh(clickedGeometry, moonHoverMaterial);
	visibility(clickedMoonShell,false);
	activeMoon.add(clickedMoonShell);

	// put moon to corresponding planet in array
	for (var i = 0; i < planets.length; ++i) {
		if (planets[i][0] == activePlanet) {
			planets[i].push(activeMoon)
			// console.log("current planet received a moon");
		}
	}

	// Push moon object + rotationSpeed
	tempArray = [activeMoon, activeRotationSpeed, activeRotationSpeed];
	moonSpeeds.push(tempArray);

	// Push to planetPaths
	tempArray = [activeMoon, path];
	moonPaths.push(tempArray);

	//Push moon to planetObjects
	tempArray = [activePlanet, activeMoon];
	planetObjects.push(tempArray);

	// Push to hoverShells
	tempArray = [activeMoon, hoverMoonShell];
	hoverMoonShells.push(tempArray);

	// Push to clickedShells
	tempArray = [activeMoon, clickedMoonShell];
	clickedMoonShells.push(tempArray);

	// Push to planetOrbitRadiuses
	tempArray = [activePlanet, 20]; //the value 20 should maybe be replaced by a variable
	moonOrbitRadiuses.push(tempArray);
	
	//A group containing all houses on the moon, this is the 3:th child of a moon.
	var houseGroup = new THREE.Object3D;
	activeMoon.add(houseGroup);
	//A group containing all temporary houses (hovering houses) on the moon.
	var houseHoverGroup = new THREE.Object3D;
	activeMoon.add(houseHoverGroup);
	
	// console.log("moon spawned");
}

function deletePlanet() {
	//print array
	// console.log("array before/after delete:")
	// for (var i = 0; i < array.length; ++i) {
	// 	console.log(array[i][0] + " " + array[i][1])
	// }

	// Delete from planetSpeeds (planets|rotationSpeeds)
	for (var i = 0; i < planetSpeeds.length; ++i) {
		if (planetSpeeds[i][0] == activePlanet) {
			planetSpeeds.splice(i, 1);	//remove 1 element (array) from index i
		}
	}

	// Delete from planets (planets|moons)
	for (var i = 0; i < planets.length; ++i) {
		if (planets[i][0] == activePlanet) {
			planets.splice(i, 1);	//remove 1 element (array) from index i
		}
	}

	// Delete from planetSizes (planet|size)
	for (var i = 0; i < planetSizes.length; ++i) {
		if (planetSizes[i][0] == activePlanet) {
			planetSizes.splice(i, 1) //remove 1 element (array) from index i
		}
	}

	// Delete from hoverShells (planet|shell)
	for (var i = 0; i < hoverShells.length; ++i) {
		if (hoverShells[i][0] == activePlanet) {
			hoverShells.splice(i, 1) //remove 1 element (array) from index i
		}
	}

	// Delete from clickedShells (planet|shell)
	for (var i = 0; i < clickedShells.length; ++i) {
		if (clickedShells[i][0] == activePlanet) {
			clickedShells.splice(i, 1) //remove 1 element (array) from index i
		}
	}

	// Delete from planetOrbitRadiuses (planet|radius)
	for (var i = 0; i < planetOrbitRadiuses.length; ++i) {
		if (planetOrbitRadiuses[i][0] == activePlanet) {
			planetOrbitRadiuses.splice(i, 1) //remove 1 element (array) from index i
		}
	}

	// Find and remove planet from sun
	for (var i = 0; i < planetGroups.length; ++i) {
	    if (planetGroups[i].children[0] == activePlanet){
	    	planetGroups[i].remove(0);				//remove planet (child) from planetGroup (parent)
	    	sunSphere.remove(planetGroups[i]);		//remove planetGroup (child) from sun (parent)
	    }
	}


	// Delete from planetPaths (planet|path)
	for (var i = 0; i < planetPaths.length; ++i) {
		if (planetPaths[i][0] == activePlanet) {
			sunSphere.remove(planetPaths[i][1]);	//remove orbit (child) from sun (parent)
			planetPaths.splice(i, 1) //remove 1 element (array) from index 0
		}
	}

	// Delete from planetIds (planet|planet id|owner user id)
	for (var i = 0; i < planetIds.length; ++i) {
		if (planetIds[i][0] == activePlanet) {
			planetIds.splice(i, 1);	//remove 1 element (array) from index i
		}
	}

	activePlanet = null;
}

function buildHouse() {
	// console.log("house function called");
	if(!jumpInAction) {
		// console.log("jump is in action?");
		if(!buildHouseOk) {
			buildHouseOk = true;
		} else {
			buildHouseOk = false;
		}
	}
}

function playMusic(songFile) {
	if (currentSong != "") {		//something is being played
		if (music.ended) {			//it was just the last track that had ended,
			currentSong = "";		//update the variable
		} 

		else if (currentSong == songFile) {	//song playing is the song clicked in the gui,
			music.pause();					//pause song,
			currentSong = "";
			return;							//do nothing		
		}

		else {						//another song is being played than the one clicked in the gui
			music.pause();			//pause so new song can be played
		}
	}


	music = new Audio("music/" + songFile);
	music.play();
	currentSong = songFile;
}

function onDocumentTouchStart( event ) {	
	event.preventDefault();
	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseDown( event );
}	

function onDocumentMouseDown( event ) {
	// console.log("mouse is down");
	if (!selectPlanetsOk && !buildHouseOk) {
		return;		//do nothing (disable functionality)
	}

	
	event.preventDefault();
	mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	intersects = raycaster.intersectObjects( clickableObjects );
	

	if (selectPlanetsOk) {
		//Hides planet clicked
		for (var i = 0; i < clickedShells.length; ++i) {
			if (clickedShells[i][0] == activePlanet) {
				
				mesh = clickedShells[i][0];
				visibility(mesh.children[2],false);
			}
		}

		//Hides moon clicked
		for (var i = 0; i < clickedMoonShells.length; ++i) {
			if (clickedMoonShells[i][0] == activeMoon) {
				
				mesh = clickedMoonShells[i][0];
				visibility(mesh.children[2],false);
			}
		}
	}

	// Handle active object if no jumping and if not editing
	if ( intersects.length > 0 && !jumpInAction && selectPlanetsOk) {
		var planetIsSelected = false; 


		var clickedObject = intersects[0].object;
		if(jumpPlanetOk)
			previousObject = activePlanet;
		if(jumpMoonOk)
			previousObject = activeMoon;


		for (var i = 0; i < planetGroups.length; ++i) {
			if (clickedObject.parent == planetGroups[i]) {
				activePlanet = clickedObject;
				planetIsSelected = true;
				if(!jumpMoonOk)
					activeMoon = null;
			}

			if(!jumpPlanetOk && soundOn)
				document.getElementById('multiaudio4').play();
			// console.log("clicked object is a planet");
		}

		for (var i = 0; i < moonGroups.length; ++i) {
			if (clickedObject.parent == moonGroups[i]) {
				activeMoon = clickedObject;
				activePlanet = activeMoon.parent.parent;
				planetIsSelected = true;

				// console.log("clicked object is a moon");
				if(!jumpMoonOk && soundOn)
					document.getElementById('multiaudio4').play();
			}
		}

		// If planet is selected and not viewing planet/moon, make sure edit button is displayed
		if (planetIsSelected && !jumpPlanetOk && !jumpMoonOk) {
			showButtonsForActivePlanet();
		}
	}
	
	// House functionality if house function called and if editing
	if ( intersects.length > 0 && buildHouseOk && !selectPlanetsOk) {
		
		//Konvertera den globala koordinaten till det klickade objektets lokala koordinatsystem.
		createHouse(intersects[0].object.worldToLocal(intersects[0].point));

		buildHouseOk = false;
	}

	//Deselect on right-click
	if(event.which == 3){
		if(!jumpPlanetOk && !jumpMoonOk){
	     	$('#edit-planet-tabs').hide();
			$('#accordion-container').hide();
			$("#jump-planet-moon-container").css({"right": "120px" });  //move in

			if(!jumpPlanetOk && !jumpMoonOk) {     //not viewing planet/moon
			    $('#edit-planet-button').hide();
			    $('#add-planet-button').show();
			} else {
			    $('#build-planet-button').show();   //viewing planet/moon

			}

			selectPlanetsOk = true;
			planetIsSelected = false;
			$('#jump-planet-button').hide();
				

	     	for (var i = 0; i < clickedShells.length; ++i) {
	     		if (clickedShells[i][0] == activePlanet) {
	     			
	     			mesh = clickedShells[i][0];
	     			visibility(mesh.children[2],false);
	     		}
	     	}

	     	//Hides moon clicked
	     	for (var i = 0; i < clickedMoonShells.length; ++i) {
	     		if (clickedMoonShells[i][0] == activeMoon) {
	     			
	     			mesh = clickedMoonShells[i][0];
	     			visibility(mesh.children[2],false);
	     		}
	     	}

	     	activePlanet = null;
	     	activeMoon = null;
		}
	}


}


//Hover funktion, visar att planeter är tryckbara
function onMouseMove( event ) {
	if(!selectPlanetsOk && !buildHouseOk) {
		return;		//do nothing (disable functionality)
	}

	event.preventDefault();
	mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	intersects = raycaster.intersectObjects( clickableObjects );
	
	//Hides planet hover
	for (var i = 0; i < hoverShells.length; ++i) {
		if (hoverShells[i][0] == hoveredPlanet) {
			
			mesh = hoverShells[i][0];
			visibility(mesh.children[1],false);
		}
	}
	//Hides moon hover
	for (var i = 0; i < hoverMoonShells.length; ++i) {
		if (hoverMoonShells[i][0] == hoveredMoon) {
			
			mesh = hoverMoonShells[i][0];
			visibility(mesh.children[1],false);
		}
	}


	if ( intersects.length > 0 ) {
		
		var check = -1; //planet = 1, moon = 0 

		var clickedObject = intersects[0].object;

		for (var i = 0; i < planetGroups.length; ++i) {
			if (clickedObject.parent == planetGroups[i]) {
				hoveredPlanet = clickedObject;
				check = 1;
			}
		}

		for (var i = 0; i < moonGroups.length; ++i) {
			if (clickedObject.parent == moonGroups[i]) {
				hoveredMoon = clickedObject;
				check = 0;
			}
		}


		if(check)	// if hovered object is a planet
		{
			for (var i = 0; i < hoverShells.length; ++i) {
				if (hoverShells[i][0] == hoveredPlanet) {
					
					mesh = hoverShells[i][0];	//Extraxt hover-mesh from array
					visibility(mesh.children[1],true); //Show hover background

				}
			}
		}
		else	// if hovered object is a moon
		{
			for (var i = 0; i < hoverMoonShells.length; ++i) {
				if (hoverMoonShells[i][0] == hoveredMoon) {

					mesh = hoverMoonShells[i][0];
					visibility(mesh.children[1],true);

				}
			}
		}
		
	}
	
	//If-satsen gör att man kan hovra med ett hus över en planet.
	if(buildHouseOk) {		
		if(jumpPlanetOk) {

			//En forloop som ser till att det inte spawnar hus överallt där man har musen.
			for ( i = activePlanet.children[5].children.length; i >= 0; i-- )
				activePlanet.children[5].remove(activePlanet.children[5].children[i]);
			if ( intersects.length > 0 && intersects[0].object == activePlanet) {
				//Konvertera den globala koordinaten till det klickade objektets lokala koordinatsystem.
				showHouse(intersects[0].object.worldToLocal(intersects[0].point));
			}
		}
		
		if(jumpMoonOk) {
			//En forloop som ser till att det inte spawnar hus överallt där man har musen.
			for ( i = activeMoon.children[3].children.length; i >= 0; i-- )
				activeMoon.children[3].remove(activeMoon.children[3].children[i]); 
			if ( intersects.length > 0 && intersects[0].object == activeMoon) {
				//Konvertera den globala koordinaten till det klickade objektets lokala koordinatsystem.
				showHouse(intersects[0].object.worldToLocal(intersects[0].point));
			}
		}
	}
}

function lensFlareUpdateCallback( object ) {
    var f, fl = this.lensFlares.length;
    var flare;
    var vecX = -this.positionScreen.x * 2;
    var vecY = -this.positionScreen.y * 2;
    var camDistance = camera.position.length();

    for( f = 0; f < fl; f ++ ) {

        flare = this.lensFlares[ f ];

        flare.x = this.positionScreen.x + vecX * flare.distance;
        flare.y = this.positionScreen.y + vecY * flare.distance;

        flare.wantedRotation = flare.x * Math.PI * 0.25;
        flare.rotation += ( flare.wantedRotation - flare.rotation ) * 0.25;

        flare.scale = 1 / camDistance * 200;
    }

}

function visibility(object, bool){
	object.traverse(function(child) {child.visible = bool;});
}

function loadStars(){
	geometry = new THREE.Geometry();
	
	sprite1 = THREE.ImageUtils.loadTexture( "textures/sprites/star12.png" );
	sprite2 = THREE.ImageUtils.loadTexture( "textures/sprites/star12.png" );
	sprite3 = THREE.ImageUtils.loadTexture( "textures/sprites/star13.png" );
	sprite4 = THREE.ImageUtils.loadTexture( "textures/sprites/star14.png" );
	sprite5 = THREE.ImageUtils.loadTexture( "textures/sprites/star15.png" );
	
	for ( i = 0; i < 20000; i ++ ) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random()* 20000 - 10000;
		vertex.y = Math.random() * 20000 - 10000;
		vertex.z = Math.random() * 20000 - 10000;

		if(Math.abs(vertex.x) > 1000 || Math.abs(vertex.y) > 1000 || Math.abs(vertex.z) > 1000) {
			geometry.vertices.push( vertex );
		}
	}

	parameters = [ [ [0.0, 0.0, 0.0], sprite1, 90 ],
					 [ [0.0, 0.0, 0.0], sprite2, 80 ],
					 [ [0.0, 0.0, 0.0], sprite3, 100 ],
					 [ [0.0, 0.0, 0.0], sprite4, 70 ],
					 [ [0.0, 0.0, 0.0], sprite5, 60 ]];
					 		 
	var particles = [];
	
	for ( i = 0; i < 5; ++i ) {	
		//color  = parameters[i][0];
		sprite = parameters[i][1];
		size   = parameters[i][2];

		materials[i] = new THREE.PointCloudMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: true, transparent : true, alphaTest: 0.015, opacity: 0.85, fog: 0.8} );

		//materials[i].color.setHSL( color[0], color[1], color[2] );

		particles = new THREE.PointCloud( geometry, materials[i] );

		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;
		
		stars.push(particles);


	}
}

function keyDown(e){
	
	var keynum;

    if(window.event){ // IE					
    	keynum = e.keyCode;
    }else
        if(e.which){ // Netscape/Firefox/Opera					
    		keynum = e.which;
         }
    //alert(String.fromCharCode(keynum));
    if(String.fromCharCode(keynum) == "H"){

    	console.log(activePlanetSize);
    	if(showOrbits){
    		showOrbits = false;
    	}
    	else
    		showOrbits = true;

    	showOrbitsFunction();
    }

    if(String.fromCharCode(keynum) == "D"){

    	if(!jumpPlanetOk && !jumpMoonOk){
         	$('#edit-planet-tabs').hide();
			$('#accordion-container').hide();
			$("#jump-planet-moon-container").css({"right": "120px" });  //move in

			if(!jumpPlanetOk && !jumpMoonOk) {     //not viewing planet/moon
			    $('#edit-planet-button').hide();
			    $('#add-planet-button').show();
			} else {
			    $('#build-planet-button').show();   //viewing planet/moon

			}

			selectPlanetsOk = true;
			planetIsSelected = false;
			$('#jump-planet-button').hide();
				

         	for (var i = 0; i < clickedShells.length; ++i) {
         		if (clickedShells[i][0] == activePlanet) {
         			
         			mesh = clickedShells[i][0];
         			visibility(mesh.children[2],false);
         		}
         	}

         	//Hides moon clicked
         	for (var i = 0; i < clickedMoonShells.length; ++i) {
         		if (clickedMoonShells[i][0] == activeMoon) {
         			
         			mesh = clickedMoonShells[i][0];
         			visibility(mesh.children[2],false);
         		}
         	}

         	activePlanet = null;
         	activeMoon = null;
    	}
    	
    }


    if(String.fromCharCode(keynum) == "Q"){

    	if(showMenu){
    		$('#all-panels').hide();
    		showMenu = false
    	}
    	else{
    		$('#all-panels').show();
    		showMenu = true;
    	}
    }
}


function showOrbitsFunction(){
	for (var i = 0; i < planetPaths.length; ++i) {
		planetPaths[i][1].visible = showOrbits;
	}
	for (var i = 0; i < moonPaths.length; ++i) {
		moonPaths[i][1].visible = showOrbits;
	}
}


function showBuild(input){
	if(input == 1){
		console.log('GOOOSE'); 
		buildHouseOk = true;
		building = input;
	}

	if(input == 2){
		console.log('TOWER'); 
		buildHouseOk = true;
		building = input;
	}

	if(input == 3){
		console.log('FISH'); 
	}

	if(input == 4){
		console.log('LIBRARY'); 
	}

	if(input == 5){
		console.log('SATELLITE'); 
	}

	if(input == 6){
		console.log('ANTKA'); 
	}

}