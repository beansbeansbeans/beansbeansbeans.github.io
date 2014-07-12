define([], function() {
	var home = {
		initialize: function() {
			$("#view").html("<div id='homepage'><div id='top'></div></div>");

			var counter = 0,
				frameCount = 25,
				frameWidth = 353.5,
				self = this;

			function animate(timestamp) {

				if(counter%4 == 0) {
					var frame = Math.floor(counter / 2) % frameCount;
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