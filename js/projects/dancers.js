define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var dancers = {
		rafID: null,
		timeoutID: null,
		framesTimeoutIDs: [],
		initialize: function() {
			var data = {
				identifier: "dancers",
				title: "Dancers",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam explicabo repellat odit natus odio? Quia exercitationem adipisci nemo alias pariatur!",
				projectContents: '',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure, ex!",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem animi esse eligendi iste omnis nisi quidem itaque doloremque distinctio beatae?"
			};

			$("#view").html(projectTemplate(data));

			var manipulating = false,
				pressed = false,
				boundingBoxes = [],
				maxTension = 1,
				minTension = -0,
				currentFrame = 0,
				danceInterval = 115,
				self = this,
				line = d3.svg.line().interpolate("cardinal"),
				svg = d3.select("#project-dancers .project-contents")
					.append("svg")
						.attr("id", "dancerGroup")
						.attr("width", $(window).width())
						.attr("height", 500)
					.append("g");

			$("#dancerGroup").on("mousedown", function(e) {
				clearTimeout(this.timeoutID);
				this.framesTimeoutIDs.forEach(function(d) {
					window.clearTimeout(d);
				});
				d3.selectAll(".dancer").attr("class", "dancer");
				manipulating = true;
				pressed = true;
				currentFrame = getClosestIndex(e.offsetX);
				
				fan(currentFrame, true);
			}.bind(this)).on("mouseup", function(e) {
				pressed = false;
				manipulating = false;
				$(".dancer").css("opacity", 0);
				animateDancers(currentFrame);
			}.bind(this)).on("mousemove", function(e) {
				if(pressed) {
					currentFrame = getClosestIndex(e.offsetX);
					fan(currentFrame, false);
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
					delay = 0,
					easeOut = function (t) {
					    var b = 0, c = 300, d = 10;
						t /= d;
						return -c * t*(t-2) + b;
					};

				$(".dancer").css("opacity", 0);

				while(opacity > 0.001) {
					if(stagger) {
						(function(o, i, l, r, d) {
							setTimeout(function() {
								$(".dancer:eq(" + l + ")").css("opacity", o);
								$(".dancer:eq(" + r + ")").css("opacity", o);
							}, d);
						})(opacity, index, left, right, delay);

						delay = easeOut(index);
					} else {
						$(".dancer:eq(" + left + ")").css("opacity", opacity);
						$(".dancer:eq(" + right + ")").css("opacity", opacity);
					}

					opacity = Math.pow(0.58, index);
					index++;
					left = (left - 1 < 0) ? 0 : left - 1;
					right = (right + 1 > boundingBoxes.length) ? boundingBoxes.length : right + 1;
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

			var animateDancers = function(startIndex) {
				if(!manipulating) {
					var delay = 0,
						start = startIndex || 0;

					d3.selectAll(".dancer")[0].forEach(function(d, i) {
						d3.select(d).attr("class", "dancer");

						if(i > start) {
							(function(time, element, index) {
								self.framesTimeoutIDs[index] = setTimeout(function() {
									if(!manipulating) {
										d3.select(element).attr("class", "dancer on");
									}
								}, time);
							})(delay, d, i);
							delay += 100;
						}
					});
					
					this.timeoutID = setTimeout(animateDancers, danceInterval * ( boundingBoxes.length - start));
				}
			}.bind(this);

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

			}.bind(this));
		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
			window.clearTimeout(this.timeoutID);
			this.framesTimeoutIDs.forEach(function(d) {
				window.clearTimeout(d);
			});
			this.onPage = false;
		}
	};
	return dancers;
})