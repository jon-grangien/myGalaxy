function addLight( h, s, l, x, y, z ) {
	var light = new THREE.PointLight( 0xaaffff, 1.5, 0 );
	light.color.setHSL( h, s, l );
	light.position.set( x, y, z );
	sunSphere.add( light );

	var flareColor = new THREE.Color( 0x00ffff );
	flareColor.setHSL( h, s, l + 0.3 );

	var textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare01.png" );
	var lensFlare = new THREE.LensFlare( textureFlare0, 900, 0.0, THREE.AdditiveBlending, flareColor );
	lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	//lensFlare.position.copy( light.position );

	//sunSphere.add( lensFlare );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

// Planet spawn (gui)
function addPlanet(){

	planetPropertiesFl.open();

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
	var path = addOrbitPath(60);	//60: path radius, newly spawned planet's intitial distance to sun (render loop)

	// Planet
	var sphereGeometry = new THREE.SphereGeometry( 11, 60, 60 );
	var sphereMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/earthmap.jpg' )} );
	activePlanet = new THREE.Mesh(sphereGeometry, sphereMaterial);	//activePlanet is a global var
	activePlanet.material.map.minFilter = THREE.NearestFilter;

	activePlanet.receiveShadow = true;
	activePlanet.castShadow = true;
	activePlanet.add(atmosphere);

	orbitsMother.push(path);
	for(var i = 0; i < orbitsMother.length; ++i)
			{
				sunSphere.add(orbitsMother[i]);
			}

	var activeGroup = new THREE.Object3D;
	activeGroup.position.x = 0;
	activeRotationSpeed = 0.001;
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
	//----------------hoverend------------------

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
	//----------------clickedend------------------
	



	// sunGroup.add(activeGroup);
	activeGroup.add(activePlanet);
	clickableObjects.push(activePlanet);
	planetGroups.push(activeGroup);
	addMeteorbelt();

	// Add planet group (and missing ones if exist) to sungroup
	for (var i = 0; i < planetGroups.length; ++i) {
	    if (planetGroups[i].parent !== sunSphere){
	    	sunSphere.add(planetGroups[i]);
	    	// console.log("new planet group added to sun")
	    }
	}

	var tempArray;

	// Push to planetSpeeds (planets|rotationSpeeds)
	tempArray = [activePlanet, activeRotationSpeed];
	planetSpeeds.push(tempArray);

	// Push to planets (planets|moons)
	tempArray = [activePlanet];
	planets.push(tempArray);

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
	tempArray = [activePlanet, 60]; //the value 60 should maybe be replaced by a variable
	planetOrbitRadiuses.push(tempArray);
	
	//tempArray = [activePlanet, 0];
	//planetHouses.push(tempArray);
	
	//A group containing all houses on the planet, this is the 5:th child of a new planet.
	var houseGroup = new THREE.Object3D;
	activePlanet.add(houseGroup);
	//A group containing all temporary houses (hovering houses) on the planet.
	var houseHoverGroup = new THREE.Object3D;
	activePlanet.add(houseHoverGroup);

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

	var path = new THREE.Mesh( pathGeometry, moonHoverMaterial );

	return path;
}

function updatePlanetTexture(textureName){
	if (textureName == "Earth") {
		activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/earthmap.jpg' );
		// console.log('earth selected');
	} else if (textureName == "Cloudy") {
		activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/cloudy.jpg' );
		// console.log('cloudy selected');
	} else if (textureName == "Steel") {
		activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/steeltexture.jpg' );
		// console.log('steel selected');
	} else if (textureName == "Terraformed mars") {
		activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/terramars.jpg' );
		// console.log('terramars selected');
	} else if (textureName == "Alien") {
		activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/alien.jpg' );
		// console.log('alien selected');
	} else if (textureName == "Desolate") {
		activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/desolate.png' );
		// console.log('desolate selected');
	} else if (textureName == "Sandy") {
		activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/sandy.jpg' );
		// console.log('sandy selected');
	} else if (textureName == "Klendathu") {
		activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/klendathu.png' );
		// console.log('klendathu selected');
	} else {
		activePlanet.material.map = THREE.ImageUtils.loadTexture( 'textures/scarl.png' );
		// console.log('scarl selected');
	}

	activePlanet.material.map.minFilter = THREE.NearestFilter;
	activePlanet.material.needsUpdate = true;
}

// Add moon to active planet (gui)
function addMoon() {

	//Open moon property-menusa
	moonPropertiesFl.open();

	//Turn off moon clicked background
	for (var i = 0; i < clickedMoonShells.length; ++i) {
		if (clickedMoonShells[i][0] == activeMoon) {

			mesh = clickedMoonShells[i][0];	//Extraxt clicked-mesh from array
			visibility(mesh.children[1],false); //Show clicked background
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

	//hover on moon shell
	var hoverGeometry = new THREE.SphereGeometry( 3, 32, 32 );
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
	//-------hoverend-------------

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
	//-------clickedend-------------
	

	// put moon to corresponding planet in array
	for (var i = 0; i < planets.length; ++i) {
		if (planets[i][0] == activePlanet) {
			planets[i].push(activeMoon)
			// console.log("current planet received a moon");
		}
	}

	// Push moon object + rotationSpeed
	tempArray = [activeMoon, activeRotationSpeed];
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

function playMusic(songFile) {
	if (currentSong != "") {		//something is being played
		if (music.ended) {		//it was just the last track that had ended,
			currentSong = "";	//update the variable
		} 


		else if (currentSong == songFile) {	//song playing is the song clicked in the gui,
			music.pause();			//pause song,
			currentSong = "";
			return;					//do nothing		
		}

		else {					//another song is being played than the one clicked in the gui
			music.pause();		//pause so new song can be played
		}
	}


	music = new Audio("music/" + songFile);
	music.play();
	currentSong = songFile;
}

// account functions
function createAccount() {
	console.log("creating user account");
	user = new Parse.User();
	user.set("username", newUserName);
	user.set("password", newUserPassword);	

	user.signUp(null, {
		success: function(user) {
			// log in
			username = newUserName;
			userPassword = newUserPassword;
			login();
		},
		error: function(user, error) {
			// Show error message and let the user try again
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

function login() {
	// console.log("logging in");
	Parse.User.logIn(username, userPassword, {
		success: function(loggedinuser) {
			user = loggedinuser;
			console.log("logged in!");
		},
		error: function(user, error) {
		// The login failed. Check error to see why.
		}
	});
}

function dummy() {
	console.log("i am dummy");
}

function onDocumentTouchStart( event ) {	
	event.preventDefault();
	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseDown( event );
}	

function onDocumentMouseDown( event ) {
	// console.log("mouse is down");

	event.preventDefault();
	mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	intersects = raycaster.intersectObjects( clickableObjects );
	


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
			visibility(mesh.children[1],false);
		}
	}


	if ( intersects.length > 0 ) {
		// console.log("we have an intersect");
		var clickedObject = intersects[0].object;
		if(jumpPlanetOk)
			previousObject = activePlanet;
		if(jumpMoonOk)
			previousObject = activeMoon;

		for (var i = 0; i < planetGroups.length; ++i) {
			if (clickedObject.parent == planetGroups[i]) {
				activePlanet = clickedObject;
				if(activePlanet.children.length > 4)
					activeMoon = activePlanet.children[4].children[0];
				console.log("clicked object is a planet");
			}
		}

		for (var i = 0; i < moonGroups.length; ++i) {
			if (clickedObject.parent == moonGroups[i]) {
				activeMoon = clickedObject;
				console.log("clicked object is a moon");
				activePlanet = activeMoon.parent.parent;
			}
		}


		var check = -1; //planet = 1, moon = 0 

		for (var i = 0; i < planetGroups.length; ++i) {
			if (clickedObject.parent == planetGroups[i]) {
				activePlanet = clickedObject;
				check = 1;
			}
		}

		for (var i = 0; i < moonGroups.length; ++i) {
			if (clickedObject.parent == moonGroups[i]) {
				activeMoon = clickedObject;
				check = 0;
			}
		}


		/*if(check)	// if clicked object is a planet
		{
			for (var i = 0; i < clickedShells.length; ++i) {
				if (clickedShells[i][0] == activePlanet) {
					
					mesh = clickedShells[i][0];	//Extraxt clicked-mesh from array
					visibility(mesh.children[2],true); //Show clicked background
				}
			}
			if(activePlanet.children.length > 0)
				console.log("hej2");
				for(var i = 0; i < clickedMoonShells.length; i++) {
					if (clickedMoonShells[i][0] == activePlanet.children[0]) {
						mesh = clickedMoonShells[i][0];	//Extraxt clicked-mesh from array
						visibility(mesh.children[1],true); //Show clicked background
						console.log("hej3");
					}
				}
		}
		else	// if clicked object is a moon
		{
			for (var i = 0; i < clickedMoonShells.length; ++i) {
				if (clickedMoonShells[i][0] == activeMoon) {

					mesh = clickedMoonShells[i][0];
					visibility(mesh.children[1],true);

				}
			}
		}*/
	}
	
	if ( intersects.length > 0 && buildHouseOk) {
		
		//Konvertera den globala koordinaten till det klickade objektets lokala koordinatsystem.
		createHouse(intersects[0].object.worldToLocal(intersects[0].point));

		buildHouseOk = false;
	}
}


//Hover funktion, visar att planeter är tryckbara
function onMouseMove( event ) {	
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
			visibility(mesh.children[0],false);
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
					visibility(mesh.children[0],true);

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

function addStars(){

	geometry = new THREE.Geometry();

	sprite1 = THREE.ImageUtils.loadTexture( "textures/sprites/snowflake1.png" );
	sprite2 = THREE.ImageUtils.loadTexture( "textures/sprites/star1.png" );
	sprite3 = THREE.ImageUtils.loadTexture( "textures/sprites/star2.png" );
	sprite4 = THREE.ImageUtils.loadTexture( "textures/sprites/star3.png" );
	sprite5 = THREE.ImageUtils.loadTexture( "textures/sprites/spark1.png" );

	for ( i = 0; i < 10000; i ++ ) {

		var vertex = new THREE.Vector3();
		vertex.x = Math.random()* 20000 - 10000;
		vertex.y = Math.random() * 20000 - 10000;
		vertex.z = Math.random() * 20000 - 10000;

		geometry.vertices.push( vertex );
	}

	parameters = [ [ [0.0, 0.0, 0.0], sprite2, 38 ],
				   [ [0.0, 0.0, 0.0], sprite3, 45 ],
				   [ [0.0, 0.0, 0.0], sprite1, 50 ],
				   [ [0.0, 0.0, 0.0], sprite5, 50 ],
				   [ [0.0, 0.0, 0.0], sprite4, 50 ],
				   ];

	for ( i = 0; i < parameters.length; i ++ ) {

		color  = parameters[i][0];
		sprite = parameters[i][1];
		size   = parameters[i][2];

		materials[i] = new THREE.PointCloudMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: true, transparent : true} );
		//materials[i].color.setHSL( color[0], color[1], color[2] );

		particles = new THREE.PointCloud( geometry, materials[i] );

		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;

		return particles;

	}
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
			            value: THREE.ImageUtils.loadTexture( 'explosion.png' )
			        },
			        time: { // float initialized to 0
			            type: "f", 
			            value: 0.0 
			        }
			    },
			    vertexShader: document.getElementById( 'vertexShaderProcedural' ).textContent,
			    fragmentShader: document.getElementById( 'fragmentShaderProcedural' ).textContent
			    
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
			rotationGroup.add(addStars());
			scene.add(rotationGroup);

			//Origo
			addLight( 0.55, 0.9, 0.5, 1, 1, 1 );
			addLight( 0.08, 0.8, 0.5, 2, 2, 2 );

}