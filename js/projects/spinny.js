define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var spinny = {
		initialize: function() {
			var data = {
				identifier: "spinny",
				title: "Spinny",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident, voluptatibus.",
				projectContents: '<div id="left_wing"></div><div id="between_wings"></div><div id="right_wing"></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, fugit.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, nobis inventore id sequi non quam mollitia natus eum assumenda placeat."
			},
			windowWidth = $(window).width(),
			adjustedWindowWidth = windowWidth < 2000 ? windowWidth : 2000,
			widthScale = d3.scale.linear().domain([320, 2000]).range([1.0, 0.5]).clamp(true),
			paneHeightRatio = 0.54,
			paneWidth = Math.round(widthScale(windowWidth) * adjustedWindowWidth);

			$("#view").html(projectTemplate(data));

			var mainPane = $("#between_wings"),
				leftPane = $("#left_wing"),
				rightPane = $("#right_wing");

			$("#left_wing, #between_wings, #right_wing").each(function(idx, el) {
				$(el).css({
					width: paneWidth,
					height: Math.round(paneWidth * paneHeightRatio)
				});
			});

			leftPane.css("margin-left", -(paneWidth - (adjustedWindowWidth * 0.5 - paneWidth * 0.5)));


		},
		destroy: function() {

		}
	};
	return spinny;
});