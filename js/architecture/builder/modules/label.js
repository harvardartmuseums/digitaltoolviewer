function ModuleLabel(width, title, caption, credit) {
	var panel = document.createElement("canvas");
	panel.width = "1024";
	panel.height = "512";
	var context = panel.getContext("2d");

	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, 1024, 512);

	// Add title and caption from top
	var offsetTop = wrapText(context, 50, 70, title, 55, font, false, 924) + 20;
	wrapText(context, 50, offsetTop, caption, 35, font, false, 924);

	// Add credit from bottom
	wrapText(context, 50, 512, credit, 25, font, true, 924);

	var geometry = new THREE.BoxBufferGeometry(width, width/2, .02);
	var texture = new THREE.CanvasTexture(panel);
	var material = new THREE.MeshStandardMaterial({map: texture, metalness: 0, roughness: .8});
	var label = new THREE.Mesh(geometry, material);

	this.mesh = label;
	
	return this.mesh;
}