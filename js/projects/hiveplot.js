define(['templates/project_detail'], function(projectTemplate) {
	var hiveplot = {
		initialize: function() {
			var data = {
				title: "Hiveplot",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque, perspiciatis!",
				projectContents: '<div></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, cumque!",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, veritatis consequatur suscipit labore minima quisquam numquam nemo harum, inventore laboriosam."
			};
			$("#view").html(projectTemplate(data));
		},
		teardown: function() {
			
		}
	}
	return hiveplot;
});