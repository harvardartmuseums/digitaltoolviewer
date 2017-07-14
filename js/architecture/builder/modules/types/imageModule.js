function ImageModule(width, height, module) {
	this.mesh = new THREE.Group();

	Image3D(this.mesh, module.images[0].file, undefined, width, height, true);
	
	return this.mesh;
}