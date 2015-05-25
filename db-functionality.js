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

		dbPlanet.set("owner", username);
		dbPlanet.set("userId", user.id);
		dbPlanet.set("texture", "earthmap.jpg");	//initial texture
		dbPlanet.set("radius", 80);					//initial radius
		dbPlanet.set("size", 1);					//initial size

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