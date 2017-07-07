function openMirador() {
	console.log("mirador");
}

function MiradorModule(width, height, module) {
	load();

	this.mesh = new THREE.Group();

	var miradorElement = document.createElement("div");
	document.body.appendChild(miradorElement);
	miradorElement.classList.add("miradorModule");
	miradorElement.style.width = 4*width  + "px";
	miradorElement.style.height = 4*height  + "px";

	miradorElement.innerHTML = "<iframe src=\"http://www.harvardartmuseums.org/miradorviewer/module/" + module.mirador.id + "\" frameborder=\"0\" style=\"border:0\" width=\"" + width*4 + "px\" height=\"" + height*4 + "px\" allowfullscreen></iframe>";

	setTimeout(function() {
		generateCutout(this, miradorElement, undefined, undefined, undefined, undefined, true, true, openMirador.bind(module.mirador.id)); 
	}.bind(this.mesh), 10);
	
	return this.mesh;
}