var resetTimer;
var resetRounds = 0;

function setupReset() {
	// Every minute, check to see if scene should be reset
	resetTimer = setInterval(reset, 60000);

	socket.on("reset", function() {
		reset(true);
	});
}

// Reset the view to its initial state
function reset(socket) {
	if (resetRounds < 5) {
		resetRounds++;
	} else {
		resetRounds = 0;

		socket.emit("reset");
	}

	if (socket) {
		camera.position.z = 0;
		camera.position.x = 0;
		camera.position.y = 200;
		camera.lookAt(new THREE.Vector3(0, 200, -1));

		stop();

		animate();
	}
}