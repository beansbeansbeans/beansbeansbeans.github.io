define(['templates/log_index'], function(logIndex) {
	var data = [
		{
			title: "stuff",
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