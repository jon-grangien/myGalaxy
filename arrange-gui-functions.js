// Menus that aren't supposed to show initially (prestanda?)
function initiallyHideMenus() {
    $('#user_menu').hide();
    $('.edit-created-planet-container').hide();
    $('.bygg-main').hide();
    $('#edit-existing-planet-container').hide();
    $('#edit-existing-planet-button-container').hide();
    $('#jump-planet-button').hide();
    $('#jump-system-button').hide();
    $('#jump-moon-button').hide();
    $('#place-house-button').hide();
    $('#edit-planet-tabs').hide();
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
    $('.edit-created-planet-container').show("fast");
}

function menusOnSave() {
    $('#add_planet_button').show();
    $('.edit-created-planet-container').hide("fast");
    $('#jump-planet-button').show();
}

// When planet selected and editable
function menusOnPlanetActive() {
    $('#edit-existing-planet-button-container').show();
}

// When edit-planet button is pressed
function menusOnEditPlanet() {
    $('#add_planet_button').hide();
    $('#edit-existing-planet-button-container').hide();
    $('#edit-planet-tabs').show();
    $('#place-house-button').show();
}

function menusOnEditDone() {
    $('#add_planet_button').show();
    $('#edit-existing-planet-button-container').show();
    // $('#edit-existing-planet-container').hide("fast");
    $('#edit-planet-tabs').hide();
    $('#place-house-button').hide();
}

function buttonsOnAddMoon() {
    $('#jump-moon-button').show();
}
// When zoomed in on planet
function buttonsOnViewPlanet() {
    $('#jump-system-button').show();
    $('#jump-planet-button').hide();

    if(thereAreMoons)
        $('#jump-moon-button').show();
}

// When zoomed in on moon
function buttonsOnViewMoon() {
    $('#jump-system-button').show();
    $('#jump-moon-button').hide();
}

// When viewing system
function buttonsOnViewSystem() {
    $('#jump-system-button').hide();

    if(thereArePlanets)
        $('#jump-planet-button').show();

    if(thereAreMoons)
        $('#jump-moon-button').show();
}
