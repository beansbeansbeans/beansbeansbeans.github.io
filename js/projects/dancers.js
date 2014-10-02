define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var dancers = {
		rafID: null,
		intervalID: null,
		initialize: function() {
			var data = {
				identifier: "dancers",
				title: "Dancers",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam explicabo repellat odit natus odio? Quia exercitationem adipisci nemo alias pariatur!",
				projectContents: '',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure, ex!",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem animi esse eligendi iste omnis nisi quidem itaque doloremque distinctio beatae?"
			};

			var manipulating = false;

			var boundingBoxes = [];

			$("#view").html(projectTemplate(data));

			var maxTension = 1,
				minTension = -0;

			var line = d3.svg.line()
				.interpolate("cardinal");

			var svg = d3.select("#project-dancers .project-contents")
				.append("svg")
					.attr("id", "dancerGroup")
					.attr("width", $(window).width())
					.attr("height", 500)
				.append("g")
					.on("mouseup", function() {
						console.log("mouse up");
						// this.intervalID = setInterval(animateDancers, 13500);
						// manipulating = false;
					});

			$("#dancerGroup").on("click", function(e) {
				var closest = null,
					closestFrameIndex,
					goal = e.offsetX;

				boundingBoxes.forEach(function(box, index) {
					var midPoint = box.x + box.width / 2;
					if(closest == null || Math.abs(midPoint - goal) < Math.abs(closest - goal)) {
						closest = midPoint;
						closestFrameIndex = index;
					}
				});

				clearInterval(this.intervalID);

				d3.selectAll(".dancer").attr("class", "dancer");
				manipulating = true;
				fan(closestFrameIndex);
			}.bind(this));

			var fan = function(start) {
				var opacity = 1,
					index = 1,
					left = start,
					right = start;

				while(opacity > 0.05) {
					(function(o, i, l, r) {
						setTimeout(function() {
							$(".dancer:eq(" + l + ")").css("opacity", o);
							$(".dancer:eq(" + r + ")").css("opacity", o);
						}, 50 * i);
					})(opacity, index, left, right);

					opacity = Math.pow(0.55, index);

					index++;
					left--;
					right++;
				}
			};

			var morph = function(element, data, initialTension) {
				var newTension = ((initialTension - 0.01) < minTension ? minTension : initialTension - 0.01);

				element.attr("data-tension", newTension);

				element.selectAll("path")[0].forEach(function(d, i) {
					d3.select(d).attr("d", line.tension(newTension)(data[i]));
				});

				this.rafID = requestAnimationFrame(function() {
					morph(element, data, newTension);
				});
			}.bind(this);

			var animateDancers = function() {
				var delay = 0;

				d3.selectAll(".dancer")[0].forEach(function(d, i) {
					d3.select(d).attr("class", "dancer");

					(function(time) {
						setTimeout(function() {
							if(!manipulating) {
								d3.select(d).attr("class", "dancer on");
							}
						}, time);
					})(delay);
					delay += 100;
				});
			}

			window.boxes = boundingBoxes;

			d3.json("/js/projects/dancers.json", function(data) {
				var self = this;
				data.forEach(function(dancer) {
					var dancerGroup = svg.append("g")
						.attr("class", "dancer");

					dancer.forEach(function(path) {
						dancerGroup.append("path")
							.attr("d", line.tension(maxTension)(path));
					});

					boundingBoxes.push({
						x: dancerGroup.node().getBBox().x,
						width: dancerGroup.node().getBBox().width
					});

					dancerGroup.attr("data-tension", maxTension)
						.on("mouseover", function() {
							var element = d3.select(this),
								initialTension = element.attr("data-tension");

							self.rafID = requestAnimationFrame(function() {
								morph(element, dancer, initialTension);
							});
						})
						.on("mouseout", function() {
							window.cancelAnimationFrame(self.rafID);
						});
				});

				d3.select("#dancerGroup").attr("width", boundingBoxes[boundingBoxes.length - 1].x + boundingBoxes[boundingBoxes.length - 1].width + 75);

				animateDancers();

				this.intervalID = setInterval(animateDancers, 13500);

			}.bind(this));
		},
		destroy: function() {
			clearInterval(this.intervalID);
			window.cancelAnimationFrame(this.rafID);
		}
	};
	return dancers;
})