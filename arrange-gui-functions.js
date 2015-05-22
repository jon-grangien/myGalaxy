// Menus that aren't supposed to show initially (prestanda?)
function initiallyHideMenus() {
    $('#user_menu').hide();
    $('.edit-created-planet-container').hide();
    $('.bygg-main').hide();
    $('#edit-existing-planet-container').hide();
    $('#edit-planet-button').hide();
    $('#jump-planet-button').hide();
    $('#jump-moon-button').hide();
    $('#edit-planet-tabs').hide();
    $('#build-planet-button').hide();
    $('#accordion-container').hide();
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
	$('#add-planet-button').hide();
    $('.edit-created-planet-container').show("fast");
    $("#jump-planet-moon-container").css({"right": "240px" });  //move out 
}

function menusOnSave() {
    $('#add-planet-button').show();
    $('.edit-created-planet-container').hide("fast");
    $('#jump-planet-button').show();
    $("#jump-planet-moon-container").css({"right": "120px" });  //move in
}

// When planet selected and editable
function menusOnPlanetActive() {
    $('#edit-planet-button').show();
}

// When edit-planet button is pressed
function menusOnEditPlanet() {
    $('#add-planet-button').hide();
    $('#edit-planet-button').hide();
    $('#edit-planet-tabs').show();
    $("#jump-planet-moon-container").css({"right": "240px" });  //move out
}

function menusOnBuildPlanet() {
    $('#build-planet-button').hide();
    $('#add-planet-button').hide();
    $('#edit-planet-button').hide();
    $('#accordion-container').show();
    $("#jump-planet-moon-container").css({"right": "240px" });  //move out
    console.log("build planet");
}

function menusOnEditDone() {
    $('#add-planet-button').show();
    $('#edit-planet-button').show();
    $('#build-planet-button').show();
    $('#edit-planet-tabs').hide();
    $('#accordion-container').hide();
    $("#jump-planet-moon-container").css({"right": "120px" });  //move in
}

function buttonsOnAddMoon() {
    $('#jump-moon-button').show();
}
// When zoomed in on planet
function buttonsOnViewPlanet() {
    $('#jump-planet-button').hide();
    $('#build-planet-button').show();

    if(thereAreMoons)
        $('#jump-moon-button').show();

    console.log("view planet");
}

// When zoomed in on moon
function buttonsOnViewMoon() {
    $('#jump-moon-button').hide();
}

// When viewing system
function buttonsOnViewSystem() {
    $('#build-planet-button').hide();

    if(thereArePlanets) {
        $('#jump-planet-button').show();
        $('#edit-planet-button').show();
    }

    if(thereAreMoons)
        $('#jump-moon-button').show();
}
