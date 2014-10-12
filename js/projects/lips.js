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
				"M0,0c100,0 0,100 100,100c100,0 0,-100 100,-100",
				"M0,50c100,0 0,-100 100,-100c100,0 0,100 100,100",
				"M50,50c100,0 0,-100 100,-100c100,0 0,100 100,100"
			];

			svg.append("path")
			    .attr("transform", "translate(180,300)scale(2,2)")
			    .attr("d", pathData[0])
			    .call(transition, 0, 1);

			function transition(path, startIndex, destIndex) {
			  path.transition()
			      .duration(2000)
			      .ease("linear")
			      .attr("d", pathData[destIndex])
			      .each("end", function() { d3.select(this).call(transition, destIndex, (destIndex + 1) % pathData.length); });
			}
		},
		destroy: function() {

		}
	};

	return lips;
})