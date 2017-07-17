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

	console.log(e.x, e.y);

	interactRay.setFromCamera(mouse, camera);

	var intersections = interactRay.intersectObjects(interactiveObjects, true);

	var index;
	for (var i = 0; i < intersections.length; i++) {
		index = interactiveObjects.indexOf(intersections[i].object);
		console.log(index);
		if (index != -1) {
			console.log(interactionMethod[index]);
			interactionMethod[index]();
			break;
		}
	}
}