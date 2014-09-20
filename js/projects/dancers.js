define(['templates/project_detail'], function(projectTemplate) {
	var dancers = {
		rafID: null,
		initialize: function() {
			var data = {
				identifier: "dancers",
				title: "Dancers",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam explicabo repellat odit natus odio? Quia exercitationem adipisci nemo alias pariatur!",
				projectContents: '<div></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure, ex!",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem animi esse eligendi iste omnis nisi quidem itaque doloremque distinctio beatae?"
			};

			$("#view").html(projectTemplate(data));
		},
		destroy: function() {

		}
	};
	return dancers;
})