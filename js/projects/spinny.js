define(['templates/project_detail'], function(projectTemplate) {
	var spinny = {
		initialize: function() {
			var data = {
				identifier: "spinny",
				title: "Spinny",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident, voluptatibus.",
				projectContents: '<div></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, fugit.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, nobis inventore id sequi non quam mollitia natus eum assumenda placeat."
			};

			$("#view").html(projectTemplate(data));
		},
		destroy: function() {

		}
	};
	return spinny;
});