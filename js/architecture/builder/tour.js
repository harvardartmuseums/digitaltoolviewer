var tour;
var building;

var thisScreen;

function getTourFromURL() {
	var tourNumber;
	var regex = new RegExp("\\?tour=([0-9]*)(?:&screen=([0-8]?))?(?:&id=([0-9]{4}?))?");
	var match = regex.exec(window.location.search);
	if (match != null) {
		tourNumber = match[1];
		if (match[2]) {
			thisScreen = match[2];

			var offsetHorizontal = ((match[2])%3);
			var offsetVertical = Math.floor(match[2]/3);
			camera.setViewOffset(5760, 3240, 1920*offsetHorizontal, 1080*offsetVertical, 1920, 1080);
			cssCanvas.style.width = "300vw";
			cssCanvas.style.height = "300vh";
			cssRenderer.domElement.style.top = (-100*offsetVertical) + "vh";
			cssRenderer.domElement.style.left = (-100*offsetHorizontal) + "vw";
			renderer.domElement.style.top = 100*offsetVertical + "vh";
			renderer.domElement.style.left = 100*offsetHorizontal + "vw";
			resize();
		}
		socket.emit("id", match[3]);
		socket.emit("getTour", tourNumber);
		return true;
	}
	return false;
}

function buildTour() {
	socket.on("tourData", function(data) {
		tour = data;

		THREE.Object3D.DefaultMatrixAutoUpdate = false;

		building = new TourRoom(tour);
		scene.add(building);

		finishSetup();
	});

	if (!getTourFromURL()) {
		var element = document.createElement("div");
		document.body.appendChild(element);
		element.id = "tourPrompt";
		element.innerHTML = "<span>Tour number:<br /><form action=\"\" method=\"get\"><input type=\"number\" min=\"0\" size=\"4\" name=\"tour\" id=\"tourNumber\" /><br /><br />Lightbox screen:<br /><input type=\"number\" min=\"0\" max=\"8\" size=\"1\" name=\"screen\" id=\"screenNumber\" /><br /><br />Syncing ID:<br /><input type=\"number\" min=\"1000\" max=\"9999\" size=\"4\" name=\"id\" /><br /><br /><input type=\"submit\" /></form></span>";
	}
}

function TourRoom(tourData) {
	this.mesh = new THREE.Group();

	var wall;
	var walls = (tourData.stops.length == 0)? 4 : Math.ceil(tourData.stops.length/4)*4;

	var offsetCenter = (wallUnitWidth*walls/4 + wallDepth)/2;
	var offsetWall = walls/4/2 - .5;

	this.mesh.add(new Floor(walls/4, walls/4));
	this.mesh.add(new Ceiling(walls/4, walls/4));

	var tstand = new TStand(tourData.title, tourData.image_file, tourData.image_caption, tourData.image_credit, tourData.description);
	tstand.position.set(0, 0, -wallDepth*3.01);
	tstand.updateMatrix();
	this.mesh.add(tstand);


	//var light = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.3);
	//light.position.set(0, 400, 0);
	//scene.add(light);

	//lights.push(light);

	var light = new THREE.DirectionalLight(0xffffff, .5);
	light.position.set(-2000, 0, 1750);
	scene.add(light);
	light.updateMatrix();
	light.layers.enable(1);

	lights.push(light);


	light = new THREE.DirectionalLight(0xffffff, .6);
	light.position.set(1000, -500, -1000);
	scene.add(light);
	light.updateMatrix();
	light.layers.enable(1);

	lights.push(light);


	light = new THREE.DirectionalLight(0xffffff, .3);
	light.position.set(500, 2000, 250);
	scene.add(light);
	light.updateMatrix();
	light.layers.enable(1);

	lights.push(light);


	for (var i = 0; i < walls; i++) {
		wall = new Stop(tourData.stops[i]);
		switch (i%4) {
			case 0:
				wall.position.set((i/4 - offsetWall)*wallUnitWidth, 0, -offsetCenter);
				wall.rotateY(THREE.Math.degToRad(180));
				break;
			case 1:
				wall.position.set(((i - 1)/4 - offsetWall)*wallUnitWidth, 0, offsetCenter);
				break;
			case 2:
				wall.position.set(offsetCenter, 0, (offsetWall - (i - 2)/4)*wallUnitWidth);
				wall.rotateY(THREE.Math.degToRad(90));
				break;
			case 3:
				wall.position.set(-offsetCenter, 0, ((i - 3)/4 - offsetWall)*wallUnitWidth);
				wall.rotateY(THREE.Math.degToRad(-90));
				break;
		}
		wall.updateMatrix();
		this.mesh.add(wall);
	}
	
	return this.mesh;	
}