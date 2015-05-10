function addLight( h, s, l, x, y, z ) {
	var light = new THREE.PointLight( 0xaaffff, 1.5, 0 );
	light.color.setHSL( h, s, l );
	light.position.set( x, y, z );
	scene.add( light );

	var flareColor = new THREE.Color( 0x00ffff );
	flareColor.setHSL( h, s, l + 0.3 );

	var textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare01.png" );
	var lensFlare = new THREE.LensFlare( textureFlare0, 900, 0.0, THREE.AdditiveBlending, flareColor );
	lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	//lensFlare.position.copy( light.position );

	//scene.add( lensFlare );
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
	var atmosphereGeometry = new THREE.SphereGeometry( 11, 40, 40 );
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
	var sphereGeometry = new THREE.SphereGeometry( 11, 40, 40 );
	var sphereMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/earthmap.jpg' )} );
	activePlanet = new THREE.Mesh(sphereGeometry, sphereMaterial);	//activePlanet is a global var
	activePlanet.material.map.minFilter = THREE.NearestFilter;

	activePlanet.receiveShadow = true;
	activePlanet.castShadow = true;
	activePlanet.add(atmosphere);

	sunSphere.add(path);

	var activeGroup = new THREE.Object3D;
	activeGroup.position.x = 0;
	activeRotationSpeed = 0.001;
	planetNeedsInitialShift = true;

	//Hover-background
	var hoverGeometry = new THREE.SphereGeometry( 12, 40, 40 );
	var hoverMaterial = new THREE.ShaderMaterial( {
			    uniforms: {  },
				vertexShader:   document.getElementById( 'torusVertexShader'   ).textContent,
				fragmentShader: document.getElementById( 'torusFragmentShader' ).textContent,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );
	hoverMaterial.side = THREE.BackSide;
	hoverShell = new THREE.Mesh(hoverGeometry, hoverMaterial);
	visibility(hoverShell, false);
	activePlanet.add(hoverShell);
	//----------------hoverend------------------

	//Clicked-background
	var clickedGeometry = new THREE.SphereGeometry( 15, 40, 40 );
	var clickedMaterial = new THREE.ShaderMaterial( {
			    uniforms: {  },
				vertexShader:   document.getElementById( 'torusVertexShader'   ).textContent,
				fragmentShader: document.getElementById( 'torusFragmentShader' ).textContent,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );
	clickedMaterial.side = THREE.BackSide;
	clickedShell = new THREE.Mesh(clickedGeometry, clickedMaterial);
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


function addMeteorbelt2(){
	var meteorbelt = new THREE.Object3D;
	var meteorStoneGeometry;
	var meteorStoneMaterial;
	for(var i = 0; i < 800; i++){

		w = Math.floor((Math.random() * 1) + 1);
		h = Math.floor((Math.random() * 1) + 1);

		var rockSize = Math.random()*0.09+0.01
		meteorStoneGeometry = new THREE.SphereGeometry( rockSize, w, h );
		meteorStoneMaterial = new THREE.MeshPhongMaterial(  );
		rock = new THREE.Mesh(meteorStoneGeometry, meteorStoneMaterial);

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

		rock.translateX(xTrans);
		rock.translateY(yTrans);
		rock.translateZ(zTrans);

		meteorbelt.add(rock);
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
	var pathGeometry = new THREE.TorusGeometry( radius, 0.4, 16, 100 );
	var pathMaterial = new THREE.ShaderMaterial( {
			    uniforms: {  },
				vertexShader:   document.getElementById( 'torusVertexShader'   ).textContent,
				fragmentShader: document.getElementById( 'torusFragmentShader' ).textContent,
				side: THREE.BackSide,
				blending: THREE.AdditiveBlending,
				transparent: true
			}   );

	var path = new THREE.Mesh( pathGeometry, pathMaterial );

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

	var path = new THREE.Mesh( pathGeometry, pathMaterial );

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
	hoverMoonShell = new THREE.Mesh(hoverGeometry, hoverMaterial);
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
	clickedMoonShell = new THREE.Mesh(clickedGeometry, clickedMaterial);
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
	tempArray = [activePlanet, 20]; //the value 60 should maybe be replaced by a variable
	moonOrbitRadiuses.push(tempArray);
	
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
	user.set("username", newUsername);
	user.set("password", newUserPassword);	

	user.signUp(null, {
		success: function(user) {
			// log in
			username = newUsername;
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
		console.log("login failed: " + error);
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
		previousObject = activePlanet;

		for (var i = 0; i < planetGroups.length; ++i) {
			if (clickedObject.parent == planetGroups[i]) {
				activePlanet = clickedObject;
				console.log("clicked object is a planet");
			}
		}

		for (var i = 0; i < moonGroups.length; ++i) {
			if (clickedObject.parent == moonGroups[i]) {
				activeMoon = clickedObject;
				console.log("clicked object is a moon");
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


		if(check)	// if clicked object is a planet
		{
			for (var i = 0; i < clickedShells.length; ++i) {
				if (clickedShells[i][0] == activePlanet) {
					
					mesh = clickedShells[i][0];	//Extraxt clicked-mesh from array
					visibility(mesh.children[2],true); //Show clicked background

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
		}
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