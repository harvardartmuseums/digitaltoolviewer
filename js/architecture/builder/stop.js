function Stop(stop) {
	this.mesh = new THREE.Group();
	if (stop == undefined) {
		this.mesh.add(new Wall());
	} else {
		this.mesh.add(new Wall(true));

		var textPanel = new TextPanel(stop.title, stop.image_file, stop.image_caption, stop.image_credit);
		textPanel.position.set(-wallUnitWidth/3, wallHeight/2 - wallUnitWidth/12, -.01);
		textPanel.updateMatrix();
		this.mesh.add(textPanel);
		
		var wall;
		var extraWalls = (stop.slides.length <= 3)? 0 : Math.ceil((stop.slides.length - 3)/2);

		for (var i = 0; i <= extraWalls; i++) {
			wall = new Wall();
			wall.position.set(wallUnitWidth/2 - wallDepth/2, 0, wallUnitWidth*(i + .5));
			wall.rotateY(THREE.Math.degToRad(90));
			wall.updateMatrix();
			this.mesh.add(wall);

			wall = new Wall();
			wall.position.set(-wallUnitWidth/2 + wallDepth/2, 0, wallUnitWidth*(i + .5));
			wall.rotateY(THREE.Math.degToRad(90));
			wall.updateMatrix();
			this.mesh.add(wall);	
		}
		
		wall = new Wall();
		wall.position.set(0, 0, wallUnitWidth*(extraWalls + 1) + wallDepth/2);
		wall.updateMatrix();
		this.mesh.add(wall);

		if (stop.slides.length == 1) {
			slide = new Slide(stop.slides[0]);
			slide.position.set(0, wallHeight/2, wallUnitWidth);
			slide.rotateY(THREE.Math.degToRad(180));
			slide.updateMatrix();
			this.mesh.add(slide);
		} else {
			var gap = Math.floor(((extraWalls*2 + 3) - stop.slides.length)/2);

			var slideIndex = 0;
			var slide;
	
			for (var i = 0; i < extraWalls + 1; i++) {
				slide = new Slide(stop.slides[slideIndex]);
				slide.position.set(wallUnitWidth/2 - wallDepth, wallHeight/2, wallUnitWidth*(i + .5));
				slide.rotateY(THREE.Math.degToRad(-90));
				slide.updateMatrix();
				this.mesh.add(slide);
				slideIndex++;
			}

			slide = new Slide(stop.slides[slideIndex]);
			slide.position.set(0, wallHeight/2, wallUnitWidth*(extraWalls + 1));
			slide.rotateY(THREE.Math.degToRad(180));
			slide.updateMatrix();
			this.mesh.add(slide);
			slideIndex++;

			for (var i = extraWalls + 1; i > 0; i--) {
				if (slideIndex == stop.slides.length) {
					break;
				}
				slide = new Slide(stop.slides[slideIndex]);
				slide.position.set(-wallUnitWidth/2 + wallDepth, wallHeight/2, wallUnitWidth*(i - .5));
				slide.rotateY(THREE.Math.degToRad(90));
				slide.updateMatrix();
				this.mesh.add(slide);
				slideIndex++;
			}
		}

		var floor = new Floor(1, extraWalls + 1);
		floor.position.set(0, -wallDepth/2, (wallUnitWidth*(extraWalls + 1) + wallDepth)/2);
		floor.updateMatrix();
		this.mesh.add(floor);
		
		var ceiling = new Ceiling(1, extraWalls + 1);
		ceiling.position.set(0, wallHeight + wallDepth/2, (wallUnitWidth*(extraWalls + 1) + wallDepth)/2);
		ceiling.updateMatrix();
		this.mesh.add(ceiling);
	}
	return this.mesh;
}