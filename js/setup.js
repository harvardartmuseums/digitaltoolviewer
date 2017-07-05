var socket = io('/screens-namespace');

socket.on("id", function(id) {
	alert("Enter the following id to sync controls or other screens with this screen: " + id);
});

var font = "Helvetica";

setup();

function setup() {

	setupAnimations();
	setupModuleLayout();
	setupRendering();
	setupMove();

	buildTour();
}

function finishSetup() {
	setupResize();

	setupReset();

	lastUpdated = new Date();
	if (ended) {
		ended = false;
		animate();
	}
}