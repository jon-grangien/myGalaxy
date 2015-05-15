function initiallyHideMenus() {
	// Menus that aren't supposed to show initially (prestanda?)
    $('#user_menu').hide();
    $('#edit-created-planet-container').hide();
    $('.bygg-main').hide();
    $('#edit-existing-planet-container').hide();
    $('#edit-existing-planet-button-container').hide();
    $('#jump-planet-button').hide();
    $('#jump-system-button').hide();
    $('#jump-moon-button').hide();
    $('#place-house-button').hide();
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
    $('#edit-created-planet-container').show("fast");
}

function menusOnSave() {
    $('#add_planet_button').show("fast");
    $('#edit-created-planet-container').hide("fast");
    $('#jump-planet-button').show("fast");
}

// When planet selected and editable
function menusOnPlanetActive() {
    $('#edit-existing-planet-button-container').show();
}

// When edit-planet button is pressed
function menusOnEditPlanet() {
    $('#add_planet_button').hide();
    $('#edit-existing-planet-button-container').hide();
    $('#edit-existing-planet-container').show("fast");
    $('#place-house-button').show("fast");
}

function menusOnEditDone() {
    $('#add_planet_button').show();
    $('#edit-existing-planet-button-container').show();
    $('#edit-existing-planet-container').hide("fast");
    $('#place-house-button').hide("fast");
}

function buttonsOnAddMoon() {
    $('#jump-moon-button').show("fast");
}
// When zoomed in on planet
function buttonsOnViewPlanet() {
    $('#jump-system-button').show("slow");
    $('#jump-planet-button').hide("slow");

    if(thereAreMoons)
        $('#jump-moon-button').show("slow");
}

// When zoomed in on moon
function buttonsOnViewMoon() {
    $('#jump-system-button').show("slow");
    $('#jump-moon-button').hide("slow");
}

// When viewing system
function buttonsOnViewSystem() {
    $('#jump-system-button').hide("slow");

    if(thereArePlanets)
        $('#jump-planet-button').show("slow");

    if(thereAreMoons)
        $('#jump-moon-button').show("slow");
}
