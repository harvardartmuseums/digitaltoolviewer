function openText() {
	console.log(this);
}

function TextModule(width, height, module) {
	this.mesh = new THREE.Group();
	
	var element = document.createElement("div");
	document.body.appendChild(element);
	element.innerHTML = module.text;
	element.classList.add("textModule");
	element.style.width = 4*(2*width/3 + 6) + "px";
	element.style.maxHeight = 4*(height + 6) + "px";

	setTimeout(function() {
		generateCutout(this, element, undefined, undefined, undefined, undefined, true, true, openText.bind(module.text));
	}.bind(this.mesh), 10);
	
	return this.mesh;
}