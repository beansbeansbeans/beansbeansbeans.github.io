define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var dancers = {
		rafID: null,
		timeoutID: null,
		framesTimeoutIDs: [],
		initialize: function() {
			var data = {
				identifier: "dancers",
				title: "Dancers",
				blurb: "This is an animation of a ballet dancer demonstrating a grand allegro. Drag along the dancer's path to warp her figure.",
				projectContents: '',
				caption: "Built with d3js and scalable vector graphics.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem animi esse eligendi iste omnis nisi quidem itaque doloremque distinctio beatae?"
			};

			$("#view").html(projectTemplate(data));

			var manipulating = false,
				pressed = false,
				pathData,
				boundingBoxes = [],
				progressData = [],
				maxTension = 1,
				minTension = -0,
				currentFrame = 0,
				previousFrame,
				morphCount = 0,
				rafCount = 0,
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
				fan(currentFrame);
				this.rafID = requestAnimationFrame(morph);
			}.bind(this)).on("mouseup", function(e) {
				window.cancelAnimationFrame(self.rafID);
				pressed = false;
				manipulating = false;
				$(".dancer").css("opacity", 0);
				animateDancers(currentFrame);
			}.bind(this)).on("mousemove", function(e) {
				if(pressed) {
					currentFrame = getClosestIndex(e.offsetX);
					fan(currentFrame);
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

			var fan = function(start) {
				var opacity = 1,
					index = 1,
					left = start,
					right = start,
					easeOut = function (t) {
					    var b = 0, c = 300, d = 10;
						t /= d;
						return -c * t*(t-2) + b;
					};

				$(".dancer").css("opacity", 0).attr("data-opacity", 0);

				while(opacity > 0.001) {
					$(".dancer:eq(" + left + ")").css("opacity", opacity).attr("data-opacity", opacity);
					$(".dancer:eq(" + right + ")").css("opacity", opacity).attr("data-opacity", opacity);

					left = (left - 1 < 0) ? 0 : left - 1;
					right = (right + 1 > boundingBoxes.length) ? boundingBoxes.length : right + 1;
					opacity = Math.pow(0.58, index);
					index++;
				}
			};

			var morph = function() {	
				if(Math.floor(rafCount) % 25 === 0) {
					if(previousFrame !== currentFrame) {
						morphCount = 0;
					} else {
						morphCount++;
					}

					progressData[currentFrame] = progressData[currentFrame] + 1;

					for(i=1; i<morphCount; i++) {
						progressData[currentFrame] = progressData[currentFrame] + 1;
						for(j=i; j>0; j--) {
							if(currentFrame - j > 0) {
								progressData[currentFrame - j] = progressData[currentFrame - j] + 1;
							}
							progressData[currentFrame + j] = progressData[currentFrame + j] + 1;
						}
					}

					update();
				}

				previousFrame = currentFrame;
				rafCount++;
				this.rafID = requestAnimationFrame(morph);
			}.bind(this);

			window.progress = progressData;

			var tensionScale = d3.scale.linear().domain([0, 200]).range([maxTension, minTension]),
				colorScale = d3.scale.linear().domain([0, 200]).interpolate(d3.interpolateRgb).range(['#7096ad', '#00303e']),
				strokeScale = d3.scale.linear().domain([0, 400]).range([2, 5]);

			var update = function() {
				var dancer = svg.selectAll(".dancer").data(progress)
					.attr("data-test", function(d, i) {
						if(d3.select(this).attr("data-opacity") > 0) {
							d3.select(this).selectAll("path")[0].forEach(function(path, index) {
								d3.select(path).attr("d", d < 200 ? line.tension(tensionScale(d))(pathData[i][index]) : line.tension(tensionScale(200))(pathData[i][index])).style("stroke", d < 200 ? colorScale(d) : colorScale(200)).style("stroke-width", d < 400 ? strokeScale(d) : strokeScale(400));
							});
						}
					});
			};

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
				pathData = data;
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

					progressData.push(0);
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