var animationID;
var directions = {"left": false, "up": false, "right": false, "down": false};
var directionList = Object.keys(directions);

var now;
var prev;

var velocity = .05;
var distanceTraveled = 0;

var obstacles = [];

function setupMove() {
	socket.on('move', move);
	socket.on('stop', stop);

	socket.on('jumpTo', function(location, rotation) {
		camera.position.x = location.x;
		camera.position.y = location.y;
		camera.position.z = location.z;

		camera.rotation.y = rotation;
	});
}

function move(direction) {
	if (animationID) {
		prev = now;
		now = new Date();
		distanceTraveled = (now.valueOf() - prev.valueOf())*velocity;
	} else {
		now = new Date();
		distanceTraveled = 5;
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
		camera.position.add(camera.getWorldDirection().multiplyScalar(distanceTraveled));
	}
	if (directions["down"]) {
		camera.position.add(camera.getWorldDirection().multiplyScalar(-distanceTraveled));
	}
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