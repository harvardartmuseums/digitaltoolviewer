function openOverlay() {
	console.log("overlay");
}

function OverlayModule(width, height, module) {
	load();

	this.mesh = new THREE.Group();
	
	var element = document.createElement("div");
	element.innerHTML = "<img src=\"" + module.images[1].file + "\" id=\"" + module.id + "_1\" /><img src=\"" + module.images[0].file + "\" id=\"" + module.id + "_0\" />";
	document.body.appendChild(element);
	document.getElementById(module.id + "_0").style.clipPath = "inset(0% 50% 0% 0%)";
	element.classList.add("overlayModule");
	element.style.width = 4*width + "px";
	element.style.height = 4*height + "px";

	setTimeout(function() {
		generateCutout(this, element, undefined, 4*width, 4*height, undefined, true, true, openOverlay.bind(element));
	}.bind(this.mesh), 10);
	
	return this.mesh;
}