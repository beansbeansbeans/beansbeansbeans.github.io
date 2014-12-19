define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var plain = {
		selfLoading: true,
		initialize: function() {
			var data = {
				title: "zelda",
				overrides: [
					{
						index: 0,
						width: 1450
					},
					{
						index: 2,
						width: 1230
					}
				],
				length: 61,
				detail: "A decent day",
				date: "August 11, 2014",
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