var moduleTypes = {
	1: {label: false, cons: TextModule},
	2: {label: true, media: "images", cons: ImageModule, frame: GlazedFrame},
	3: {label: false, cons: SlideshowModule, frame: Screen},
	4: {label: true, media: "videos", cons: VideoModule, frame: Screen},
	5: {label: false, cons: AudioModule},
	6: {label: true, media: "images", cons: CloseupModule, frame: GlazedFrame},
	7: {label: true, media: "images", cons: OverlayModule, frame: Screen},
	8: {label: true, media: "images", cons: ComparisonModule, frame: Screen},
	11: {label: false, cons: EmbedModule, frame: Screen},
	12: {label: false, cons: MiradorModule, frame: Screen}
};

var validTypes = Object.keys(moduleTypes);

function Module(module) {
	this.mesh = new THREE.Group();

	var type = moduleTypes[module.type];

	var offset = (wallUnitWidth - wallDepth*3)/8 - wallDepth/10;
	var top = right = offset;
	var bottom = left = -offset;

	if (type.label) {
		var labelWidth = offset*2/3;

		var label;
		if (type.media == "images") {
			label = new ModuleLabel(labelWidth, module.images[0].title, module.images[0].caption, module.images[0].credit);
		} else {
			label = new ModuleLabel(labelWidth, module[type.media].title, module[type.media].caption, module[type.media].credit);
		}

		var verticalAlign = randomSign();

		if ((module.type == 7 || module.type == 8) && (module.images[0].title + module.images[0].caption + module.images[0].credit != module.images[1].title, module.images[1].caption, module.images[1].credit)) {
			label.position.set(-(offset - labelWidth/2), verticalAlign*(offset - labelWidth/2), 0);
			label.updateMatrix();
			this.mesh.add(label);

			label = new ModuleLabel(labelWidth, module.images[1].title, module.images[1].caption, module.images[1].credit);
			label.position.set((offset - labelWidth/2), verticalAlign*(offset - labelWidth/2), 0);
			label.updateMatrix();
		} else {
			label.position.set(randomSign()*(offset - labelWidth/2), verticalAlign*(offset - labelWidth/2), 0);
			label.updateMatrix();
		}

		top -= labelWidth*(verticalAlign + 1)/2;
		bottom -= labelWidth*(verticalAlign - 1)/2;

		this.mesh.add(label);
	}

	var width = right - left;
	var height = top - bottom;

	if (type.frame != undefined) {
		var moduleObj = new type.frame(width, height, type.cons, module);
	} else {
		var moduleObj = new type.cons(width, height, module);
	}
	moduleObj.position.set(left + width/2, bottom + height/2, 0);
	moduleObj.updateMatrix();
	this.mesh.add(moduleObj);

	return this.mesh;
}

function Screen(width, height, constructor, module) {
	this.mesh = new THREE.Group();

	var mirror = new THREE.Mirror(width - wallDepth/5, height - wallDepth/5, {clipBias: .003, textureWidth: 1920, textureHeight: 1080, color: 0xaaaaaa});
	mirrors.push(mirror);
	mirror.position.set(0, 0, 2*wallDepth/8 + .05);
	mirror.updateMatrix();
	this.mesh.add(mirror);

	var geometry = new THREE.BoxBufferGeometry(width - wallDepth/4, height - wallDepth/4, wallDepth/8);
	var screen = new THREE.Mesh(geometry, screenMaterial);
	screen.position.set(0, 0, 1.5*wallDepth/8);
	screen.layers.enable(1);
	screen.updateMatrix();
	this.mesh.add(screen);

	var frame = new Frame(width, height, wallDepth/8, wallDepth/80, monitorMaterial);
	frame.position.set(0, 0, wallDepth/8);
	frame.updateMatrix();
	this.mesh.add(frame);

	geometry = new THREE.BoxBufferGeometry(width - 3*wallDepth/5, height - 3*wallDepth/5, 1.5*wallDepth/8);
	var mount = new THREE.Mesh(geometry, monitorMaterial);
	mount.position.set(0, 0, .75*wallDepth/8);
	mount.updateMatrix();
	this.mesh.add(mount);

	var obj = constructor(width - wallDepth/5, height - wallDepth/5, module);
	obj.position.set(0, 0, 2*wallDepth/8);
	obj.updateMatrix();
	this.mesh.add(obj);

	return this.mesh;
}

function GlazedFrame(width, height, constructor, module) {
	this.mesh = new THREE.Group();

	var obj = constructor(width - wallDepth/5, height - wallDepth/5, module);
	this.mesh.add(obj);

	var mirror = new THREE.Mirror(width - wallDepth/5, height - wallDepth/5, {clipBias: .003, textureWidth: 1920, textureHeight: 1080});
	mirrors.push(mirror);
	mirror.position.set(0, 0, wallDepth/20 + .05);
	mirror.updateMatrix();
	this.mesh.add(mirror);

	var frame = new Frame(width, height, wallDepth/12, wallDepth/40, frameMaterial);
	frame.position.set(0, 0, 0);
	frame.updateMatrix();
	this.mesh.add(frame);



	return this.mesh;
}

