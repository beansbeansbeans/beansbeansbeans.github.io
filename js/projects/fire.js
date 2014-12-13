define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var fire = {
		initialize: function() {
			var data = {
				identifier: "fire",
				title: "Fire",
				blurb: "A game.",
				projectContents: '<div id="frame"></div>',
				caption: "Built with JavaScript",
				description: "This is a game."
			},
			numColumns = 9,
			numRows = 6,
			widthFrame = 850,
			widthOverHeight = 1.77,
			numFrames = 5,
			framesPerSecond = 1,
			cells = [],
			keyframeProp,
			animProp,
			transformProp;

			$("#view").html(projectTemplate(data));

			['', 'webkit', 'moz'].every(function(prefix) {
				var property = prefix.length ? prefix + "Animation" : "animation";

				if(typeof document.body.style[property] !== "undefined") {
					keyframeProp = "@" + (prefix.length ? "-" + prefix + "-" : "") + "keyframes";
					animProp = property;
					transformProp = prefix.length ? "-" + prefix + "-transform" : "transform";
					return false;
				}
				return true
			});

			var frame = $("#frame"),
				cellWidth = (widthFrame / numColumns).toFixed(1),
				cellHeight = (widthFrame / widthOverHeight / numRows).toFixed(1);

			for(var i = 0; i < numRows; i++) {
				var row = $("<div class='row'></div>");
				row.appendTo(frame);
				for(var j = 0; j < numColumns; j++) {
					var cell = $("<div class='cell'></div>");

					cell.appendTo(row).css({
						width: cellWidth,
						height: cellHeight,
						backgroundPosition: (-j * cellWidth) + "px " + (-i * cellHeight) + "px"
					}).attr("data-row", i).attr("data-column", j);

					$("<div class='indicator'></div>").appendTo(cell).css("transition", "transform " + 1000 / framesPerSecond + "ms linear")

					cells.push({
						frame: 0,
						direction: 1
					});
				}
			}

			var style = document.querySelector("style"),
				rightAnimName = "indicator_right_edge",
				leftAnimName = "indicator_left_edge";

			if(!style) {
				style = document.createElement('style');
				document.head.appendChild(style);
			}

			style.textContent = style.innerHTML +
				keyframeProp + " " + rightAnimName + ' {' +
					'0% { ' +
						transformProp + ": translate3d(" + cellWidth + "px, 0, 0); }" +
					'50% { opacity: 0; ' +
						transformProp + ": translate3d(" + cellWidth + "px, 0, 0); } 51% {" +
						transformProp + ": translate3d(0, 0, 0) } 100% { opacity: 1; " +
						transformProp + ": translate3d(0, 0, 0) } }";

			style.textContent = style.innerHTML +
				keyframeProp + " " + leftAnimName + ' {' +
					'0% { ' + 
						transformProp + ": translate3d(0, 0, 0); } " + 
					'50% { opacity: 0; ' +
						transformProp + ": translate3d(0, 0, 0); } 51% {" +
						transformProp + ": translate3d(" + cellWidth + "px, 0, 0) } 100% { opacity: 1; " +
						transformProp + ": translate3d(" + cellWidth + "px, 0, 0) } }";

			frame.on("click", function(e) {
				var row = +$(e.target).attr('data-row'),
					column = +$(e.target).attr('data-column');
				
				cells[parseInt((row * numColumns) + column)].direction = cells[parseInt((row * numColumns) + column)].direction * -1;
			});

			var rafCounter = 0,
				cycle = function() {
					if(rafCounter % (60 / framesPerSecond) == 0) {
						cells.forEach(function(cell, cellIndex) {
							var cellEl = frame.find(".row:eq(" + Math.floor(cellIndex / numColumns) + ")").find(".cell:eq(" + (cellIndex % numColumns) + ")");

							if(cell.direction == 1) {
								if(cell.frame == 0) {
									cellEl.find(".indicator").css(animProp, rightAnimName + " " + (1000 / framesPerSecond) + "ms").css("transform", "none");
								} else {
									if(cell.frame == 1) {
										cellEl.find(".indicator").css(animProp, "none");
									}
									cellEl.find(".indicator").css("transform", "translate3d(" + (cell.frame * cellWidth / (numFrames - 1)) + "px, 0, 0)")
								}
							} else {
								if(cell.frame == numFrames - 1) {
									cellEl.find(".indicator").css(animProp, leftAnimName + " " + (1000 / framesPerSecond) + "ms").css("transform", "none");
								} else {
									if(cell.frame == numFrames - 2) {
										cellEl.find(".indicator").css(animProp, "none");
									}
									cellEl.find(".indicator").css("transform", "translate3d(" + (cell.frame * cellWidth / (numFrames - 1)) + "px, 0, 0)")
								}
							}

							cellEl.css("background-image", "url(../images/project_fire/" + cell.frame + ".jpg)");

							cell.frame = (cell.frame + cell.direction + numFrames) % numFrames;
						});
					}
					rafCounter++;
					this.rafID = requestAnimationFrame(cycle);
				}.bind(this);

			this.rafID = requestAnimationFrame(cycle);

			window.stop = function() {
				window.cancelAnimationFrame(this.rafID);
			}.bind(this);

		},
		rafID: null,
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
			document.querySelector("style").innerHTML = "";
		}
	}
	return fire;
});