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
		var interactionScene = [];
		for (var i = 0; i < interactiveObjects.length; i++) {
			interactiveObjects[i].parent.updateMatrixWorld();
			THREE.SceneUtils.detach(interactiveObjects[i], interactiveObjects[i].parent, scene);
			interactionScene.push(interactiveObjects[i].toJSON());
		}
		for (var i = 0; i < obstacles.length; i++) {
			obstacles[i].parent.updateMatrixWorld();
			THREE.SceneUtils.detach(obstacles[i], obstacles[i].parent, scene);
			interactionScene.push(obstacles[i].toJSON());
		}
		for (var i = 0; i < lights.length; i++) {
			lights[i].parent.updateMatrixWorld();
			THREE.SceneUtils.detach(lights[i], lights[i].parent, scene);
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