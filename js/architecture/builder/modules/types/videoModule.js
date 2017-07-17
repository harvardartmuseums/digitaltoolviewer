var vimeoURL = new RegExp('(?:vimeo.com/|vimeo.com/video/)([0-9]+)', 'i');
var youTubeURL = new RegExp('(?:youtube.com/watch\\?v=|youtu.be/|youtube.com/embed/)([0-9a-zA-Z]+)', 'i');

var blueScreen = "<div class=\"error\">A problem has been detected and Windows has been shut down to prevent damage to your computer.<br /><br />If this is the first time you've seen this Stop error screen, restart your computer. If this screen appears again, follow these steps:<br /><br />Check to make sure any new hardware or software is properly installed. If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need.<br /><br />If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing. If you need to use Safe Mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode.<br /><br />Technical information:<br /><br />*** STOP: 0x00000050 (0xFD3094C2, 0x00000001, 0xFBFE7617, 0x00000000)<br /><br /><br />Collecting data for crash dump ...<br />Initializing disk for crash dump ...<br />Beginning dump of physical memory.<br />Dumping physical memory to disk: 100<br />Physical memory dump complete.</div>";

function toggleVideo(vimeo) {
	if (this) {
		if (vimeo) {
			if (this.getPaused()) {
				this.play();
			} else {
				this.pause();
				this.setCurrentTime(0);
			}
		} else {
			if (this.getPlayerState() != 1) {
				this.playVideo();
			} else {
				this.pauseVideo();
				this.seekTo(0, true);
			}
		}
	}
}

function VideoModule(width, height, module) {
	this.mesh = new THREE.Group();

	// Create image, wait for it to load
	var videoElement = document.createElement("div");
	document.body.appendChild(videoElement);
	videoElement.classList.add("videoModule");
	videoElement.style.width = 4*width  + "px";
	videoElement.style.height = 4*height  + "px";

	var element = document.createElement("div");
	videoElement.appendChild(element);

	var vimeo = vimeoURL.exec(module.videos.url);
	var youTube = youTubeURL.exec(module.videos.url);

	var video;
	var play;
	var pause;
	if (vimeo != null) {
		video = new Vimeo.Player(element, {id: vimeo[1], byline: false, color: "ffffff", height: 4*height, width: 4*width, title: false, portrait: false});
		video.enableTextTrack('en');
	} else if (youTube != null) {
		video = new YT.Player(element, {videoId: youTube[1], height: 4*height, width: 4*width, cc_load_policy: 1, controls: 0, disablekb: 1, enablejsapi: 1, fs: 0, modestbranding: 1, origin: "http://digitaltoolviewer.herokuapp.com/", rel: 0, showinfo: 0});
	} else {
		videoElement.innerHTML = blueScreen;
	}

	setTimeout(function() {
		generateCutout(this, videoElement, undefined, undefined, undefined, undefined, true, true, toggleVideo.bind(video, vimeo)); 
	}.bind(this.mesh), 100);

	return this.mesh;
}
