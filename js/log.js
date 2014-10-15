define(['templates/log_index'], function(logIndex) {
	var data = [
		{
			title: "donburi",
			description: "October 15, 2014"
		},
		{
			title: "upstairs",
			description: "October 8, 2014"
		},
		{
			title: "oprah",
			description: "October 5, 2014"
		},
		{
			title: "posterboard",
			description: "September 30, 2014"
		},
		// {
		// 	title: "video",
		// 	description: "September 29, 2014"
		// },
		{
			title: "boyhood",
			description: "September 22, 2014"
		},
		// {
		// 	title: "shoes",
		// 	description: "September 20, 2014"
		// },
		{
			title: "anxiety",
			description: "September 12, 2014"
		},
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
		}
	}
	return log;
})
