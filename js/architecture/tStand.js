function TStand(title, image, caption, credit, description) {
	this.mesh = new THREE.Group();

	// Each side's label
	var textPanel = new TextPanel(title, image, caption, credit, description);
	textPanel.scale.set(.3, .3, .3);
	textPanel.position.set(0, wallHeight/3, 0);
	this.mesh.add(textPanel);

	var textPanel = new TextPanel(title, image, caption, credit, description);
	textPanel.scale.set(.3, .3, .3);
	textPanel.rotateY(THREE.Math.degToRad(180));
	textPanel.position.set(0, wallHeight/3, 0);
	this.mesh.add(textPanel);

	// Upright
	var geometry = new THREE.BoxBufferGeometry(.4*wallUnitWidth/4, wallHeight/3 + .3*wallUnitWidth/6 + .05*wallUnitWidth/4, .3*wallDepth - .01);
	var stand = new THREE.Mesh(geometry, wallMaterial);
	stand.position.set(0, (wallHeight/3 + .3*wallUnitWidth/6 + .05*wallUnitWidth/4)/2, 0);
	this.mesh.add(stand);
	obstacles.push(stand);

	// Base
	geometry = new THREE.BoxBufferGeometry(.4*wallUnitWidth/4, wallDepth/10, .4*wallUnitWidth/3);
	stand = new THREE.Mesh(geometry, wallMaterial);
	stand.position.set(0, wallDepth/20, 0);
	this.mesh.add(stand);

	return this.mesh;
}