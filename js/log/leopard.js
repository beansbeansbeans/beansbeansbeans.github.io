define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var plain = {
		initialize: function() {
			var data = {
				title: "leopard",
				detail: "A decent day",
				date: "08/15/2014",
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