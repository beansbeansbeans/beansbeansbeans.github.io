define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var lips = {
		initialize: function() {
			var data = {
				identifier: "lips",
				title: "Lips",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum optio voluptates molestias ipsum, labore cum, inventore ab nisi nemo tempore.",
				projectContents: '<div></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate et pariatur minima, quidem, rerum sed.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum ipsam libero consequuntur sint id, quis qui adipisci maxime officia debitis nobis facilis ducimus, quaerat necessitatibus accusantium enim quam rem magni."
			};

			$("#view").html(projectTemplate(data));

			var width = 960,
				height = 500;

			var svg = d3.select(".project-contents").append("svg")
				.attr("width", width)
				.attr("height", height);

			var pathData = [
				[
					"M126.8,118.9c2.1-50,5.7-18.7,7.5-3.3c2.7,22.7,7.9,12.5,11.9-1.9c2.9-10.2,22.7,21.4,21.6-2.3c-0.5-11.2,2.3-22.5,8.1,14.2",
					"M126.8,118.9c2.1-50,7.2-32.2,9-16.7c2.7,22.7,11.5,17.9,15.6,3.5c2.9-10.2,18.5,42.1,17.3,18.5c-0.5-11.2,1.3-35.2,7.1,1.5",
					"M126.8,118.9c2.1-50,3.8-13.3,9-16.7c19-12.7,7.5,20,17.3,5.4c5.9-8.8,11.5,31,15.6,16.5c4-14.3,0.9-38.3,7.1,1.5",
					"M126.8,118.9c2.1-50,9.3-0.3,11.9-6c9.6-21,18-14.9,16.5,2.7c-1.3,16.5,9,21.1,8.5,6.2c-0.6-16.4,5.9-36,12.1,3.8"
				],
				[
					"M121.8,117c10.6-22.3,12.7-4.5,17.3-8.7c8.7-7.7,16.6-10.3,16.2,7.3c-0.2,8.3,7.7,10.4,8.5,6.2c2.9-16.1,5.8-25.8,12.3-2.9",
					"M121.8,117c10.6-22.3,9.6-0.3,14.2-4.4c8.7-7.7,7.3-16.2,12.9,1c2.6,7.9,10.6,8.7,11.4,4.4c2.9-16.1,9.6-11.9,15.8,1",
					"M121.8,117c7.1-12.3,8.1-3.1,14.2-4.4c4.4-1,7.1-8.7,12.9,1c4.3,7.1,22.1,44.1,11.4,4.4c-5.9-21.6,9.6-11.9,15.8,1",
					"M119.3,116.2c-0.6-25.8,10.6-4.5,16.7-3.7c12.3,1.7-3.8,14.6,1.9,24.2c4.3,7.1,33.1,20.8,22.3-18.9c-5.9-21.6,9.6-11.9,15.8,1"
				]
			];

			pathData.forEach(function(path, index) {
				svg.append("path")
					.attr("transform", "translate(0,0) scale(2,2)")
					.attr("d", path[0])
					.call(transition, 0, 1, index);
			});

			function transition(path, startIndex, destIndex, pathIndex) {
				path.transition()
					.duration(2000)
					.ease("linear")
					.attrTween("d", pathTween(pathData[pathIndex][destIndex], 1))
					.each("end", function() { d3.select(this).call(transition, destIndex, (destIndex + 1) % pathData[pathIndex].length, pathIndex); });
			}

			function pathTween(d1, precision) {
				return function() {
					var path0 = this,
						path1 = path0.cloneNode(),
						n0 = path0.getTotalLength(),
						n1 = (path1.setAttribute("d", d1), path1).getTotalLength(),

						distances = [0], 
						i = 0, 
						dt = precision / Math.max(n0, n1);

					while ((i += dt) < 1) distances.push(i);
					distances.push(1);

					var points = distances.map(function(t) {
						var p0 = path0.getPointAtLength(t * n0),
							p1 = path1.getPointAtLength(t * n1);
						return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
					});

					return function(t) {
						return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
					};
				};
			}
		},
		destroy: function() {

		}
	};

	return lips;
})