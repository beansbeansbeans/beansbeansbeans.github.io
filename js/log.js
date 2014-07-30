define(['templates/log_index'], function(logIndex) {
	var data = [
		{
			title: "mh17",
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
