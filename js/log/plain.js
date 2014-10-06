define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var plain = {
		initialize: function() {
			var data = {
				title: "plain",
				overrides: [
					{
						index: 1,
						width: 1400
					},
					{
						index: 2,
						width: 1600
					},
					{
						index: 3,
						width: 800
					}
				],
				length: 48,
				detail: "A decent day",
				date: "August 2, 2014",
				logContents: ""
			};

			$("#view").html(logTemplate(data));

			logRenderer.initialize(data);
		},
		destroy: function() {
			logRenderer.destroy();
		}
	}
	return plain;
});