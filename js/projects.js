define(['templates/project_index', 'project_data'], function(projectIndex, projectData) {
	var data = projectData;
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