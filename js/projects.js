define(['templates/project_index'], function(projectIndex) {
	var data = [
		{
			title: "dancers",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet porro, natus excepturi."
		},
		{
			title: "straws",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet porro, natus excepturi."
		},
		{
			title: "notes",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam at dicta a itaque."
		},
		{
			title: "leaves",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem fugit veritatis, aliquid?"
		},
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
		}
	];
	var projects = {
		needsLoading: true,
		preloadAssets: [ "projects_sprite.jpg" ],
		initialize: function() {
			$("#view").html(projectIndex(data));
		}
	}
	return projects;
});