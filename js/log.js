define(['templates/log_index'], function(logIndex) {
	var data = [
		{
			title: "plain",
			description: "Today I stayed focused for about an hour in the morning. I was distracted for maybe 2 hours while I researched Charles Manson — the Tate murders in particular."
		},
		{
			title: "leopard",
			description: "Today I stayed focused for about an hour in the morning. I was distracted for maybe 2 hours while I researched Charles Manson — the Tate murders in particular."
		},
		{
			title: "quick",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis quos nostrum sapiente alias veniam eaque reiciendis maiores et obcaecati, consectetur."
		},
		{
			title: "starbucks",
			description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis quos nostrum sapiente alias veniam eaque reiciendis maiores et obcaecati, consectetur."
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
