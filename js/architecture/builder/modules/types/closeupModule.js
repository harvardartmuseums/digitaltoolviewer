function toggleCloseup() {
	if (this.style.animationPlayState == "running") {
		this.style.animationPlayState = "paused";
	} else {
		this.style.animationPlayState = "running";
	}
}

function closeup(left, top, label) {
	var div = document.createElement("div");
	div.className = "closeup";
	div.style.top = top + "%";
	div.style.left = left + "%";

	var text = document.createElement("span");
	text.innerHTML = label;
	div.appendChild(text);

	return div;
}

function CloseupModule(width, height, module) {
	this.mesh = new THREE.Group();

	var element = document.createElement("div");
	element.classList.add("closeupModule");
	element.style.width = 4*width + "px";
	element.style.height = 4*height + "px";
	
	var zoom = document.createElement("div");
	element.appendChild(zoom);
	zoom.className = "zoom";

	var img = document.createElement("img");
	var scaleX = 1;
	var scaleY = 1;
	img.onload = function() {
		if (img.naturalWidth/img.naturalHeight < width/height) {
			scaleX = (height/width)*(img.naturalHeight/img.naturalWidth);
			zoom.style.margin = "0 " + (1000 - 1000*scaleX)/2 + "%";
			zoom.style.width = 1000*scaleX + "%";
		} else {
			scaleY = (width/height)*(img.naturalWidth/img.naturalHeight);
			zoom.style.margin = (1000 - 1000*scaleY)/2 + "% 0";
			zoom.style.height = 1000*scaleY + "%";
		}

		var index = styleSheet.length;
		var keyframes = "@keyframes z" + module.id + " {";
		for (var i = 0; i < module.images[0].hotspots.length; i++) {
			keyframes += i*100/module.images[0].hotspots.length + "%, ";
			if (i == 0) {
				keyframes += "100%, ";
			}
			keyframes += (i + .4)*100/module.images[0].hotspots.length + "% ";
			keyframes += "{left: " + (-10*(module.images[0].hotspots[i].coord_x)*scaleX - 1000*(1 - scaleX)/2) + "%; top: " + (-10*(module.images[0].hotspots[i].coord_y)*scaleY - 1000*(1 - scaleY)/2) + "%; transform: scale(1, 1)} ";

			keyframes += (i + .5)*100/module.images[0].hotspots.length + "%, ";
			keyframes += (i + .9)*100/module.images[0].hotspots.length + "% ";
			keyframes += "{left: -450%; top: -450%; transform: scale(.1, .1)} ";

			zoom.appendChild(closeup(module.images[0].hotspots[i].coord_x, module.images[0].hotspots[i].coord_y, module.images[0].hotspots[i].caption));
		}
		styleSheet.insertRule(keyframes, index);
		zoom.style.animation = "z" + module.id + " " + module.images[0].hotspots.length*10 + "s infinite";
		zoom.style.animationDelay = -10*random(module.id) + "s";
	};
	img.src = module.images[0].file;
	zoom.appendChild(img);

	setTimeout(function() {
		generateCutout(this, element, undefined, 4*width, 4*height, undefined, true, true, toggleCloseup.bind(zoom));
	}.bind(this.mesh), 100);
	
	return this.mesh;
}