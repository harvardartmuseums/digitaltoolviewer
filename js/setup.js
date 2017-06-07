var socket = io();

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