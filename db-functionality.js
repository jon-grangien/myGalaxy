// account functions
function createAccount() {
	// console.log("creating user account");
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
	Parse.User.logIn(username, userPassword, {
		success: function(loggedinuser) {
			user = loggedinuser;
			menusOnLogin();
			// console.log("logged in!");
		},
		error: function(user, error) {
		// The login failed. Check error to see why.
		console.log("login failed: " + error);
		}
	});
}

function logout() {
	Parse.User.logOut();
	menusOnLogout();
	// console.log("logged out");

}

function saveNewPlanet() {
	if(user && dbFunctionality) {
		var Planet = Parse.Object.extend("Planet");
		var dbPlanet = new Planet();

		dbPlanet.set("ownerName", username);
		dbPlanet.set("ownerId", user.id);

		// Initial values
		dbPlanet.set("texture", "earthmap.jpg");
		dbPlanet.set("radius", 80);
		dbPlanet.set("size", 1);	
		dbPlanet.set("rotationSpeed", 0.001);

		dbPlanet.save(null, {
		  success: function(dbPlanet) {
		    // Execute any logic that should take place after the object is saved.
		    console.log('New object saved with objectId: ' + dbPlanet.id);

		    // Push to planetIds
		    var tempArray = [activePlanet, dbPlanet.id, user.id];
		    planetIds.push(tempArray);

		  },
		  error: function(dbPlanet, error) {
		    // Execute any logic that should take place if the save fails.
		    // error is a Parse.Error with an error code and message.
		    console.log('Failed to create new object, with error: ' + error.message);
		  }
		});
	}

	else {
		console.log("no user logged in, planet not stored in db")
	}
}

function updatePlanet() {
	if(user && dbFunctionality) {
		var planetId;
		var planetOwnerId;
		var planetRadius;
		var planetSize;
		var planetRotationSpeed;
		var planetTexture;

		// Get id's
		for (var i = 0; i < planetIds.length; ++i) {
			if (planetIds[i][0] == activePlanet) {
				planetId = planetIds[i][1];
				planetOwnerId = planetIds[i][2];
			}
		}

		// Get radiuses
		for (var i = 0; i < planetOrbitRadiuses.length; i++) {
			if (planetOrbitRadiuses[i][0] == activePlanet) {
				planetRadius = planetOrbitRadiuses[i][1];
			}
		}

		// Get size (that's me!)
		for (var i = 0; i < planetSizes.length; i++) {
			if (planetSizes[i][0] == activePlanet) {
				planetSize = planetSizes[i][1];
			}
		}

		// Get rotation speed
		for (var i = 0; i < planetSpeeds.length; i++) {
			if (planetSpeeds[i][0] == activePlanet) {
				planetRotationSpeed = planetSpeeds[i][1];
			}
		}

		// Get texture file name
		for (var i = 0; i < planetTextureFiles.length; i++) {
			if (planetTextureFiles[i][0] == activePlanet) {
				planetTexture = planetTextureFiles[i][1];
			}
		}

		var Planet = Parse.Object.extend("Planet");
		var dbPlanet = new Planet();
		dbPlanet.id = planetId;

		// updated values
		dbPlanet.set("texture", planetTexture);
		dbPlanet.set("radius", planetRadius);
		dbPlanet.set("size", planetSize);	
		dbPlanet.set("rotationSpeed", planetRotationSpeed);

		dbPlanet.save(null, {
		  success: function(dbPlanet) {
		    // Execute any logic that should take place after the object is saved.
		    console.log('Updated ' + dbPlanet.get("ownerName") + '\'s object (objectId: ' + dbPlanet.id + ')');
		  },
		  error: function(dbPlanet, error) {
		    // Execute any logic that should take place if the save fails.
		    // error is a Parse.Error with an error code and message.
		    console.log('Failed to update object: ' + error.message);
		  }
		});
	}
}

// Load planets from db
function loadPlanets() {
	var Planet = Parse.Object.extend("Planet");		//make global
	var query = new Parse.Query(Planet);
	// query.equalTo("playerName", "Dan Stemkoski");
	query.find({
		success: function(results) {
			console.log("Successfully retrieved " + results.length + " planets.");
			// Do something with the returned Parse.Object values
			for (var i = 0; i < results.length; i++) { 
				var object = results[i];
				console.log(object.get('ownerName') + ' - ' + object.id + ' - ' + object.get('texture'));
	    		spawnLoadedPlanet(object.id, object.get('ownerId'), object.get('texture'), object.get('radius'), object.get('size'), object.get('rotationSpeed'));
	    	}

		},
	  	error: function(error) {
	    	console.log("Error retrieving planets: " + error.code + " " + error.message);
		}
	});
}

function spawnLoadedPlanet(id, ownerId, loadedTexture, loadedRadius, loadedSize, loadedRotationSpeed){
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
	var path = addOrbitPath(loadedRadius);
	sunSphere.add(path);

	// Planet
	var sphereGeometry = new THREE.SphereGeometry( 11, 60, 60 );
	var sphereMaterial = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/' + loadedTexture )} );
	activePlanet = new THREE.Mesh(sphereGeometry, sphereMaterial);	//activePlanet is a global var
	activePlanet.material.map.minFilter = THREE.NearestFilter;

	activePlanet.receiveShadow = true;
	activePlanet.castShadow = true;
	activePlanet.add(atmosphere);


	var activeGroup = new THREE.Object3D;
	activeGroup.position.x = 0;
	activeRotationSpeed = loadedRotationSpeed;
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

	activePlanet.scale.x = loadedSize;
	activePlanet.scale.y = loadedSize;
	activePlanet.scale.z = loadedSize;

	var tempArray;

	// Push to planetSpeeds (planets|rotationSpeeds)
	tempArray = [activePlanet, loadedRotationSpeed, loadedRotationSpeed];
	planetSpeeds.push(tempArray);

	// Push to planets (planets|moons)
	tempArray = [activePlanet];
	planets.push(tempArray);

	// Push to planetSizes
	tempArray = [activePlanet, loadedSize];
	planetSizes.push(tempArray);

	// Push to planetTextureFiles (planet|texture)
	tempArray = [activePlanet, "earthmap.jpg"];
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
	tempArray = [activePlanet, loadedRadius];
	planetOrbitRadiuses.push(tempArray);
	
	//tempArray = [activePlanet, 0];
	//planetHouses.push(tempArray);

	// Push to planetIds
	var tempArray = [activePlanet, id, ownerId];
    planetIds.push(tempArray);

	
	//A group containing all houses on the planet, this is the 5:th child of a new planet.
	var houseGroup = new THREE.Object3D;
	activePlanet.add(houseGroup);
	//A group containing all temporary houses (hovering houses) on the planet.
	var houseHoverGroup = new THREE.Object3D;
	activePlanet.add(houseHoverGroup);

}
