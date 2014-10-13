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
				"M126.8,118.9c2.1-50,5.7-18.7,7.5-3.3c2.7,22.7,7.9,12.5,11.9-1.9c2.9-10.2,22.7,21.4,21.6-2.3c-0.5-11.2,2.3-22.5,8.1,14.2",
				"M126.8,118.9c2.1-50,7.2-32.2,9-16.7c2.7,22.7,11.5,17.9,15.6,3.5c2.9-10.2,18.5,42.1,17.3,18.5c-0.5-11.2,1.3-35.2,7.1,1.5",
				"M126.8,118.9c2.1-50,3.8-13.3,9-16.7c19-12.7,7.5,20,17.3,5.4c5.9-8.8,11.5,31,15.6,16.5c4-14.3,0.9-38.3,7.1,1.5",
				"M126.8,118.9c2.1-50,9.3-0.3,11.9-6c9.6-21,18-14.9,16.5,2.7c-1.3,16.5,9,21.1,8.5,6.2c-0.6-16.4,5.9-36,12.1,3.8"
			];

			svg.append("path")
				.attr("transform", "translate(0,0)scale(2,2)")
				.attr("d", pathData[0])
				.call(transition, 0, 1);

			function transition(path, startIndex, destIndex) {
				path.transition()
				.duration(2000)
				.ease("linear")
				.attrTween("d", pathTween(pathData[destIndex], 1))
				.each("end", function() { d3.select(this).call(transition, destIndex, (destIndex + 1) % pathData.length); });
			}

			function pathTween(d1, precision) {
				return function() {
					var path0 = this,
					path1 = path0.cloneNode(),
					n0 = path0.getTotalLength(),
					n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

					var distances = [0], i = 0, dt = precision / Math.max(n0, n1);
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