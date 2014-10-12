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
				"M100.8,101c34.2-20.8,6,57.1,20,50c25.2-12.7,20.8-85.6,33.9-47.9c3.5,10,20.6,35.2,47.1-8.3c27.4-44.8,33.7-30,56.2,29.1",
				"M88.5,107.9c27.3,8.5,42.7,56.6,48.1,41.9c8.3-22.7,0.4-47.7,19-34.4c8.6,6.1,26.5,1.8,46.2-20.6c34.6-39.4,38.7-27.1,61.2,31.9",
				"M96.8,111.4c27.3,8.5,34.5,53.2,39.8,38.5c8.3-22.7-8.3-71.5,6.3-52c6.3,8.5,41,63.7,63.1,43.7c25.5-23,54.5-102.9,57-14.8",
				"M83.9,121.4c5,2.7,40.6,35.7,46,21c8.3-22.7,15.5-63.6,30.2-44.1c6.3,8.5,21.5,46.5,46,43.3c34.1-4.4,18.7-103.5,57-14.8"
			];

			svg.append("path")
			    .attr("transform", "translate(0,0)scale(2,2)")
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