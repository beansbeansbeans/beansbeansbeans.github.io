define(['fisheye', 'templates/project_pixels'], function(fisheye, pixelsTemplate) {
	var data = {
		title: "Hello",
		blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque, perspiciatis!",
		caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, cumque!",
		description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, veritatis consequatur suscipit labore minima quisquam numquam nemo harum, inventore laboriosam."
	}, 
	pixels = {
		initialize: function() {
			$("#view").html(pixelsTemplate(data));
		},
		teardown: function() {

		}
	};
	return pixels;
});