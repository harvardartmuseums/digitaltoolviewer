var interactionCamera;

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

	camera.updateMatrixWorld();
	interactionCamera.position.copy(camera.position);
	interactionCamera.rotation.copy(camera.rotation);
	interactionCamera.updateMatrixWorld();

	interactRay.setFromCamera(mouse, interactionCamera);

	var intersections = interactRay.intersectObjects(interactiveObjects, true);

	if (intersections.length) {
		var index = interactiveObjects.indexOf(intersections[0].object);

		if (index != -1) {
			interactionMethod[index]();
		}
	}
}