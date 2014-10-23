define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var lips = {
		timers: [],
		initialize: function() {
			var data = {
				identifier: "lips",
				title: "Lips",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum optio voluptates molestias ipsum, labore cum, inventore ab nisi nemo tempore.",
				projectContents: '<button onclick="end()">end</button><button onclick="test()">test</button><div id="hidden-svg-container"><svg id="hidden-subpaths"></svg></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate et pariatur minima, quidem, rerum sed.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum ipsam libero consequuntur sint id, quis qui adipisci maxime officia debitis nobis facilis ducimus, quaerat necessitatibus accusantium enim quam rem magni."
			};

			$("#view").html(projectTemplate(data));

			var self = this,
				width = 960,
				height = 500,
				frameDur = 1500,
				svg = d3.select(".project-contents").append("svg")
					.attr("id", "lips-svg-container")
					.attr("width", width)
					.attr("height", height),
				pathData,
				cachedAttrTweens = [],
				animProp,
				keyframeProp,
				popGap = 200,
				isKeyframing = [],
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

			['', 'webkit', 'moz'].every(function(prefix) {
				var property = prefix.length ? prefix + "Animation" : "animation";

				if(typeof document.body.style[property] !== "undefined") {
					keyframeProp = "@" + (prefix.length ? "-" + prefix + "-" : "") + "keyframes";
					animProp = property;
					return false;
				}
				return true
			});

			$("#pop-svg-container svg").attr("width", width).attr("height", height);

			d3.json("/js/projects/lips.json", function(data) {
				pathData = data;
				data.forEach(function(path, index) {
					path.forEach(function(frame, frameIndex) {
						pathData[index][frameIndex].absolute = getAbsoluteCoordinate(pathData[index][frameIndex].raw);
					});

					var dVal = compileRaw(index, 0),
						absoluteFrame = path[0].absolute,
						delay = (0.5 * frameDur / path.length) + index * frameDur / path.length;

					setActive(index, 0);
					isKeyframing[index] = false;

					svg.append("path")
						.attr("transform", "translate(0,0)")
						.attr("d", dVal)
						.call(transition, 0, 1, index, delay);

					absoluteFrame.forEach(function(point, pointIndex) {
						if(pointIndex !== 0 && pointIndex !== absoluteFrame.length - 1) {
							svg.append("circle")
								.attr("data-path", index)
								.attr("data-index", pointIndex)
								.attr("cx", point[0])
								.attr("cy", point[1])
								.attr("r", 15)
								.style("fill", "#ffffff")
								.style("stroke", "red")
								.style("stroke-width", 8)
								.call(popTransition, 0, 1, index, delay);
						}
					});
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
				var rawArr = pathData[index][frame].raw;
				pathData[index][frame].d = generatePathString(rawArr);
				pathData[index][frame].compiled = 0;
				return generatePathString(rawArr);
			}

			function generatePathString(rawArr) {
				var d = "M";

				rawArr.forEach(function(point) {
					if(point.length == 2) {
						d += point[0] + "," + point[1];
					} else {
						d += "c" + point[2] + "," + point[3] + "," + point[4] + "," + point[5] + "," + point[0] + "," + point[1];
					}
				});

				return d;
			}

			function popTransition(circle, startIndex, destIndex, pathIndex, duration) {
				var absoluteFrame = pathData[pathIndex][destIndex].absolute,
					pointIndex = circle.attr("data-index");

				circle.transition()
					.duration(duration)
					.ease("linear")
					.attr("cx", absoluteFrame[pointIndex][0])
					.attr("cy", absoluteFrame[pointIndex][1])
					.each("end", function() {
						d3.select(this).call(popTransition, destIndex, (destIndex + 1) % pathData[pathIndex].length, pathIndex, frameDur);
					});
			}

			function transition(path, startIndex, destIndex, pathIndex, duration) {
				mediator.publish(pathIndex + "_" + destIndex);

				var dVal = pathData[pathIndex][destIndex].d ? pathData[pathIndex][destIndex].d : compileRaw(pathIndex, destIndex);

				setActive(pathIndex, destIndex);

				if(!cachedAttrTweens[pathIndex]) {cachedAttrTweens[pathIndex] = [];}

				pathData[pathIndex][destIndex].compiled++;

				if(!cachedAttrTweens[pathIndex][destIndex] || pathData[pathIndex][destIndex].compiled < 3) {
					cachedAttrTweens[pathIndex][destIndex] = pathTween(path[0][0], dVal, 4, pathIndex, startIndex);
				}

				path.transition()
					.duration(duration)
					.ease("linear")
					.attrTween("d", cachedAttrTweens[pathIndex][destIndex])
					.each("end", function() { d3.select(this).call(transition, destIndex, (destIndex + 1) % pathData[pathIndex].length, pathIndex, frameDur); });
			}

			function pathTween(path, d1, precision, pathIndex, startIndex) {
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
						points = distances.map(function(t, index) {
							var p0 = path0.getPointAtLength(t * n0),
								p1 = path1.getPointAtLength(t * n1);

							return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
						});
					}

					return function(t) {
						return t < 1 ? "M" + points.map(function(p, pointIndex) { 
							var point = p(t);

							return [point[0].toFixed(1), point[1].toFixed(1)]; 
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
				var rawFrame = pathData[index][frame].raw,
					controlPoint = rawFrame[point],
					absoluteFrame = pathData[index][frame].absolute,
					prevDest = [rawFrame[point - 1][0], rawFrame[point - 1][1]],
					absPrevDest = absoluteFrame[point - 1],
					nextDest = [rawFrame[point + 1][0], rawFrame[point + 1][1]],
					absNextDest = absoluteFrame[point + 1],
					slope = (-absNextDest[1] + absPrevDest[1]) / (absNextDest[0] - absPrevDest[0]),
					intercept = -absNextDest[1] - slope * absNextDest[0],
					absNewControlPoint = [];

				var subPathData,
					currentControlX = $("[data-path='" + index + "'][data-index='" + point + "']").attr("cx"),
					totalPathData = $("#lips-svg-container path:eq(" + index + ")").attr("d").split("L").map(function(rawPoint) {
					return rawPoint.split(",");
				});

				totalPathData.every(function(coordinate, coordinateIndex) {
					if(coordinateIndex > 0) {
						if(+coordinate[0] < currentControlX) {
							return true;
						} else {
							subPathData = totalPathData.slice().splice(0, coordinateIndex);
							return false;
						}
					} else {return true;}
				});

				subPathData = subPathData.map(function(coordinate, coordinateIndex) {
					if(coordinateIndex > 0) {
						return "L" + coordinate.join(",");
					} else {
						return coordinate.join(",");
					}
				}).join("");

				$("<path d='" + subPathData + "' />").appendTo("#hidden-subpaths");

				$("#hidden-svg-container").html($("#hidden-svg-container").html());
				generateSnapKeyframes($("#hidden-svg-container path")[0].getTotalLength(), index);
				$("#hidden-svg-container svg").html("");

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

			function initPop(index, pointIndex) {
				$("[data-path='" + index + "'][data-index='" + pointIndex + "']").remove();
			}

			function removeControlPoint(index, pointIndex) {
				$("[data-path='" + index + "']").each(function(i, d) {
					var index = $(d).attr("data-index")
					if(index > pointIndex) {
						$(d).attr("data-index", index - 1);
					}
				});

				pathData[index].forEach(function(frame, frameIndex) {
					var absFrame = frame.absolute;

					absFrame.splice(pointIndex, 1);
					frame.raw.splice(pointIndex, 1);

					frame.raw.forEach(function(point, pointIndex) {
						if(pointIndex > 0) {
							point[0] = absFrame[pointIndex][0] - absFrame[pointIndex - 1][0];
							point[1] = absFrame[pointIndex][1] - absFrame[pointIndex - 1][1];
						}
					});

					compileRaw(index, frameIndex);
					frame.absolute = getAbsoluteCoordinate(pathData[index][frameIndex].raw);
				});

				cachedAttrTweens[index] = false;
			}

			function generateSnapKeyframes(distance, index) {
 				distance = Math.round(distance);

 				var style = document.querySelector("style"),
 					animName = 'snap_' + Date.now();

 				if(!style) {
 					style = document.createElement('style');
 					document.head.appendChild(style);
 				}

				style.textContent = style.innerHTML + 
					keyframeProp + " " + animName + ' {' +
						'0% { ' +
							'stroke-dasharray: ' + distance + ' 0 10000;' +
						'}' +
						'25% {' +
							'stroke-dasharray: ' + parseInt(distance - popGap/2, 10) + ' ' + popGap + ' 10000;' +
						'}' +
						'100% {' +
							'stroke-dasharray: ' + distance + ' 0 10000;' +
						'}' +
					'}';

				$("#lips-svg-container path:eq(" + index + ")")[0].style[animProp] = animName + ' ' + frameDur * 2 + 'ms forwards';

				var timerID = setTimeout(function() {
					$("#lips-svg-container path:eq(" + index + ")")[0].style[animProp] = "";
					isKeyframing[index] = false;
				}, frameDur * 2);

				self.timers.push(timerID);
			}

			$("#lips-svg-container").on("click", function(e) {

				var relativeX = e.pageX - $("#lips-svg-container").offset().left,
					relativeY = e.pageY - $("#lips-svg-container").offset().top,
					closest = null;

				pathData.forEach(function(path, pathIndex) {
					if(!isKeyframing[pathIndex]) {
						path.forEach(function(frame, frameIndex) {
							if(frame.active && frame.raw.length > 2) {
								var absFrame = frame.absolute;
								frame.raw.forEach(function(point, pointIndex) {
									var x = absFrame[pointIndex][0],
										y = absFrame[pointIndex][1];

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
					}
				});

				if(closest) {
					if(closest.pointIndex == (pathData[closest.pathIndex][closest.frameIndex].raw.length - 1)) {
						closest.pointIndex--;
					} else if(closest.pointIndex == 0) {
						closest.pointIndex++;
					}

					smoothOutControlPoint(closest.pathIndex, closest.frameIndex, closest.pointIndex);
					initPop(closest.pathIndex, closest.pointIndex);
					isKeyframing[closest.pathIndex] = true;
				}
			});

			window.end = function() {svg.selectAll("path").transition().each("end", function() {}); }

			window.d3 = d3;
		},
		destroy: function() {
			this.timers.forEach(function(id) {
				clearTimeout(id);
			});
		}
	};

	return lips;
})