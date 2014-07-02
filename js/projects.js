define(['templates/project_index'], function(projectIndex) {
	var data = [
		{
			title: "pixels",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et, perferendis!"
		},
		{
			title: "hiveplot",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non explicabo porro id perferendis, officia alias!"
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