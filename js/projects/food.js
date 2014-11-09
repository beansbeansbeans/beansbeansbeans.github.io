define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var food = {
		timers: [],
		initialize: function() {
			var data = {
				identifier: "food",
				title: "Food",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum optio voluptates molestias ipsum, labore cum, inventore ab nisi nemo tempore.",
				projectContents: '<div id="hidden-svg-container"><svg id="hidden-subpaths"></svg></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate et pariatur minima, quidem, rerum sed.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum ipsam libero consequuntur sint id, quis qui adipisci maxime officia debitis nobis facilis ducimus, quaerat necessitatibus accusantium enim quam rem magni."
			};

			$("#view").html(projectTemplate(data));

			var self = this,
				width = 960,
				height = 500,
				frameDur = 1500,
				popDur = 1000,
				popLetters = {
					"p": "M715 471q14 -55 -5 -109.5t-62.5 -102.5t-105.5 -85.5t-133.5 -60.5t-146.5 -27.5t-144 15.5q-9 -13 -15 -25.5t-12 -25.5q-13 -31 -32 -43t-39 -7.5t-37.5 24.5t-27.5 52q-11 32 -8.5 86t18.5 115t46 120.5t75 101.5q49 46 112.5 73t130 37.5t131.5 5.5t118.5 -23.5 t90 -49t46.5 -71.5zM170 190q13 -7 40 -8.5t59.5 2.5t66.5 12.5t61 20.5t42.5 27t11.5 32q-3 11 -21 17t-45 5.5t-59.5 -7.5t-62.5 -20t-55 -33.5t-38 -47.5z",
					"o": "M817 451q17 -69 -4 -133t-68.5 -118t-115.5 -96.5t-144 -68t-154 -33t-145.5 8t-119 56t-74.5 111.5q-28 85 -10 154.5t66 122t120 88.5t153 54.5t163 19t151.5 -17.5t118.5 -55t63 -93zM270 136q9 -19 36 -25t62 -1.5t73 18t69.5 33t51 43t17.5 49.5q-3 30 -30.5 41 t-66 7t-81 -20t-76 -39t-51 -51t-4.5 -55z"
				},
				svg = d3.select(".project-contents").append("svg")
					.attr("id", "food-svg-container")
					.attr("width", width)
					.attr("height", height),
				pathData,
				cachedAttrTweens = [],
				animProp,
				keyframeProp,
				popGap = 200,
				isKeyframing = [];

			['', 'webkit', 'moz'].every(function(prefix) {
				var property = prefix.length ? prefix + "Animation" : "animation";

				if(typeof document.body.style[property] !== "undefined") {
					keyframeProp = "@" + (prefix.length ? "-" + prefix + "-" : "") + "keyframes";
					animProp = property;
					return false;
				}
				return true
			});

			$("#pop-svg-container svg, #hidden-svg-container svg").attr("width", width).attr("height", height);

			d3.json("/js/projects/food.json", function(data) {
				pathData = data.letters;
				data.letters.forEach(function(path, index) {
					path.forEach(function(frame, frameIndex) {
						pathData[index][frameIndex].absolute = getAbsoluteCoordinate(pathData[index][frameIndex].raw);
					});

					var dVal = compileRaw(index, 0),
						absoluteFrame = path[0].absolute,
						delay = (0.5 * frameDur / path.length) + index * frameDur / path.length;

					delay = 0;

					setActive(index, 0);
					isKeyframing[index] = false;

					svg.append("path")
						.attr("transform", "translate(0,0)")
						.attr("d", dVal)
						.call(transition, 0, 1, index, delay);

					absoluteFrame.forEach(function(point, pointIndex) {
						if(pointIndex !== 0 && pointIndex !== absoluteFrame.length - 1) {
							var g = svg.append("g").attr("class", "controlPoint")
								.attr("data-path", index)
								.attr("data-index", pointIndex)
								.attr("transform", "translate(" + point[0] + "," + point[1] + ")");

							var cloud = g.append("g").attr("class", "cloud");
							cloud.append("circle").attr("r", 15);
							cloud.append("path").attr("class", "spoke")
								.attr("d", "M2.3,9.6c-4.5-2.1-1.7-7.3,3.2-7.2");
							cloud.append("path").attr("class", "spoke")
								.attr("d", "M2,9.5c-1.3,5.2,3,5.4,5.1,4.9");
							cloud.append("path").attr("class", "spoke")
								.attr("d", "M5.4,3.4c1.1-5.7,7.8-3,7.1-0.5");
							cloud.append("path").attr("class", "spoke")
								.attr("d", "M6.9,14.1c0.6,4.7,8.6,0.4,5.9-3.4");
							cloud.append("path").attr("class", "spoke")
								.attr("d", "M11.4,10.2c6,0.5,5.1-8.1,1.2-6.9");

							var word = g.append("g").attr("class", "word");
							word.append("path").attr("class", "glyph").attr("d", popLetters.p);
							word.append("path").attr("class", "glyph").attr("d", popLetters.o);
							word.append("path").attr("class", "glyph").attr("d", popLetters.p);

							g.call(popTransition, 0, 1, index, delay);
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

			function popTransition(group, startIndex, destIndex, pathIndex, duration) {
				var absoluteFrame = pathData[pathIndex][destIndex].absolute,
					pointIndex = group.attr("data-index");

				if(pointIndex && absoluteFrame[pointIndex]) {
					group.transition()
						.duration(duration)
						.ease("linear")
						.attr("transform", "translate(" + absoluteFrame[pointIndex][0] + "," + absoluteFrame[pointIndex][1] + ")")
						.each("end", function() {
							d3.select(this).call(popTransition, destIndex, (destIndex + 1) % pathData[pathIndex].length, pathIndex, frameDur);
						});
				}
			}

			function transition(path, startIndex, destIndex, pathIndex, duration) {
				var dVal = pathData[pathIndex][destIndex].d ? pathData[pathIndex][destIndex].d : compileRaw(pathIndex, destIndex);

				setActive(pathIndex, destIndex);

				if(!cachedAttrTweens[pathIndex]) {cachedAttrTweens[pathIndex] = [];}

				pathData[pathIndex][destIndex].compiled++;

				if(!cachedAttrTweens[pathIndex][destIndex] || pathData[pathIndex][destIndex].compiled < 3) {
					cachedAttrTweens[pathIndex][destIndex] = pathTween(path[0][0], dVal, 8, pathIndex, startIndex);
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

			function smoothOutControlPoint(index, frame, point, currentControlCoord) {
				var rawFrame = pathData[index][frame].raw,
					controlPoint = rawFrame[point],
					absoluteFrame = pathData[index][frame].absolute,
					prevDest = [rawFrame[point - 1][0], rawFrame[point - 1][1]],
					absPrevDest = absoluteFrame[point - 1],
					nextDest = [rawFrame[point + 1][0], rawFrame[point + 1][1]],
					absNextDest = absoluteFrame[point + 1],
					slope = (-absNextDest[1] + absPrevDest[1]) / (absNextDest[0] - absPrevDest[0]),
					intercept = -absNextDest[1] - slope * absNextDest[0],
					absNewControlPoint = [],
					closest = null;

				var subPathData,
					totalPathData = $("#food-svg-container > path:eq(" + index + ")").attr("d").split("L").map(function(rawPoint) {
					return rawPoint.split(",");
				});

				totalPathData.forEach(function(coordinate, coordinateIndex) {
					if(coordinateIndex > 0) {
						var x = +coordinate[0],
							y = +coordinate[1];

						if(closest == null || (Math.abs(x - currentControlCoord[0]) + Math.abs(y - currentControlCoord[1])) < (Math.abs(closest[0] - currentControlCoord[0]) + Math.abs(closest[1] - currentControlCoord[1]))) {
							closest = [x, y];
							subPathData = totalPathData.slice().splice(0, coordinateIndex);
						}
					}
				})

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

				removeControlPoint(index, point);
			}

			function initPop(index, pointIndex) {
				var el = $("[data-path='" + index + "'][data-index='" + pointIndex + "']"),
					currentClass = el.attr("class");
				el.attr("class", currentClass + " burst").attr("data-path", "").attr("data-index", "");

				var timerID = setTimeout(function() {
					el.remove();
				}, popDur);

				self.timers.push(timerID);
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
 				if((distance - popGap / 2) < 0) {
 					distance = (popGap / 2);
 				}

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

				$("#food-svg-container > path:eq(" + index + ")")[0].style[animProp] = animName + ' ' + frameDur + 'ms forwards';

				var timerID = setTimeout(function() {
					$("#food-svg-container path:eq(" + index + ")")[0].style[animProp] = "";
					isKeyframing[index] = false;
				}, frameDur);

				self.timers.push(timerID);
			}

			$("#food-svg-container").on("click", function(e) {

				var relativeX = e.pageX - $("#food-svg-container").offset().left,
					relativeY = e.pageY - $("#food-svg-container").offset().top,
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

					var transformData = $("[data-path='" + closest.pathIndex + "'][data-index='" + closest.pointIndex + "']").attr("transform"),
						currentControlX = transformData.split(",")[0].slice(10),
						currentControlY = transformData.split(",")[1].substring(0, transformData.split(",")[1].length - 1);

					initPop(closest.pathIndex, closest.pointIndex);
					smoothOutControlPoint(closest.pathIndex, closest.frameIndex, closest.pointIndex, [currentControlX, currentControlY]);
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

	return food;
})