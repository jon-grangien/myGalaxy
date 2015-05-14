function initiallyHideMenus() {
	// Menus that aren't supposed to show initially (prestanda?)
    $('#user_menu').hide();
    $('#edit-planet-container').hide();
    // $('.bygg-main').hide();
}

function menusOnLogin() {
	// Hide login/create menus
    $('#login').hide("fast");
    $('#register').hide("fast");

    // Show user menu with username
    $('#user_menu').show("fast");
    $(".user_info").text(user.getUsername());
}

function menusOnLogout() {
    // Hide user menu and show login/create menus
    $('#user_menu').hide("fast");
    $('#login').show("fast");
    $('#register').show("fast");
}

function menusOnCreatePlanet() {
	$('#add_planet_button').hide();
    $('#edit-planet-container').show("fast");
}

function menusOnSave() {
    $('#add_planet_button').show("fast");
    $('#edit-planet-container').hide("fast");
}