define(['templates/project_index'], function(projectIndex) {
	var data = [
		{
			title: "food",
			description: "Words made of simplifiable paths."
		},
		{
			title: "dancers",
			description: "A ballet dancer with morphing frames."
		},
		{
			title: "notes",
			description: "A random melody maker."
		},
		{
			title: "pixels",
			description: "A face made of warpable pixels."
		},
		{
			title: "straws",
			description: "Straws resting inside an unstable glass."
		},
		{
			title: "leaves",
			description: "Leaves floating on top of sliding panes."
		},
		{
			title: "spotlights",
			description: "A light-sensitive bouncing ball."
		},
		{
			title: "hiveplot",
			description: "A dependency graph visualization."
		}
	];
	var projects = {
		needsLoading: true,
		preloadAssets: [ "projects_sprite.jpg" ],
		mobilePreloadAssets: [ "projects_sprite_mobile.jpg" ],
		initialize: function() {
			$("#view").html(projectIndex(data));
		}
	}
	return projects;
});