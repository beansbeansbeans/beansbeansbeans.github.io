define(['templates/project_index'], function(projectIndex) {
	var data = [
		{
			title: "oughtness",
			description: "A random melody maker."
		},
		{
			title: "storiesof",
			description: "A random melody maker."
		},
		{
			title: "outloud",
			description: "A random melody maker."
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
			title: "dancers",
			description: "A ballet dancer with morphing frames."
		},
		{
			title: "food",
			description: "Words made of simplifiable paths."
		},
		{
			title: "spinny",
			description: "An interactive photograph."
		},
		{
			title: "spotlights",
			description: "A light-sensitive bouncing ball."
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
			title: "hiveplot",
			description: "A dependency graph visualization."
		}
	];
	var projects = {
		needsLoading: true,
		preloadAssets: [ ],
		mobilePreloadAssets: [ ],
		initialize: function() {
			$("#view").html(projectIndex(data));
		}
	}
	return projects;
});