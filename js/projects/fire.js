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
			framesPerSecond = 2,
			cells = [];

			$("#view").html(projectTemplate(data));

			var frame = $("#frame"),
				cellWidth = (widthFrame / numColumns).toFixed(1),
				cellHeight = (widthFrame / widthOverHeight / numRows).toFixed(1);

			for(var i = 0; i < numRows; i++) {
				var row = $("<div class='row'></div>");
				row.appendTo(frame);
				for(var j = 0; j < numColumns; j++) {
					$("<div class='cell'></div>").appendTo(row).css({
						width: cellWidth,
						height: cellHeight,
						backgroundPosition: (-j * cellWidth) + "px " + (-i * cellHeight) + "px"
					}).attr("data-row", i).attr("data-column", j);

					cells.push({
						frame: 0,
						direction: 1
					});
				}
			}

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
		}
	}
	return fire;
});