function Frame(width, height, frameWidth, frameProtrusion, material) {
	this.mesh = new THREE.Group();

	var geometry = new THREE.BoxBufferGeometry(width - frameWidth, frameWidth, frameWidth + frameProtrusion);
	var frame = new THREE.Mesh(geometry, material);
	frame.position.set(0, height/2 - frameWidth, frameProtrusion + frameWidth/2);
	frame.updateMatrix();
	frame.layers.enable(1);
	this.mesh.add(frame);

	frame = new THREE.Mesh(geometry, material);
	frame.position.set(0, -height/2 + frameWidth, frameProtrusion + frameWidth/2);
	frame.updateMatrix();
	frame.layers.enable(1);
	this.mesh.add(frame);

	geometry = new THREE.BoxBufferGeometry(frameWidth, height - frameWidth, frameWidth + frameProtrusion);
	frame = new THREE.Mesh(geometry, material);
	frame.position.set(width/2 - frameWidth, 0, frameProtrusion + frameWidth/2);
	frame.updateMatrix();
	frame.layers.enable(1);
	this.mesh.add(frame);

	frame = new THREE.Mesh(geometry, material);
	frame.position.set(-width/2 + frameWidth, 0, frameProtrusion + frameWidth/2);
	frame.updateMatrix();
	frame.layers.enable(1);
	this.mesh.add(frame);

	return this.mesh;
}

function generateCutout(mesh, cssElement, pos, width, height, scale, interactive, highres, interact) {
	(pos == undefined)? pos = new THREE.Vector3(0, 0, 0) : pos = pos;
	(width == undefined)? width = cssElement.offsetWidth : width = width;
	(height == undefined)? height = cssElement.offsetHeight : height = height;
	(scale == undefined)? scale = new THREE.Vector3(1, 1, 1) : scale = scale;

	// set a hair forward of position to avoid collisions
	pos.z += .01;

	var cssObject = new THREE.CSS3DObject(cssElement);
	cssOverlay.add(cssObject);

	if (highres) {
		width = Math.floor(width/4);
		height = Math.floor(height/4);
	}

	var geometry = new THREE.PlaneBufferGeometry(width - 3, height - 3);
	var cutoutPlane = new THREE.Mesh(geometry, cutoutMaterial);
	cutoutPlane.position.set(pos.x, pos.y, pos.z);
	cutoutPlane.scale.set(scale.x, scale.y, 1);
	cutoutPlane.updateMatrix();
	cutoutPlane.layers.set(2);
	mesh.add(cutoutPlane);
	
	if (interactive) {
		var interactionPlane = cutoutPlane.clone();
		interactionPlane.material = brightMaterial;
		interactionPlane.position.set(pos.x, pos.y, .01);
		interactionPlane.updateMatrix();
		interactionPlane.layers.set(1);
		mesh.add(interactionPlane);

		interactiveObjects.push(interactionPlane);
		interactionMethod.push(interact);
	}

	// adjust css object location, orientation, and scale
	// to match its WebGL plane
	mesh.updateMatrixWorld();
	cutoutPlane.updateMatrixWorld();
	cssObject.applyMatrix(cutoutPlane.matrixWorld);

	if (highres) {
		cssObject.scale.x *= .25;
		cssObject.scale.y *= .25;
	}

	cssObject.updateMatrix();

	// if not currently updating renderer, update renderer
	if (ended) {
		animate();
	}
}

function Image3D(mesh, image, pos, boxWidth, boxHeight, interactive) {
	(pos == undefined)? pos = new THREE.Vector3(0, 0, 0) : pos = pos;

	// Create image, wait for it to load
	var imageElement = document.createElement("img");
	var start = new Date();
	imageElement.onload = function () {
		// calculate size for image in scene, and center
		var scale = new THREE.Vector3(1, 1, 1);
		if (imageElement.width/imageElement.height > boxWidth/boxHeight) {
			scale.setScalar(4*boxWidth/imageElement.width);
		} else {
			scale.setScalar(4*boxHeight/imageElement.height);
			if (!interactive) {
				pos.x += -(boxWidth - imageElement.width*boxHeight/imageElement.height)/2;
			}
		}

		var now = new Date();
		if (start.valueOf() + 10 < now.valueOf()) {
			setTimeout(function () {
				generateCutout(mesh, imageElement, pos, imageElement.width, imageElement.height, scale, interactive, true, openImage.bind(image));
			}, 10 - (now.valueOf() - start.valueOf()));
		} else {
			generateCutout(mesh, imageElement, pos, imageElement.width, imageElement.height, scale, interactive, true, openImage.bind(image));
		}
	};
	imageElement.src = image;
	var imageObject = new THREE.CSS3DObject(imageElement);
	cssOverlay.add(imageObject);
}