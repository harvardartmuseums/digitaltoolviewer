var socket = io('/screens-namespace');

socket.on("id", function(id) {
	alert("Enter the following id to sync controls or other screens with this screen: " + id);
});

var font = "Helvetica";

var loading = {toLoad: 0, loaded: 0};

setup();

function load(n) {
	loading.toLoad += n || 1;
}

function loaded() {
	loading.loaded++;
	if (loading.toLoad <= loading.loaded) {
		var interactionScene = [];
		for (var i = 0; i < interactiveObjects.length; i++) {
			interactionScene.push(interactiveObjects[i].toJSON());
		}
		for (var i = 0; i < obstacles.length; i++) {
			interactionScene.push(obstacles[i].toJSON());
		}
		for (var i = 0; i < lights.length; i++) {
			interactionScene.push(lights[i].toJSON());
		}

		socket.emit("setupControl", {scene: interactionScene, minClip: wallDepth, maxClip: wallUnitWidth});

		interactionScene = null;
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