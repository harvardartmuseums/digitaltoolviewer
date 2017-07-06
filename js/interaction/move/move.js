var moveSphere;
var moveBox;
var moveRay = new THREE.Raycaster();

var animationID;
var directions = [];

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
	resetRounds = 0;

	if (direction && directions.indexOf(direction) == -1) {
		directions.push(direction);
	}

	if (directions.indexOf("left") != -1) {
		camera.rotateY(THREE.Math.degToRad(1));
	}
	if (directions.indexOf("right") != -1) {
		camera.rotateY(THREE.Math.degToRad(-1));
	}
	if (directions.indexOf("up") != -1) {
		if (checkMove(camera.position.clone().add(camera.getWorldDirection().multiplyScalar(5)))) {
			camera.position.add(camera.getWorldDirection().multiplyScalar(5));
		}
	}
	if (directions.indexOf("down") != -1) {
		if (checkMove(camera.position.clone().add(camera.getWorldDirection().multiplyScalar(-5)))) {
			camera.position.add(camera.getWorldDirection().multiplyScalar(-5));
		}
	}

	moveInteractionCamera();

	animate();

	if (!animationID) {
		animationID = requestAnimationFrame(move);
	}
}

function stop(direction) {
	if (directions.indexOf(direction) != -1) {
		directions.splice(directions.indexOf(direction), 1);
	}

	if (!direction || directions.length == 0) {
		cancelAnimationFrame(animationID);
		animationID = undefined;
	}
}