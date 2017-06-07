function openEmbed() {
	console.log("embed");
}

function EmbedModule(width, height, module) {
	this.mesh = new THREE.Group();

	var embedElement = document.createElement("div");
	document.body.appendChild(embedElement);
	embedElement.classList.add("embedModule");
	embedElement.style.width = 4*width  + "px";
	embedElement.style.height = 4*height  + "px";

	if (module.embed.embed_type == 1) {
		embedElement.innerHTML = "<iframe src=\"" + module.embed.embed_code + "\" frameborder=\"0\" style=\"border:0\" width=\"" + 4*width + "px\" height=\"" + 4*height + "px\" allowfullscreen></iframe>";
	} else if (module.embed.embed_type == 2) {
		embedElement.innerHTML = module.embed.embed_code;
	}

	setTimeout(function() {
		generateCutout(this, embedElement, undefined, undefined, undefined, undefined, true, true, openEmbed.bind(embedElement)); 
	}.bind(this.mesh), 10);
	
	return this.mesh;
}
