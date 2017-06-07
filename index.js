'use strict';

const app = require('express')();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');

const PORT = process.env.PORT || 3000;

var tour = "<!DOCTYPE html><html><head><title>Digital Tool Lightbox Viewer</title></head><body>";

app.get('/index.html', function(req, res){
	res.sendFile(path.join(__dirname, '/index.html'));
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
	res.sendFile(path.join(__dirname, '/js/CSS3DRenderer.js'));
});

app.get('/css/mediaStyles.css', function(req, res){
	res.sendFile(path.join(__dirname, '/css/mediaStyles.css'));
});

io.on('connection', function(socket) {
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
});

server.listen(PORT);
