var resetTimer;
var resetRounds = 0;

function setupReset() {
	// Every minute, check to see if scene should be reset
	resetTimer = setInterval(reset, 60000);
}

// Reset the view to its initial state
function reset() {
	if (resetRounds < 5) {
		resetRounds++;
	} else {
		camera.position.z = 0;
		camera.position.x = 0;
		camera.position.y = 200;
		camera.lookAt(new THREE.Vector3(0, 200, -1));
		resetRounds = 0;

		animate();
	}
}