define(['lib/d3', 'templates/project_detail', 'project_data'], function(d3, projectTemplate, projectData) {
	var dancers = {
		rafID: null,
		timeoutID: null,
		framesTimeoutIDs: [],
		initialize: function() {
			var data = {
				identifier: "dancers",
				title: "Dancers",
				blurb: "Drag slowly along the dancer's path to warp her figure.",
				projectContents: '',
				caption: "Built with d3js and scalable vector graphics.",
				description: "The longer you linger over the frames while dragging, the thicker, slacker, and bluer they become. I tried to cap the distortion at a point where the dancer was still nice looking."
			};

			var indexOfProject = -1;
			for(var i=0; i<projectData.length; i++) {
			    if(projectData[i].title === data.identifier) {
			        indexOfProject = i;
			        break;
			    }
			}

			if(indexOfProject !== 0) {
			    data.previous = projectData[indexOfProject - 1].title;
			} else {
			  data.previousActive = "false";
			}
			if(indexOfProject !== (projectData.length - 1)) {
			    data.next = projectData[indexOfProject + 1].title;
			} else {
			  data.nextActive = "false";
			}

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
				widthScale = d3.scale.linear().domain([320, 2000]).range([1, 0.5]),
				svgWidth = ($(window).width() > 2000) ? 1000 : widthScale($(window).width()) * $(window).width(),
				viewBoxWidth;
				svg = d3.select("#project-dancers .project-contents")
					.append("svg")
						.attr("id", "dancerGroup")
						.attr("width", svgWidth)
						.attr("height", svgWidth / 2)
					.append("g");

			$(".project-contents").css({
				width: svgWidth,
				height: svgWidth / 2
			});

			$("#dancerGroup").on("mousedown touchstart", function(e) {
				clearTimeout(this.timeoutID);
				this.framesTimeoutIDs.forEach(function(d) {
					window.clearTimeout(d);
				});
				d3.selectAll(".dancer").attr("class", "dancer");
				manipulating = true;
				pressed = true;
				currentFrame = getClosestIndex(getXVal(e));
				fan(currentFrame);
				this.rafID = requestAnimationFrame(morph);
			}.bind(this)).on("mouseup touchend", function(e) {
				window.cancelAnimationFrame(self.rafID);
				pressed = false;
				manipulating = false;
				$(".dancer").css("opacity", 0);
				animateDancers(currentFrame);
			}.bind(this)).on("mousemove touchmove", function(e) {
				if(pressed) {
					currentFrame = getClosestIndex(getXVal(e));
					fan(currentFrame);
				}
			});

			var getXVal = function(e) {
				var factor = viewBoxWidth / svgWidth;
				if(e.originalEvent.targetTouches) {
					return e.originalEvent.targetTouches[0].pageX * factor;
				} else {
					return e.offsetX * factor;
				}
			};

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

			var tensionScale = d3.scale.pow().exponent(.6).domain([0, 10]).range([maxTension, minTension]),
				colorScale = d3.scale.pow().exponent(.6).domain([0, 10]).interpolate(d3.interpolateRgb).range(['#7096ad', '#000000']),
				strokeScale = d3.scale.pow().exponent(.6).domain([0, 10]).range([2, 7]);

			var update = function() {
				var dancer = svg.selectAll(".dancer").data(progressData)
					.attr("data-test", function(d, i) {
						if(d3.select(this).attr("data-opacity") > 0) {
							d3.select(this).selectAll("path")[0].forEach(function(path, index) {
								d3.select(path).attr("d", d < 10 ? line.tension(tensionScale(d))(pathData[i][index]) : line.tension(tensionScale(10))(pathData[i][index])).style("stroke", d < 10 ? colorScale(d) : colorScale(10)).style("stroke-width", d < 20 ? strokeScale(d) : strokeScale(20));
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

				viewBoxWidth = parseInt(boundingBoxes[boundingBoxes.length - 1].x + boundingBoxes[boundingBoxes.length - 1].width + 75, 10);

				d3.select("#dancerGroup").attr("viewBox", "0 0 " + viewBoxWidth + " 500");

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