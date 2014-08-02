define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var quick = {
		initialize: function() {
			var data = {
				title: "quick",
				detail: "quick brown fox",
				date: "05/27/2014",
				logContents: ""
			};

			$("#view").html(logTemplate(data));

			logRenderer.initialize(data.title);
		},
		destroy: function() {
			logRenderer.destroy();
		}
	}
	return quick;
});