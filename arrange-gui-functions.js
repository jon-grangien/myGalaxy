function initiallyHideMenus() {
	// Menus that aren't supposed to 
}

function menusOnLogin() {
	// Hide login/create menus
    $('#login').hide("fast");
    $('#register').hide("fast");

    // Show user menu with username
    $('#user_menu').show("fast");
    $(".user_info").text("Logged in: " + user.getUsername());
}

function menusOnLogout() {
    // Hide user menu and show login/create menus
    $('#user_menu').hide("fast");
    $('#login').show("fast");
    $('#register').show("fast");
}

function menusOnCreatePlanet() {
	$('#add_planet_button').hide("fast");
}