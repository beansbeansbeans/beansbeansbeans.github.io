define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var quick = {
		initialize: function() {
			var data = {
				title: "jack",
				length: 50,
				detail: "A pretty good day",
				date: "September 4, 2014",
				logContents: ""
			};

			$("#view").html(logTemplate(data));

			logRenderer.initialize(data);
		},
		destroy: function() {
			logRenderer.destroy();
		}
	}
	return quick;
});