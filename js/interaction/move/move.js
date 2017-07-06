var moveSphere;
var moveBox;
var moveRay = new THREE.Raycaster();

var animationID;
var directions = {"left": false, "up": false, "right": false, "down": false};
var directionList = Object.keys(directions);

var now;
var prev;

var velocity = .005;
var distanceTraveled = 0;

var obstacles = [];

function moveInteractionCamera() {
	interactionCamera.position.set(camera.position.x, camera.position.y, camera.position.z);
	interactionCamera.setRotationFromQuaternion(camera.getWorldQuaternion());
}

function checkMove(newPos) {
	moveSphere.set(newPos, wallDepth*2);	

	for (var i = 0; i < obstacles.length; i++) {
		moveBox.setFromObject(obstacles[i]);
		if (moveBox.intersectsSphere(moveSphere)) {
			return false;
		}
	}

	return true;
}

function setupMove() {
	moveBox = new THREE.Box3();
	moveSphere = new THREE.Sphere(new THREE.Vector3(0,0,0), wallDepth*3);	

	socket.on('move', move);
	socket.on('stop', stop);
}

function move(direction) {
	if (animationID) {
		prev = now;
		now = new Date();
		distanceTraveled = (now.valueOf() - prev.valueOf())*velocity;
	} else {
		now = new Date();
		distanceTraveled = 1;
	}

	animate();
	animationID = requestAnimationFrame(move);

	resetRounds = 0;

	if (directionList.indexOf(direction) != -1) {
		directions[direction] = true;
	}

	if (directions["left"]) {
		camera.rotateY(THREE.Math.degToRad(distanceTraveled/10));
	}
	if (directions["right"]) {
		camera.rotateY(THREE.Math.degToRad(-distanceTraveled/10));
	}
	if (directions["up"]) {
		if (checkMove(camera.position.clone().add(camera.getWorldDirection().multiplyScalar(distanceTraveled)))) {
			camera.position.add(camera.getWorldDirection().multiplyScalar(distanceTraveled));
		}
	}
	if (directions["down"]) {
		if (checkMove(camera.position.clone().add(camera.getWorldDirection().multiplyScalar(-distanceTraveled)))) {
			camera.position.add(camera.getWorldDirection().multiplyScalar(-distanceTraveled));
		}
	}

	moveInteractionCamera();
}

function stop(direction) {
	if (directions[direction]) {
		directions[direction] = false;
	}

	if (!direction || directions.length == 0) {
		cancelAnimationFrame(animationID);
		animationID = undefined;
	}
}