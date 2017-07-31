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

	camera.updateMatrix();
	interactionCamera.position.copy(camera.position);
	interactionCamera.rotation.copy(camera.rotation);
	interactionCamera.updateMatrix();

	interactRay.setFromCamera(mouse, interactionCamera);

	var intersections = interactRay.intersectObjects(interactiveObjects, true);

	var index;
	for (var i = 0; i < interactions.length; i++) {
		index = interactiveObjects.indexOf(intersections[i].object);
		if (index != -1) {
			interactionMethod[index]();
		}
	}
}