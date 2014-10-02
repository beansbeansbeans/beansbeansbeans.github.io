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

			var manipulating = false,
				pressed = false,
				boundingBoxes = [];

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
				.append("g");

			$("#dancerGroup").on("mousedown", function(e) {
				clearInterval(this.intervalID);
				d3.selectAll(".dancer").attr("class", "dancer");
				manipulating = true;
				pressed = true;
				
				fan(getClosestIndex(e.offsetX), true);

			}.bind(this)).on("mouseup", function(e) {
				pressed = false;
				manipulating = false;
			}).on("mousemove", function(e) {
				if(pressed) {
					fan(getClosestIndex(e.offsetX), false);
				}
			});

			var getClosestIndex = function(offsetX) {
				var closest = null,
					closestFrameIndex;

				boundingBoxes.forEach(function(box, index) {
					var midPoint = box.x + box.width / 2;
					if(closest == null || Math.abs(midPoint - offsetX) < Math.abs(closest - offsetX)) {
						closest = midPoint;
						closestFrameIndex = index;
					}
				});

				return closestFrameIndex;
			}

			var fan = function(start, stagger) {
				var opacity = 1,
					index = 1,
					left = start,
					right = start,
					delay = 0;

				var easeOut = function (t) {
				    var b = 0, c = 300, d = 10;
					t /= d;
					return -c * t*(t-2) + b;
				};

				$(".dancer").css("opacity", 0);

				while(opacity > 0.001) {
					if(stagger) {
						(function(o, i, l, r, d) {
							setTimeout(function() {
								if(l >= 0) {
									$(".dancer:eq(" + l + ")").css("opacity", o);
								}
								if(r < boundingBoxes.length) {
									$(".dancer:eq(" + r + ")").css("opacity", o);
								}
							}, d);
						})(opacity, index, left, right, delay);

						delay = easeOut(index);
					} else {
						if(left >= 0) {
							$(".dancer:eq(" + left + ")").css("opacity", opacity);
						}
						if(right < boundingBoxes.length) {
							$(".dancer:eq(" + right + ")").css("opacity", opacity);
						}
					}

					opacity = Math.pow(0.58, index);
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