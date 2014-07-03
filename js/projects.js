define(['templates/project_index'], function(projectIndex) {
	var data = [
		{
			title: "pixels",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et, perferendis!"
		},
		{
			title: "hiveplot",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non explicabo porro id perferendis, officia alias!"
		},
		{
			title: "spotlights",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium, temporibus!"
		},
		{
			title: "leaves",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem fugit veritatis, aliquid?"
		},
		{
			title: "shadows",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam at dicta a itaque."
		}
	];
	var projects = {
		initialize: function() {
			$("#view").html(projectIndex(data));
		},
		teardown: function() {

		}
	}
	return projects;
});