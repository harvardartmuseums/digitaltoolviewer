var canvas;

var scene;

var camera;

var renderer;

var cssOverlay;
var cssRenderer;

var interactionCamera;
var interactionRenderer;
var interactiveObjects = [];
var interactionMethod = [];

var mirrors = [];
var frustum;
var cameraViewMatrix;

var lastUpdated;
var ended = true;

function setupResize() {
	window.addEventListener("resize", function() {
		renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
		cssRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

		if (ended) {
			animate();
		}
	});
}

function setupRendering() {
	canvas = document.getElementById("canvas");

	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(75, 16/9, wallDepth, 10000);
	camera.layers.enable(2);
	camera.position.z = 0;
	camera.position.y = 200;
	camera.rotateY(THREE.Math.degToRad(0));

	setupCSS();
	setupWebGL();
	setupiPadPreview();

	setupMirrors();
}

function setupCSS() {
	cssOverlay = new THREE.Scene();

	cssRenderer = new THREE.CSS3DRenderer();
	cssRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
	document.body.appendChild(cssRenderer.domElement);
	cssRenderer.domElement.classList.add("threeJS");
}

function setupWebGL() {
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
	cssRenderer.domElement.appendChild(renderer.domElement);
	renderer.domElement.classList.add("threeJS");
	renderer.domElement.classList.add("clickThrough");
}

function setupiPadPreview() {
	interactionCamera = new THREE.PerspectiveCamera(75, 16/9, wallDepth, wallUnitWidth);

	interactionRenderer = new THREE.WebGLRenderer({antialias: true});
	interactionRenderer.autoClearDepth = false;
	interactionRenderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}

function setupMirrors() {
	frustum = new THREE.Frustum();
	cameraViewProjectionMatrix = new THREE.Matrix4();
}

function checkMirrors() {
	camera.updateMatrixWorld();
	camera.matrixWorldInverse.getInverse(camera.matrixWorld);
	cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
	frustum.setFromMatrix(cameraViewProjectionMatrix);
	camera.layers.set(0);
	camera.layers.enable(2);
	for (var i = 0; i < mirrors.length; i++) {
		if (frustum.intersectsObject(mirrors[i])) {
			camera.layers.enable(mirrors[i].layer);
		}
	}
}

// Animate both the WebGL and the CSS transforms scenes
function animate() {
	var now = new Date();
	if ((now - lastUpdated.valueOf()) < 5000) {
		requestAnimationFrame(animate);
	} else {
		ended = true;
	}

	move();

	renderer.render(scene, camera);

	cssRenderer.render(cssOverlay, camera);

	interactionRenderer.clearDepth();
	interactionCamera.layers.set(0);
	interactionRenderer.render(scene, interactionCamera);
	interactionCamera.layers.set(1);
	interactionRenderer.render(scene, interactionCamera);
}