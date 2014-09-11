define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var plain = {
		initialize: function() {
			var data = {
				title: "plain",
				detail: "A decent day",
				date: "August 2, 2014",
				logContents: ""
			};

			$("#view").html(logTemplate(data));

			logRenderer.initialize(data.title);
		},
		destroy: function() {
			logRenderer.destroy();
		}
	}
	return plain;
});