var interactRay;
var mouse;

function setupInteraction() {
	interactRay = new THREE.Raycaster(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0), wallDepth, wallUnitWidth);
	mouse = new THREE.Vector2();

	socket.on("click", handleInteraction);
}

function handleInteraction(e) {
	mouse.x = e.x;
	mouse.y = e.y;

	interactRay.setFromCamera(mouse, camera);

	var intersections = interactRay.intersectObjects(interactiveObjects, true);

	if (intersections.length > 0) {
		interactionMethod[interactiveObjects.indexOf(intersections[0].object)]();
	}
}