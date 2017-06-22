var moveSphere;
var moveRay = new THREE.Raycaster();

var obstacles = [];

var keysDown = {};

function move() {
	keyHandler();
	moveInteractionCamera();
}


// Moves the camera, if the arrow keys are down
// (Timed to smooth out motion)
function keyHandler() {
	if (keysDown[37]) {
		camera.rotateY(THREE.Math.degToRad(1));
		//checkMirrors();
	} 
	if (keysDown[39]) {
		camera.rotateY(THREE.Math.degToRad(-1));
		//checkMirrors();
	} 
	if (keysDown[38]) {
		if (checkMove(camera.position.clone().add(camera.getWorldDirection().multiplyScalar(5)))) {
			camera.position.add(camera.getWorldDirection().multiplyScalar(5));
			//checkMirrors();
		}
	} 
	if (keysDown[40]) {
		if (checkMove(camera.position.clone().add(camera.getWorldDirection().multiplyScalar(-5)))) {
			camera.position.add(camera.getWorldDirection().multiplyScalar(-5));
			//checkMirrors();
		}
	}
}

function moveInteractionCamera() {
	interactionCamera.position.set(camera.position.x, camera.position.y, camera.position.z);
	interactionCamera.setRotationFromQuaternion(camera.getWorldQuaternion());
}

function checkMove(newPos) {
	moveSphere.set(newPos, wallDepth*2);	

	var box = new THREE.Box3();

	for (var i = 0; i < obstacles.length; i++) {
		box.setFromObject(obstacles[i]);
		if (box.intersectsSphere(moveSphere)) {
			return false;
		}
	}

	return true;
}

function setupMove() {
	moveSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), wallDepth*3);	

	keysDown = {37: false, 39: false, 38: false, 40: false};

	document.addEventListener("keydown", function(e) {
		resetRounds = 0;
		if ([37, 38, 39, 40].indexOf(e.which) != -1) {
			keysDown[e.which] = true;
		}
		lastUpdated = new Date();
		if (ended) {
			ended = false;
			animate();
		}
	});
	document.addEventListener("keyup", function(e) {
		resetRounds = 0;
		if ([37, 38, 39, 40].indexOf(e.which) != -1) {
			keysDown[e.which] = false;
		}
		lastUpdated = new Date();
		if (ended) {
			ended = false;
			animate();
		}
	});
}