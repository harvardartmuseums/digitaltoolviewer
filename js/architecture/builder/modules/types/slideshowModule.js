var styleSheet;

function setupAnimations() {
	styleSheet = document.createElement("style");
	document.head.appendChild(styleSheet);
	styleSheet = styleSheet.sheet;
}

function openSlideshow() {
	console.log("slideshow");
}

function labeledImage(width, height, image, label) {
	var div = document.createElement("div");
	div.className = "labeledDiv";
	div.style.width = width;
	div.style.height = height;

	var img = document.createElement("img");
	img.src = image;
	div.appendChild(img);

	var text = document.createElement("span");
	text.innerHTML = label;
	div.appendChild(text);

	return div;
}

function SlideshowModule(width, height, module) {
	this.mesh = new THREE.Group();

	if (module.view_type == 1) {
		var element = document.createElement("div");
		element.classList.add("slideshowModule"); 
		element.classList.add("slides");
		element.style.width = 4*width + "px";
		element.style.height = 4*height + "px";

		var container = document.createElement("div");
		element.appendChild(container);
		container.style.width = (module.images.length + 1)*100 + "%";

		var index = styleSheet.length;
		var keyframes = "@keyframes s" + module.id + " {";
		for (var i = 0; i < module.images.length; i++) {
			keyframes += i*100/module.images.length + "%, ";
			keyframes += (i + .9)*100/module.images.length + "% ";
			keyframes += "{left: " + -i*100 + "%} ";
		}
		keyframes += "100% {left: -" + module.images.length*100 + "%}}";
		styleSheet.insertRule(keyframes, index);
		container.style.animation = "s" + module.id + " " + module.images.length*15 + "s infinite";
		container.style.animationDelay = -15*Math.random() + "s";

		var text;
		for (var i = 0; i < module.images.length; i++) {
			text = "<h1>" + module.images[i].title + "</h1>" + ((module.images[i].caption != "")? "<br /><h2>" + module.images[i].caption + "</h2>" : "") + ((module.images[i].credit != "")? "<br /><br />" + module.images[i].credit : "");
			container.appendChild(
				labeledImage(
					100/(module.images.length + 1) + "%",
					"100%",
					module.images[i].file, 
					text)
			);
		}

		text = "<h1>" + module.images[0].title + "</h1>" + ((module.images[0].caption != "")? "<br /><h2>" + module.images[0].caption + "</h2>" : "") + ((module.images[0].credit != "")? "<br /><br />" + module.images[0].credit : "");
		container.appendChild(
			labeledImage(
				100/(module.images.length + 1) + "%",
				"100%",
				module.images[0].file, 
				text)
		);

		setTimeout(function() {
			generateCutout(this, element, undefined, 4*width, 4*height, undefined, true, true, openSlideshow.bind(element));
		}.bind(this.mesh), 100);

	} else {
		load(module.images.length - 1);
		var max = Math.ceil(Math.sqrt(module.images.length));
		var i = 0;
		for (var j = 0; j < max; j++) {
			for (var k = 0; k < max; k++) {
				if (i < module.images.length) {
					Image3D(this.mesh, module.images[i].file, new THREE.Vector3((-max/2 + .5 + k)*width/max, (max/2 - .5 - j)*height/max, 0), width/max, height/max, true);
					i++;
				} else {
					return this.mesh;
				}
			}
		}
	}
	

	return this.mesh;
}