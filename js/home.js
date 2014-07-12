define([], function() {
	var home = {
		initialize: function() {
			$("#view").html("<div id='homepage'><div id='top'></div></div>");

			var counter = 0,
				frameCount = 25,
				frameWidth = 353.5;

			function animate(timestamp) {

				if(counter%4 == 0) {
					var frame = Math.floor(counter / 2) % frameCount;
					$("#top").css("background-position", (frame * frameWidth) + "px 0px");
				}
				counter++;
				window.webkitRequestAnimationFrame(animate);

			}

			window.webkitRequestAnimationFrame(animate);
		}
	}
	return home;
})