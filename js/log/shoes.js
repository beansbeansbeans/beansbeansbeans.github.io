define(['templates/log_detail', 'log/log_renderer', 'log_data'], function(logTemplate, logRenderer, logData) {
	var shoes = {
		selfLoading: true,
		initialize: function() {
			var title = "shoes",
				data = {
				title: title, 
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

			var indexOfPost = -1;
			for(var i=0; i<logData.length; i++) {
			    if(logData[i].title === title) {
			        indexOfPost = i;
			        break;
			    }
			}

			if(indexOfPost !== 0) {
			    data.previous = logData[indexOfPost - 1].title;
			}
			if(indexOfPost !== (logData.length - 1)) {
			    data.next = logData[indexOfPost + 1].title;
			}

			$("#view").html(logTemplate(data));

			logRenderer.initialize(data);
		},
		destroy: function() {
			logRenderer.destroy();
		}
	};
	return shoes;
});