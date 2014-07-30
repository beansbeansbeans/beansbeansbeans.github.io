define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var mh17 = {
		initialize: function() {
			var data = {
				title: "mh17",
				detail: "About a plane",
				date: "05/28/2014",
				logContents: ""
			};

			$("#view").html(logTemplate(data));

			logRenderer.initialize(data.title);

		},
		destroy: function() {
			logRenderer.destroy();
		}
	}
	return mh17;
});
