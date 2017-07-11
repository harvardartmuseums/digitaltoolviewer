var lights = [];

function Floor(width, breadth) {
	(width == undefined)? width = 1 : width = width;
	(breadth == undefined)? breadth = 1 : breadth = breadth;

	this.mesh = new THREE.Group();

	var geometry = new THREE.BoxBufferGeometry(wallUnitWidth*width, wallDepth, wallUnitWidth*breadth);
	var box = new THREE.Mesh(geometry, floorMaterial);
	this.mesh.add(box);

	//var light = new THREE.PointLight(0xffffff, .2);
	//light.position.set(0, wallHeight/3 + wallDepth/2, 0);
	//light.updateMatrix();
	//light.layers.enable(1);
	//this.mesh.add(light);

	//lights.push(light);

	this.mesh.position.set(0, -wallDepth/2, 0);
	this.mesh.updateMatrix();

	return this.mesh;
}

function Ceiling(width, breadth) {
	(width == undefined)? width = 1 : width = width;
	(breadth == undefined)? breadth = 1 : breadth = breadth;

	this.mesh = new THREE.Group();

	var geometry = new THREE.BoxBufferGeometry(wallUnitWidth*width, wallDepth, wallUnitWidth*breadth);
	var ceiling = new THREE.Mesh(geometry, ceilingMaterial);
	this.mesh.add(ceiling);
	
	this.mesh.position.set(0, wallHeight + wallDepth/2, 0);
	this.mesh.updateMatrix();

	return this.mesh;
}

function Wall(door) {
	this.mesh = new THREE.Group();

	var geometry;
	var box;

	if (door) {
		// Door sides
		geometry = new THREE.BoxBufferGeometry((wallUnitWidth - doorWidth)/2, wallHeight, wallDepth);

		box = new THREE.Mesh(geometry, wallMaterial);
		box.position.set((wallUnitWidth - doorWidth)/2, wallHeight/2, 0);
		box.updateMatrix();
		this.mesh.add(box);
		obstacles.push(box);
	
		box = new THREE.Mesh(geometry, wallMaterial);
		box.position.set(-(wallUnitWidth - doorWidth)/2, wallHeight/2, 0);
		box.updateMatrix();
		this.mesh.add(box);
		obstacles.push(box);

		// Door top
		geometry = new THREE.BoxBufferGeometry(doorWidth, wallHeight - doorHeight, wallDepth);

		box = new THREE.Mesh(geometry, wallMaterial);
		box.position.set(0, (wallHeight + doorHeight)/2, 0);
		box.updateMatrix();
		this.mesh.add(box);

		// Door bottom
		geometry = new THREE.BoxBufferGeometry(wallUnitWidth, wallDepth, wallDepth);

		box = new THREE.Mesh(geometry, floorMaterial);
		box.position.set(0, -wallDepth/2, 0);
		box.updateMatrix();
		this.mesh.add(box);
	} else {
		// Plain wall
		geometry = new THREE.BoxBufferGeometry(wallUnitWidth, wallHeight, wallDepth);

		box = new THREE.Mesh(geometry, wallMaterial);
		box.position.set(0, wallHeight/2, 0);
		box.updateMatrix();
		this.mesh.add(box);
		obstacles.push(box);
	}

	return this.mesh;
}