define(['templates/log_index'], function(logIndex) {
	var data = [
		{
			title: "jack",
			description: "September 4, 2014"
		},
		{
			title: "bacall",
			description: "August 12, 2014"
		},
		{
			title: "zelda",
			description: "August 11, 2014"
		},
		{
			title: "plain",
			description: "August 2, 2014"
		}
	];
	var log = {
		initialize: function() {
			$("#view").html(logIndex(data));
		},
		teardown: function() {

		}
	}
	return log;
})
