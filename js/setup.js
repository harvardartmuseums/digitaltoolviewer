var socket = io('/screens-namespace');

socket.on("id", function(id) {
	alert("Enter the following id to sync controls or other screens with this screen: " + id);
});

var font = "Helvetica";

var loading = {toLoad: 0, loaded: 0};

setup();

function load() {
	loading.toLoad++;
}

function loaded() {
	loading.loaded++;
	console.log(loading.loaded + " loaded of " + loading.toLoad);
	if (loading.toLoad <= loading.loaded) {
		socket.emit("setupControl", {scene: scene.toJSON(), minClip: wallDepth, maxClip: wallUnitWidth});
	}
}

function setup() {

	setupAnimations();
	setupModuleLayout();
	setupRendering();

	buildTour();
}

function finishSetup() {
	setupResize();
	setupMove();
	setupReset();

	animate();
}