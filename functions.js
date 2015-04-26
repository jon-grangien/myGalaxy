function addLight( h, s, l, x, y, z ) {
	var light = new THREE.PointLight( 0xffffff, 1.5, 0 );
	light.color.setHSL( h, s, l );
	light.position.set( x, y, z );
	scene.add( light );

	var flareColor = new THREE.Color( 0xffffaa );
	flareColor.setHSL( h, s, l + 0.3 );

	var textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare0.png" );

	var lensFlare = new THREE.LensFlare( textureFlare0, 900, 0.0, THREE.AdditiveBlending, flareColor );

	lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	//lensFlare.position.copy( light.position );

	scene.add( lensFlare );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

// Planet spawn (gui)
function addPlanet(){
	// Atmosphere
	var atmosphereGeometry = new THREE.SphereGeometry( 11, 32, 32 );
	var atmosphereMaterial = new THREE.ShaderMaterial( {
	    uniforms: {  },
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader2' ).textContent,
		side: THREE.BackSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );

	var atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

	// orbit path
	var path = addOrbitPath(60);	//60: path radius, newly spawned planet's intitial distance to sun (render loop)

	// Planet
	var sphereGeometry = new THREE.SphereGeometry( 11, 32, 32 );
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

	// sunGroup.add(activeGroup);
	activeGroup.add(activePlanet);
	clickableObjects.push(activePlanet);
	planetGroups.push(activeGroup);

	// Add planet group (and missing ones if exist) to sungroup
	for (var i = 0; i < planetGroups.length; ++i) {
	    if (planetGroups[i].parent !== sunSphere){
	    	sunSphere.add(planetGroups[i]);
	    	console.log("new planet group added to sun")
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
}

// Add orbit path torus about sun to planets
function addOrbitPath(radius) {
	var pathGeometry = new THREE.TorusGeometry( radius, 0.5, 16, 100 );
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



	console.log("moon spawned");
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

function onDocumentTouchStart( event ) {	
	event.preventDefault();
	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseDown( event );
}	

function onDocumentMouseDown( event ) {
	console.log("mouse is down");

	event.preventDefault();
	mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	intersects = raycaster.intersectObjects( clickableObjects );

	if ( intersects.length > 0 ) {
		console.log("we have an intersect");
		var clickedObject = intersects[0].object;

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