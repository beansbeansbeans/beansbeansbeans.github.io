define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var lips = {
		initialize: function() {
			var data = {
				identifier: "lips",
				title: "Lips",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum optio voluptates molestias ipsum, labore cum, inventore ab nisi nemo tempore.",
				projectContents: '<button onclick="end()">end</button><button onclick="test()">test</button><div></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate et pariatur minima, quidem, rerum sed.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum ipsam libero consequuntur sint id, quis qui adipisci maxime officia debitis nobis facilis ducimus, quaerat necessitatibus accusantium enim quam rem magni."
			};

			$("#view").html(projectTemplate(data));

			var width = 960,
				height = 500,
				frameDur = 1500,
				svg = d3.select(".project-contents").append("svg")
				.attr("width", width)
				.attr("height", height),
				pathData,
				cachedAttrTweens = [],
				mediator = function() {
					var channels = [];
					return {
						subscribe: function(channel, callback) {
							if(!channels[channel]) {
								channels[channel] = [];
							}

							channels[channel].push(callback);
						},
						publish: function(channel) {
							if(!channels[channel]) {
								channels[channel] = [];
								return false;
							}

							var args = Array.prototype.slice.call(arguments, 1);
							for(var i=0, l=channels[channel].length; i < l; i++) {
								var subscription = channels[channel][i];
								subscription.apply(subscription.context, args);
							}

							channels[channel] = [];
						}
					}
				}();

			d3.json("/js/projects/lips.json", function(data) {
				pathData = data;
				window.pathData = pathData;
				data.forEach(function(path, index) {
					var dVal = path[0].d ? path[0].d : compileRaw(index, 0);

					setActive(index, 0);

					svg.append("path")
						.attr("transform", "translate(0,0)")
						.attr("d", dVal)
						.call(transition, 0, 1, index, (0.5 * frameDur / path.length) + index * frameDur / path.length);
				});
			});

			function setActive(index, frameIndex) {
				pathData[index].forEach(function(frame, index) {
					if(index === frameIndex) {
						frame.active = true;
					} else {
						frame.active = false;
					}
				});
			};

			function compileRaw(index, frame) {
				var d = "M",
					rawArr = pathData[index][frame].raw;

				rawArr.forEach(function(point) {
					if(point.length == 2) {
						d += point[0] + "," + point[1];
					} else {
						d += "c" + point[2] + "," + point[3] + "," + point[4] + "," + point[5] + "," + point[0] + "," + point[1];
					}
				});

				pathData[index][frame].d = d;
				return d;
			}

			function transition(path, startIndex, destIndex, pathIndex, duration) {

				mediator.publish(pathIndex + "_" + destIndex);

				var dVal = pathData[pathIndex][destIndex].d ? pathData[pathIndex][destIndex].d : compileRaw(pathIndex, destIndex);

				setActive(pathIndex, destIndex);

				if(!cachedAttrTweens[pathIndex]) {
					cachedAttrTweens[pathIndex] = [];
				}

				if(!cachedAttrTweens[pathIndex][destIndex]) {
					cachedAttrTweens[pathIndex][destIndex] = pathTween(path[0][0], dVal, 1);
				}

				path.transition()
					.duration(duration)
					.ease("linear")
					.attrTween("d", cachedAttrTweens[pathIndex][destIndex])
					.each("end", function() { d3.select(this).call(transition, destIndex, (destIndex + 1) % pathData[pathIndex].length, pathIndex, frameDur); });
			}

			function pathTween(path, d1, precision) {
				var points;

				return function() {
					var path0 = path,
						path1 = path0.cloneNode(),
						n0 = path0.getTotalLength(),
						n1 = (path1.setAttribute("d", d1), path1).getTotalLength(),

						distances = [0], 
						i = 0, 
						dt = precision / Math.max(n0, n1);

					while ((i += dt) < 1) distances.push(i);
					distances.push(1);

					if(!points) {
						var points = distances.map(function(t) {
							var p0 = path0.getPointAtLength(t * n0),
								p1 = path1.getPointAtLength(t * n1);
							return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
						});
					}

					return function(t) {
						return t < 1 ? "M" + points.map(function(p) { 
							return p(t); 
						}).join("L") : d1;
					};
				};
			}

			function getAbsoluteCoordinate(rawArr) {				
				absRawArr = [];

				rawArr.forEach(function(point, index) {
					if(index === 0) {
						absRawArr.push(point);
					} else {
						absRawArr.push([absRawArr[index - 1][0] + point[0], absRawArr[index - 1][1] + point[1]]);
					}
				});

				return absRawArr;
			}

			function smoothOutControlPoint(index, frame, point, amount) {
				if(point == (pathData[index][frame].raw.length - 1)) {
					point--;
				} else if(point == 0) {
					point++;
				}

				var rawFrame = pathData[index][frame].raw,
					controlPoint = rawFrame[point],
					absoluteFrame = getAbsoluteCoordinate(rawFrame),
					prevDest = [rawFrame[point - 1][0], rawFrame[point - 1][1]],
					absPrevDest = absoluteFrame[point - 1],
					nextDest = [rawFrame[point + 1][0], rawFrame[point + 1][1]],
					absNextDest = absoluteFrame[point + 1],
					slope = (-absNextDest[1] + absPrevDest[1]) / (absNextDest[0] - absPrevDest[0]),
					intercept = -absNextDest[1] - slope * absNextDest[0],
					absNewControlPoint = [];

				absNewControlPoint[0] = absPrevDest[0] + (absNextDest[0] - absPrevDest[0]) / 2;
				absNewControlPoint[1] = -1 * (slope * absNewControlPoint[0] + intercept);

				controlPoint[0] = absNewControlPoint[0] - absPrevDest[0];
				controlPoint[1] = absNewControlPoint[1] - absPrevDest[1];

				rawFrame[point + 1][0] = absNextDest[0] - absNewControlPoint[0];
				rawFrame[point + 1][1] = absNextDest[1] - absNewControlPoint[1];
				
				controlPoint[2] = 0;
				controlPoint[3] = 0;
				controlPoint[4] = 0;
				controlPoint[5] = 0;

				compileRaw(index, frame);
				cachedAttrTweens[index][frame] = false;
				cachedAttrTweens[index][frame + 1] = false;

				mediator.subscribe(index + "_" + frame, function() {
					removeControlPoint(index, point);
				});
			}

			function removeControlPoint(index, pointIndex) {
				pathData[index].forEach(function(frame, frameIndex) {
					var absFrame = getAbsoluteCoordinate(frame.raw);

					absFrame.splice(pointIndex, 1);
					frame.raw.splice(pointIndex, 1);

					frame.raw.forEach(function(point, pointIndex) {
						if(pointIndex > 0) {
							point[0] = absFrame[pointIndex][0] - absFrame[pointIndex - 1][0];
							point[1] = absFrame[pointIndex][1] - absFrame[pointIndex - 1][1];
						}
					});

					compileRaw(index, frameIndex);
					cachedAttrTweens[index][frameIndex] = false;
				});
			}

			window.removeControlPoint = removeControlPoint;

			$("svg").on("click", function(e) {

				var relativeX = e.pageX - $("svg").offset().left,
					relativeY = e.pageY - $("svg").offset().top,
					closest = null;

				pathData.forEach(function(path, pathIndex) {
					path.forEach(function(frame, frameIndex) {
						if(frame.active) {
							frame.raw.forEach(function(point, pointIndex) {
								var x = pointIndex === 0 ? point[0] : frame.raw[0][0] + point[0],
									y = pointIndex === 0 ? point[1] : frame.raw[0][1] + point[1];

								if(closest == null || (Math.abs(x - relativeX) + Math.abs(y - relativeY)) < (Math.abs(closest.point[0] - relativeX) + Math.abs(closest.point[1] - relativeY))) {
									closest = {
										pathIndex: pathIndex,
										frameIndex: frameIndex,
										pointIndex: pointIndex,
										point: [x, y]
									};
								}
							});
						}
					});
				});

				console.log(closest);

				smoothOutControlPoint(closest.pathIndex, (closest.frameIndex + 2) % pathData[closest.pathIndex].length, closest.pointIndex);
			});

			window.end = function() {svg.selectAll("path").transition().each("end", function() {}); }

			window.test = function() {cachedAttrTweens[2][1] = false; }

			window.d3 = d3;

			window.cachedAttrTweens = cachedAttrTweens;
		},
		destroy: function() {

		}
	};

	return lips;
})