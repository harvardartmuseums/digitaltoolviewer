function openCloseup() {
	console.log("closeup");
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
	var paddingX = 0;
	var paddingY = 0;
	img.onload = function() {
		if (img.naturalWidth/img.naturalHeight < width/height) {
			paddingX = (1 - (height/width)*(img.naturalHeight/img.naturalWidth))/2;
			zoom.style.padding = "0 " + 1000*paddingX + "%";
			//zoom.style.width = 1000*scaleX + "%";
		} else {
			paddingY = (1 - (width/height)*(img.naturalWidth/img.naturalHeight))/2;
			zoom.style.padding = 1000*paddingY + "% 0";
			//zoom.style.height = 1000*scaleY + "%";
		}
	};
	img.src = module.images[0].file;
	zoom.appendChild(img);
	
	var index = styleSheet.length;
	var keyframes = "@keyframes z" + module.id + " {";
	for (var i = 0; i < module.images[0].hotspots.length; i++) {
		keyframes += i*100/module.images[0].hotspots.length + "%, ";
		if (i == 0) {
			keyframes += "100%, ";
		}
		keyframes += (i + .4)*100/module.images[0].hotspots.length + "% ";
		keyframes += "{left: " + -10*(module.images[0].hotspots[i].coord_x) + 1000*paddingX + "%; top: " + -10*(module.images[0].hotspots[i].coord_y) + 1000*paddingY + "%; transform: scale(1, 1)} ";

		keyframes += (i + .5)*100/module.images[0].hotspots.length + "%, ";
		keyframes += (i + .9)*100/module.images[0].hotspots.length + "% ";
		keyframes += "{left: -450%; top: -450%; transform: scale(.1, .1)} ";

		zoom.appendChild(closeup(module.images[0].hotspots[i].coord_x, module.images[0].hotspots[i].coord_y, module.images[0].hotspots[i].caption));
	}
	styleSheet.insertRule(keyframes, index);
	zoom.style.animation = "z" + module.id + " " + module.images[0].hotspots.length*10 + "s infinite";
	zoom.style.animationDelay = -10*Math.random() + "s";

	setTimeout(function() {
		generateCutout(this, element, undefined, 4*width, 4*height, undefined, true, true, openCloseup.bind(element));
	}.bind(this.mesh), 10);
	
	return this.mesh;
}