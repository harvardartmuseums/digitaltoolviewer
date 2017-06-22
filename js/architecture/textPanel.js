function TextPanel(title, image, caption, credit, description) {
	this.mesh = new THREE.Group();

	var panel = document.createElement("canvas");
	panel.width = "1024";
	panel.height = "2048";
	var context = panel.getContext("2d");

	context.fillStyle = "#FFFFFF";
	context.fillRect(0, 0, 1024, 2048);

	// Add title (and optionally description) from top
	var offsetTop = wrapText(context, 10, 70, title, 60, font) + 20;
	if (description != undefined) {
		offsetTop = wrapText(context, 10, offsetTop, description, 30, font) + 20;
	}

	// Add credit and caption from bottom
	var offsetBottom = wrapText(context, 10, 1365, credit, 20, font, true) - 10;
	offsetBottom = wrapText(context, 10, offsetBottom, caption, 30, font, true) - 30;

	var pixelRatio = (wallUnitWidth/4)/1024;
	var boxWidth = 1004*pixelRatio;
	var boxHeight = (offsetBottom - offsetTop - 40)*pixelRatio;

	Image3D(this.mesh, image, new THREE.Vector3(0, (wallUnitWidth/6 - offsetTop*pixelRatio - boxHeight/2), wallDepth/2), boxWidth, boxHeight);

	// create label from HTML5 canvas
	geometry = new THREE.BoxBufferGeometry(wallUnitWidth/4, wallUnitWidth/2, wallDepth);
	var texture = new THREE.CanvasTexture(panel);
	var material = new THREE.MeshStandardMaterial({map: texture, metalness: 0, roughness: .8});
	var label = new THREE.Mesh(geometry, material);
	label.position.set(0, wallUnitWidth/6 - wallUnitWidth/4, 0);
	label.updateMatrix();
	this.mesh.add(label);

	this.mesh.position.set(0, wallHeight/2, 0);
	this.mesh.rotateY(THREE.Math.degToRad(180));
	this.mesh.updateMatrix();
	

	return this.mesh;
}