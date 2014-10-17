define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var lips = {
		initialize: function() {
			var data = {
				identifier: "lips",
				title: "Lips",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum optio voluptates molestias ipsum, labore cum, inventore ab nisi nemo tempore.",
				projectContents: '<button onclick="end()">end</button><div></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate et pariatur minima, quidem, rerum sed.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum ipsam libero consequuntur sint id, quis qui adipisci maxime officia debitis nobis facilis ducimus, quaerat necessitatibus accusantium enim quam rem magni."
			};

			$("#view").html(projectTemplate(data));

			var width = 960,
				height = 500,
				frameDur = 2000,
				svg = d3.select(".project-contents").append("svg")
				.attr("width", width)
				.attr("height", height),
				pathData,
				cachedAttrTweens = [];

			d3.json("/js/projects/lips.json", function(data) {
				pathData = data;
				data.forEach(function(path, index) {
					var dVal = path[0].d ? path[0].d : compileRaw(index, 0);

					setActive(index, 0);

					svg.append("path")
						.attr("transform", "translate(0,0) scale(3, 3)")
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
						points = distances.map(function(t) {
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

			function smoothOutControlPoint(index, frame, amount) {
				// don't forget to call compileRaw() at the end
			}

			$("svg").on("click", function(e) {

				var relativeX = e.pageX - $("svg").offset().left,
					relativeY = e.pageY - $("svg").offset().top,
					closest = null;

				// get the closest point
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
			});

			window.end = function() {
				svg.selectAll("path").transition().each("end", function() {});
			}
			window.d3 = d3;

			window.cachedAttrTweens = cachedAttrTweens;
		},
		destroy: function() {

		}
	};

	return lips;
})