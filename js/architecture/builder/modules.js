var textToRemove = /^(<[^>]*>&nbsp;<\/[^>]*>\n)?(<[^>]*>)+(?:Fig(?:ure)?\.? [0-9]*|Locate on the Floor Plan|Click here for.*)(<\/[^>]*>)+$/;

var moduleLocations = [];

var gridLocations = [
	[1, 0], [2, 0], 
	[0, 1], [3, 1],
	[0, 0], [3, 0],
	[1, 2], [2, 2],
	[0, 2], [3, 2],
	[1, 3], [2, 3],
	[0, 3], [3, 3]
];

function setupModules() {
	var l;

	for (var i = 0; i < gridLocations.length; i++) {
		l = gridLocations[i];
		moduleLocations.push(new THREE.Vector3((l[0] - 1.5)*(wallUnitWidth - wallDepth*3)/4, (l[1] - 1.5)*(wallUnitWidth - wallDepth*3)/4, .01));
	}

	socket.on("slideOverlay", function(id, clip) {
		document.getElementById(id).style.clipPath = "inset(0% " + clip + "% 0% 0%)";
	});
}

function cleanModules(modules, slide, fixedModules) {
	if (modules.length == 0) {
		addModulesToSlide(fixedModules, slide);
		return;
	}

	var module = modules.shift();
	if (validTypes.indexOf(module.type.toString()) == -1) {
		loaded();
		cleanModules(modules, slide, fixedModules);
	} else if (module.type == 1 && (textToRemove.exec(module.text) != null)) {
		loaded();
		cleanModules(modules, slide, fixedModules);
	} else if (module.type == 2) {
		var img = new Image();
		img.onload = function () {
			if (img.width == 409 && img.height == 15) {
				loaded();
				cleanModules(modules, slide, fixedModules);
			} else {
				fixedModules.push(module);
				cleanModules(modules, slide, fixedModules);
			}
			img.remove();
		};
		img.src = module.images[0].file;
	} else {
		fixedModules.push(module);
		cleanModules(modules, slide, fixedModules);
	}
}

function addModulesToSlide(modules, slide) {
	var module;
	if (modules.length == 1) {
		module = new Module(modules[0]);
		module.position.set(0, -1.5*(wallUnitWidth - wallDepth*3)/4, .01);
		module.updateMatrix();
		slide.add(module);
	} else if (modules.length == 2) {
		module = new Module(modules[0]);
		module.position.set((wallUnitWidth - wallDepth*3)/8, -1.5*(wallUnitWidth - wallDepth*3)/4, .01);
		module.updateMatrix();
		slide.add(module);

		module = new Module(modules[1]);
		module.position.set(-(wallUnitWidth - wallDepth*3)/8, -1.5*(wallUnitWidth - wallDepth*3)/4, .01);
		module.updateMatrix();
		slide.add(module);
	} else {
		var locations = moduleLocations.slice(0, 2*Math.ceil(modules.length/2));

		var location;
		for (var i = 0; i < modules.length; i++) {
			if (locations.length == 0) {
				break;
			}
			module = new Module(modules[i]);
			location = Math.floor(locations.length*random());
			module.position.copy(locations[location]);
			module.updateMatrix();
			locations.splice(location, 1);
			slide.add(module);
		}
	}
}