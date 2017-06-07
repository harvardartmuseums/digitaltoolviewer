function openAudio() {
	console.log("audio");
}

function AudioModule(width, height, module) {
	this.mesh = new THREE.Group();

	var label = new ModuleLabel(width/3, module.audio.title, undefined, module.audio.credit);
	label.position.set(0, -height/6 - .1*height/2 - width/6, 0);
	this.mesh.add(label);
	

	var geometry = new THREE.BoxBufferGeometry(width/3, .1*height/2, width/6);
	var shelf = new THREE.Mesh(geometry, wallMaterial);
	shelf.position.set(0, -height/6 - .1*height/4, width/12);
	shelf.layers.enable(1);
	this.mesh.add(shelf);
	interactiveObjects.push(shelf);
	interactionMethod.push(openAudio);

	geometry = new THREE.BoxBufferGeometry(width/5, 3*height/12, width/10);
	var speaker = new THREE.Mesh(geometry, speakerMaterial);
	speaker.position.set(0, -height/24, width/12);
	speaker.layers.enable(1);
	this.mesh.add(speaker);
	interactiveObjects.push(speaker);
	interactionMethod.push(openAudio);

	geometry = new THREE.CylinderBufferGeometry(width/10, width/10, width/10, 20);
	speaker = new THREE.Mesh(geometry, speakerMaterial);
	speaker.rotateX(THREE.Math.degToRad(90));
	speaker.position.set(0, height/12, width/12);
	speaker.layers.enable(1);
	this.mesh.add(speaker);
	interactiveObjects.push(speaker);
	interactionMethod.push(openAudio);

	geometry = new THREE.SphereBufferGeometry(.75*width/10, 20, 20);
	speaker = new THREE.Mesh(geometry, speakerGrillMaterial);
	speaker.scale.set(1, 1, .25);
	speaker.position.set(0, height/12, width/12 + width/20);
	speaker.layers.enable(1);
	this.mesh.add(speaker);
	interactiveObjects.push(speaker);
	interactionMethod.push(openAudio);

	var playButtonMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
	geometry = new THREE.SphereBufferGeometry(width/100);
	speaker = new THREE.Mesh(geometry, playButtonMaterial);
	speaker.position.set(0, -width/10, width/12 + width/20);
	speaker.layers.enable(1);
	this.mesh.add(speaker);
	interactiveObjects.push(speaker);
	interactionMethod.push(openAudio);
	

	var audioElement = document.createElement("audio");
	audioElement.src = module.audio.url;
	audioElement.preload = "auto";
	audioElement.addEventListener("playing", function() {
		playButtonMaterial.color.set(0xff0000);
	});
	audioElement.addEventListener("pause", function() {
		playButtonMaterial.color.set(0x000000);
	});
	audioElement.addEventListener("ended", function() {
		playButtonMaterial.color.set(0x000000);
	});
	
	return this.mesh;
}