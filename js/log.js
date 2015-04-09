define(['templates/log_index'], function(logIndex) {
	var data = [
		{
			title: "easter",
			description: "April 8, 2015"
		},
		{
			title: "birthday",
			description: "March 27, 2015"
		},
		{
			title: "cruising",
			description: "March 22, 2015"
		},
		{
			title: "pushpop",
			description: "February 20, 2015"
		},
		{
			title: "running",
			description: "January 12, 2015"
		},
		{
			title: "pops",
			description: "December 15, 2014"
		},
		{
			title: "yeye",
			description: "December 10, 2014"
		},
		{
			title: "toast",
			description: "December 8, 2014"
		},
		{
			title: "christmas",
			description: "December 5, 2014"
		},
		{
			title: "tetris",
			description: "November 30, 2014"
		},
		{
			title: "starbucks",
			description: "November 27, 2014"
		},
		{
			title: "cara",
			description: "November 17, 2014"
		},
		{
			title: "miranda",
			description: "November 9, 2014"
		},
		{
			title: "mutinous",
			description: "November 5, 2014"
		},
		{
			title: "danimal",
			description: "October 27, 2014"
		},
		{
			title: "halloween",
			description: "October 22, 2014"
		},
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
		{
			title: "video",
			description: "September 29, 2014"
		},
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
