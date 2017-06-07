var interactRay = new THREE.Raycaster();

var mouse = new THREE.Vector2();

function handleInteraction(e) {
	mouse.x = 6*e.clientX/canvas.offsetWidth - 1;
	mouse.y = -6*e.clientY/canvas.offsetHeight + 5;

	interactRay.setFromCamera(mouse, interactionCamera);

	var intersections = interactRay.intersectObjects(interactiveObjects, true);

	if (intersections.length > 0) {
		interactionMethod[interactiveObjects.indexOf(intersections[0].object)]();
	}
}