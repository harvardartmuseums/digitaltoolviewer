var interactRay = new THREE.Raycaster();

var mouse = new THREE.Vector2();

function setupInteraction() {
	socket.on("click", handleInteraction);
}

function handleInteraction(e) {
	mouse.x = e.x;
	mouse.y = e.y;

	interactRay.setFromCamera(mouse, interactionCamera);

	var intersections = interactRay.intersectObjects(interactiveObjects, true);

	if (intersections.length > 0) {
		interactionMethod[interactiveObjects.indexOf(intersections[0].object)]();
	}
}