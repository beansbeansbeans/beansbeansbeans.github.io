define([], function() {
	var home = {
		needsLoading: true,
		preloadAssets: [
			"top.png",
			"shadow.png"
		],
		initialize: function() {
			$("#view").html("<div id='homepage'><h1>Hello</h1><div class='description'>This top spins forever.</div><div id='top-container'><div id='top'></div><div id='shadow'></div></div></div>");

			var counter = 0,
				frameCount = 25,
				frameWidth = 256,
				shadowWidth = 362,
				frameInterval = 4,
				self = this;

			function animate(timestamp) {

				if(counter%frameInterval == 0) {
					var frame = Math.floor(counter / frameInterval) % frameCount;
					$("#top").css("background-position", (frame * frameWidth) + "px 0px");
					$("#shadow").css("background-position", (frame * shadowWidth) + "px 0px");
				}
				counter++;
				self.requestID = requestAnimationFrame(animate);
			}

			this.requestID = requestAnimationFrame(animate);
		},
		destroy: function() {
			window.cancelAnimationFrame(this.requestID);
		}
	}
	return home;
})
