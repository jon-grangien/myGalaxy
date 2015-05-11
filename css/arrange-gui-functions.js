function menusOnLogin() {
	// Rearrange menus
    $('#login').hide("fast");
    $('#register').hide("fast");
    $('#user_menu').show("fast");
    $(".user_info").text("Logged in: " + user.getUsername());
}