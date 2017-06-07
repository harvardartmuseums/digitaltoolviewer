function ComparisonModule(width, height, module) {
	this.mesh = new THREE.Group();
	
	Image3D(this.mesh, module.images[0].file, new THREE.Vector3(-width/4, 0, 0), width/2, height, true);

	Image3D(this.mesh, module.images[1].file, new THREE.Vector3(width/4, 0, 0), width/2, height, true);
	
	return this.mesh;
}