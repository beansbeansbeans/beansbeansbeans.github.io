define([], function() {
	var home = {
		initialize: function() {
			$("#view").html("<div id='homepage'><h1>home</h1><div id='top'></div></div>");

			var counter = 0,
				frameCount = 25,
				frameWidth = 341,
				frameInterval = 4,
				self = this;

			function animate(timestamp) {

				if(counter%frameInterval == 0) {
					var frame = Math.floor(counter / frameInterval) % frameCount;
					$("#top").css("background-position", (frame * frameWidth) + "px 0px");
				}
				counter++;
				/*
				IMPLEMENTATION BUG??? SHOULDN'T HAVE TO BE RESET EVERY FRAME
				 */
				self.requestID = window.webkitRequestAnimationFrame(animate);

			}

			this.requestID = window.webkitRequestAnimationFrame(animate);
		},
		destroy: function() {
			window.cancelAnimationFrame(this.requestID);
		}
	}
	return home;
})