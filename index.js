'use strict';

const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');

const PORT = process.env.PORT || 3000;

app.get('/index.html', function(req, res){
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/control.html', function(req, res) {
	res.sendFile(path.join(__dirname, '/control.html'));
});

app.get('/js/three.min.js', function(req, res){
	res.sendFile(path.join(__dirname, '/js/three.min.js'));
});

app.get('/js/Mirror.js', function(req, res){
	res.sendFile(path.join(__dirname, '/js/Mirror.js'));
});

app.get('/js/CSS3DRenderer.js', function(req, res){
	res.sendFile(path.join(__dirname, '/js/CSS3DRenderer.js'));
});

app.get('/js/digitaltoolviewer.min.js', function(req, res){
	res.sendFile(path.join(__dirname, '/js/digitaltoolviewer.min.js'));
});

app.get('/css/mediaStyles.css', function(req, res){
	res.sendFile(path.join(__dirname, '/css/mediaStyles.css'));
});

var screensIO = io.of('/screens-namespace');
var controlIO = io.of('/control-namespace');

var screens = [];
var scenes = {};

function getId() {
	var id = Math.floor(9000*Math.random()) + 1000;
	if (screens.indexOf(id) != -1) {
		return getId();
	} else {
		return id + "";
	}
}

screensIO.on('connection', function(socket) {
	socket.on("getTour", function(number) {
		http.get('http://www.harvardartmuseums.org/tour/' + number + '/getInfo', (res) => {
			if (res.statusCode == 200) {
				var rawData = '';
				res.setEncoding('utf8');
				res.on('data', (data) => {rawData += data;});
				res.on('end', () => {
					socket.emit("tourData", JSON.parse(rawData));
				});
			} 
		});
	});

	socket.on("id", function(id) {
		if (!id) {
			id = getId();
			socket.emit('id', id);
		} 
		screens.push(id);
		socket.join(id);

		socket.on("reset", function() {
			controlIO.to(this).emit("reset");
			screensIO.to(this).emit("reset");
		}.bind(id));

		socket.on("open", function(html, clickable) {
			controlIO.to(this).emit("open", html, clickable);
		}.bind(id));

		socket.on("openOverlay", function(id) {
			controlIO.to(this).emit("openOverlay", id);
		}.bind(id));

		socket.on("scene", function(data) {
			scenes[this] = data;
			controlIO.to(this).emit("setupControl", data);
		}.bind(id));
	});
});

controlIO.on('connection', function(socket) {
	socket.on('id', function(id) {
		if (screens.indexOf(id) != -1) {
			socket.join(id);
	
			if (scenes[id]) {
				socket.emit("setupControl", scenes[id]);
				controlIO.to(id).emit("reset");
				screensIO.to(id).emit("reset");
			}

			socket.on("jumpTo", function(location, rotation) {
				screensIO.to(this).emit("jumpTo", location, rotation);
				controlIO.to(this).emit("jumpTo", location, rotation);
			}.bind(id));

			socket.on("move", function(direction) {
				screensIO.to(this).emit("move", direction);
				controlIO.to(this).emit("move", direction);
			}.bind(id));

			socket.on("stop", function(direction) {
				screensIO.to(this).emit("stop", direction);
				controlIO.to(this).emit("stop", direction);
			}.bind(id));

			socket.on("click", function(e) {
				screensIO.to(this).emit("click", e);
			}.bind(id));
		} else {
			socket.emit("invalid id");
		}
	});
});

server.listen(PORT);
