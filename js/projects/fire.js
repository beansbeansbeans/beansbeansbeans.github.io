define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var fire = {
		initialize: function() {
			var data = {
				identifier: "fire",
				title: "Fire",
				blurb: "A game.",
				projectContents: '<div></div>',
				caption: "Built with JavaScript",
				description: "This is a game."
			}

			$("#view").html(projectTemplate(data));
		},
		destroy: function() {

		}
	}
	return fire;
});