function Slide(slide) {
	this.mesh = new THREE.Group();

	var panel = document.createElement("canvas");
	panel.classList.add("slideTitle");
	panel.width = "512";
	panel.height = "512";
	var context = panel.getContext("2d");

	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, 512, 512);

	centerText(context, 512, 512, slide.title, 80, font);

	geometry = new THREE.BoxBufferGeometry((wallUnitWidth - wallDepth*3)/6, (wallUnitWidth - wallDepth*3)/6, .02);
	var texture = new THREE.CanvasTexture(panel);

	var material = new THREE.MeshStandardMaterial({map: texture, metalness: 0, roughness: .8});
	var label = new THREE.Mesh(geometry, material);
	label.position.set(0, -(wallUnitWidth - wallDepth*3)/8, 0);
	this.mesh.add(label);

	cleanModules(slide.modules, this.mesh, []);

	return this.mesh;
}