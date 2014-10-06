define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var shoes = {
		initialize: function() {
			var data = {
				title: "shoes", 
				length: 77,
				overrides: [
					{
						index: 3,
						width: 1300
					}
				],
				detail: "A productive day",
				date: "September 20, 2014",
				logContents: ""
			};

			$("#view").html(logTemplate(data));

			logRenderer.initialize(data);
		},
		destroy: function() {
			logRenderer.destroy();
		}
	};
	return shoes;
});