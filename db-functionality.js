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

function saveNewPlanetToDB() {
	if(user && dbFunctionality) {
		var Planet = Parse.Object.extend("Planet");
		var dbPlanet = new Planet();

		dbPlanet.set("ownerName", username);
		dbPlanet.set("ownerId", user.id);

		// Initial values
		dbPlanet.set("name" , "");
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

function updatePlanetInDB() {
	if(user && dbFunctionality) {
		var planetId;
		var planetOwnerId;
		var planetRadius;
		var planetSize;
		var planetRotationSpeed;
		var planetTexture;
		var planetName;

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

		// Get planet name
		for (var i = 0; i < planetNames.length; i++) {
			if (planetNames[i][0] == activePlanet) {
				planetName = planetNames[i][1];
			}
		}

		var Planet = Parse.Object.extend("Planet");
		
		// var planetOwner;
		// var query = new Parse.Query(Planet);
		// query.get(planetId, {
		//   success: function(planet) {
		//     planetOwner = planet.get('ownerName');
		//   },
		//   error: function(object, error) {
		//     // The object was not retrieved successfully.
		//     console.log("failed to retrieve " + object + ', ' + error);
		//   }
		// });
		
		var dbPlanet = new Planet();
		dbPlanet.id = planetId;

		// updated values
		dbPlanet.set("name", planetName);	
		dbPlanet.set("texture", planetTexture);
		dbPlanet.set("radius", planetRadius);
		dbPlanet.set("size", planetSize);	
		dbPlanet.set("rotationSpeed", planetRotationSpeed);

		dbPlanet.save(null, {
		  success: function(dbPlanet) {
		    // Execute any logic that should take place after the object is saved.
		    console.log('Updated object (id ' + dbPlanet.id + ')');
		  },
		  error: function(dbPlanet, error) {
		    // Execute any logic that should take place if the save fails.
		    // error is a Parse.Error with an error code and message.
		    console.log('Failed to update object: ' + error.message);
		  }
		});
	}
}

function deletePlanetFromDB() {
	if(user && dbFunctionality) {
		var planetId;
		// var planetOwnerId;

		// Get id's
		for (var i = 0; i < planetIds.length; ++i) {
			if (planetIds[i][0] == activePlanet) {
				planetId = planetIds[i][1];
				// planetOwnerId = planetIds[i][2];
			}
		}

		var Planet = Parse.Object.extend("Planet");
		var dbPlanet = new Planet();
		dbPlanet.id = planetId;

		dbPlanet.destroy({
		  success: function(dbPlanet) {
		    // The object was deleted from the Parse Cloud.
		    console.log(user.getUsername() + '\s planet was deleted from the db');
		  },
		  error: function(dbPlanet, error) {
		    // The delete failed.
		    console.log("could not delete planet: " + error);
		  }
		});
	}
}

// Load planets from db
function loadPlanetsFromDB() {
	if(dbFunctionality) {
		var Planet = Parse.Object.extend("Planet");		//make global
		var query = new Parse.Query(Planet);
		// query.equalTo("playerName", "Dan Stemkoski");
		query.find({
			success: function(results) {
				console.log("Successfully retrieved " + results.length + " planets:");
				// Do something with the returned Parse.Object values
				for (var i = 0; i < results.length; i++) { 
					var object = results[i];
					console.log(object.get('ownerName') + ' - ' + object.get('name') + ' ' + object.id + ' - ' + object.get('texture'));
		    		addPlanet(object.id, object.get('ownerId'), object.get('name'), object.get('texture'), object.get('radius'), object.get('size'), object.get('rotationSpeed'), true);
		    	}

			},
		  	error: function(error) {
		    	console.log("Error retrieving planets: " + error.code + " " + error.message);
			}
		});
	}
}
