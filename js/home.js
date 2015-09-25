define([], function() {
	var home = {
		needsLoading: true,
		preloadAssets: [
			"top.jpg",
			"shadow.png"
		],
		mobilePreloadAssets: [
			"top_mobile.jpg",
			"shadow_mobile.png"
		],
		initialize: function() {
			$("#view").html("<div id='homepage'><div class='header'><div class='title'>Hello</div><div class='blurb'>Radish top, from Etsy.</div></div><div id='top-container'><div id='top'></div><div id='shadow'></div></div></div>");

			var counter = 0,
				frameCount = 25,
				frameWidth = 256,
				shadowWidth = 362,
				frameInterval = 4,
				self = this;

			if($(window).width() <= mobile_landscape) {
				frameWidth = 179;
				shadowWidth = 253;
			}

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
