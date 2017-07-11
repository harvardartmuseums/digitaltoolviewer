var socket = io('/screens-namespace');

socket.on("id", function(id) {
	alert("Enter the following id to sync controls or other screens with this screen: " + id);
});

var font = "Helvetica";

var loading = {toLoad: 0, loaded: 0};

setup();

function load(n) {
	if (n) {
		loading.toLoad += n;
	} else {
		loading.toLoad++;
	}
}

function loaded() {
	loading.loaded++;
	console.log(loading.loaded + " of " + loading.toLoad);
	if (loading.toLoad <= loading.loaded) {
		var interactionScene = {interactiveObjects: [], obstacles: [], lights: []};
		for (var i = 0; i < interactiveObjects.length; i++) {
			interactionScene.interactiveObjects.push(interactiveObjects[i].toJSON());
		}
		for (var i = 0; i < obstacles.length; i++) {
			interactionScene.obstacles.push(obstacles[i].toJSON());
		}
		for (var i = 0; i < lights.length; i++) {
			interactionScene.lights.push(lights[i].toJSON());
		}

		socket.emit("scene", {scene: interactionScene, wallDepth: wallDepth, wallUnitWidth: wallUnitWidth});

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