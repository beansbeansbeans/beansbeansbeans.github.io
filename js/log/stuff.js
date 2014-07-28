define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var stuff = {
		initialize: function() {
			var data = {
				title: "stuff",
				logContents: ""
			};

			$("#view").html(logTemplate(data));

			logRenderer.initialize(data.title);

		},
		destroy: function() {
			logRenderer.destroy();
		}
	}
	return stuff;
});
