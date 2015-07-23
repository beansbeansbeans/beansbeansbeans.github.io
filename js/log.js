define(['templates/log_index', 'log_data'], function(logIndex, logData) {
	var log = {
		initialize: function() {
			$("#view").html(logIndex(logData));
		}
	}
	return log;
})
