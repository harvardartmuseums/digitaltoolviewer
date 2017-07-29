var canvas;
var cssCanvas;

var scene;

var camera;
var interactionCamera;

var renderer;

var cssOverlay;
var cssRenderer;

var interactiveObjects = [];
var interactionMethod = [];

var mirrors = [];
var mirrorFrameCount = 0;

var lastUpdated;
var ended = true;

function resize() {	
	renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
	cssRenderer.setSize(cssCanvas.offsetWidth, cssCanvas.offsetHeight);
}

function setupResize() {
	window.addEventListener("resize", function() {
		resize();

		animate();
	});
}

function setupRendering() {
	canvas = document.getElementById("canvas");
	cssCanvas = document.getElementById("cssCanvas");

	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(75, 16/9, wallDepth, 10000);
	camera.layers.enable(2);
	camera.mirrorsEnabled = true;
	camera.position.z = 0;
	camera.position.y = 200;
	camera.rotateY(THREE.Math.degToRad(0));
	camera.updateMatrix();

	interactionCamera = new THREE.PerspectiveCamera(75, 16/9, wallDepth, 10000);
	interactionCamera.layers.set(1);
	interactionCamera.position.z = 0;
	interactionCamera.position.y = 200;
	interactionCamera.rotateY(THREE.Math.degToRad(0));
	interactionCamera.updateMatrix();

	setupCSS();
	setupWebGL();
}

function setupCSS() {
	cssOverlay = new THREE.Scene();

	cssRenderer = new THREE.CSS3DRenderer();
	cssRenderer.setSize(cssCanvas.offsetWidth, cssCanvas.offsetHeight);
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

// Animate both the WebGL and the CSS transforms scenes
function animate() {
	renderer.render(scene, interactionCamera);

	//cssRenderer.render(cssOverlay, camera);

	//mirrorFrameCount++;
}