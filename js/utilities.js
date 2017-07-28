var randomSeed = 1;

// Generate a seeded random number
function random(s) {
	if (!s) {
		randomSeed++;
		s = randomSeed;
	}
	var x = Math.sin(s)*10000;
	return x - Math.floor(x);
}

// Find index of last space in a string, counting from end
function lastSpaceIndex(text) {
	var lastSpace = text.split("").reverse().join("").indexOf(" ");
	if (lastSpace == -1) {
		lastSpace = 0;
	}
	return lastSpace;
}

// Put wrapped text on the given canvas
function wrapText(context, x, y, text, fontSize, font, up, width) {
	(up == undefined)? up = false : up = up;
	(width == undefined)? width = 1020 : width = width;
	if (text == undefined) {
		return y;
	}

	var chars = Math.floor(width/fontSize*2);

	context.fillStyle = "#000000";
	context.font = fontSize + "px " + font;
	
	var i = 0;
	var lastSpace = 0;
	if (up) {
		var lines = [];
		while (text.length > 0) {
			if (text.length > chars) {
				lastSpace = lastSpaceIndex(text.slice(0, chars));
			} else {
				lastSpace = 0;
			}
			lines.push(text.slice(0, chars - lastSpace));
			text = text.slice(chars - lastSpace);
			i--;
		}
		for (var j = 0; j < lines.length; j++) {
			context.fillText(lines[j], x, (y - (lines.length - j)*(fontSize + 10)));
		}
	} else {
		while (text.length > 0) {
			if (text.length > chars) {
				lastSpace = lastSpaceIndex(text.slice(0, chars));
			} else {
				lastSpace = 0;
			}
			context.fillText(text.slice(0, chars - lastSpace), x, (y + i*(fontSize + 10)));
			text = text.slice(chars - lastSpace);
			i++;
		}
	} 

	return (y + i*(fontSize + 10));
}

// Put centered text on the given context
function centerText(context, width, height, text, fontSize, font) {
	var chars = Math.floor(width/fontSize*2);

	context.fillStyle = "#000000";
	context.font = fontSize + "px " + font;
	context.textAlign = "center";
	
	var i = 0;
	var lastSpace = 0;

	var lines = [];

	while (text.length > 0) {
		if (text.length > chars) {
			lastSpace = lastSpaceIndex(text.slice(0, chars));
		} else {
			lastSpace = 0;
		}
		lines.push(text.slice(0, chars - lastSpace));
		text = text.slice(chars - lastSpace);
	}

	if (lines.length > 6) {
		centerText(context, width, height, lines.join(""), fontSize - 2, font);
		return;
	}

	for (var i = 0; i < lines.length; i++) {
		context.fillText(lines[i], width/2, (height + fontSize*(i*2 - lines.length + 1.5))/2);
	}
}

function randomSign() {
	return (1 - 2*Math.round(random()));
}

