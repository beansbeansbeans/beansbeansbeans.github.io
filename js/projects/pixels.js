define(['fisheye', 'templates/item'], function(fisheye, item) {
	var data = {
		title: "Hello",
		date: "World"
	}
	var pixels = {
		initialize: function() {
			$("#view").html(item(data));
		},
		teardown: function() {

		}
	}
	return pixels;
});