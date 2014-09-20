define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var shoes = {
		initialize: function() {
			var data = {
				title: "shoes", 
				length: 77,
				detail: "A productive day",
				date: "September 20, 2013",
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