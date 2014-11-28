define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var spinny = {
		initialize: function() {
			var data = {
				identifier: "spinny",
				title: "Spinny",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident, voluptatibus.",
				projectContents: '<div id="left_wing"></div><div id="between_wings"><div id="spinny_globe"></div></div><div id="right_wing"></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi, fugit.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad, nobis inventore id sequi non quam mollitia natus eum assumenda placeat."
			},
			nativePaneWidth = 1000,
			windowWidth = $(window).width(),
			adjustedWindowWidth = windowWidth < 2000 ? windowWidth : 2000,
			widthScale = d3.scale.linear().domain([320, 2000]).range([1.0, 0.5]).clamp(true),
			paneHeightRatio = 0.54,
			paneWidth = Math.round(widthScale(windowWidth) * adjustedWindowWidth),
			globeConfig = {
				length: 24,
				width: 256,
				heightRatio: 1.55,
				left: 0.66,
				top: 0.25
			},
			animatables = [
				{
					id: "phone",
					length: 17,
					currentFrame: 0,
					width: 39,
					heightRatio: 1.87,
					left: 0.3,
					top: 0.3
				},
				{
					id: "candle",
					length: 10,
					currentFrame: 0,
					width: 49,
					heightRatio: 1.38,
					left: 0.5,
					top: 0.7
				}
			],
			counter = 0;

			$("#view").html(projectTemplate(data));

			var mainPane = $("#between_wings"),
				leftPane = $("#left_wing"),
				rightPane = $("#right_wing"),
				globe = $("#spinny_globe");

			globe.css({
				backgroundImage: "url(../images/project_spinny/globe_sprite.jpg)",
				width: 100 * (globeConfig.width / nativePaneWidth) + "%",
				height: 100 * ((globeConfig.width * globeConfig.heightRatio) / (nativePaneWidth * paneHeightRatio)) + "%",
				top: (globeConfig.top * 100) + "%",
				left: (globeConfig.left * 100) + "%"
			});

			animatables.forEach(function(animatable) {
				$("<div data-animatable=" + animatable.id + "></div>").appendTo(mainPane).css({
					position: "absolute",
					left: (animatable.left * 100) + "%",
					top: (animatable.top * 100) + "%",
					backgroundImage: "url(../images/project_spinny/" + animatable.id + "_sprite.jpg)",
					width: 100 * (animatable.width / nativePaneWidth) + "%",
					height: 100 * ((animatable.width * animatable.heightRatio) / (nativePaneWidth * paneHeightRatio)) + "%"
				});
			});

			$("#left_wing, #between_wings, #right_wing").each(function(idx, el) {
				$(el).css({
					width: paneWidth,
					height: Math.round(paneWidth * paneHeightRatio)
				});
			});

			leftPane.css("margin-left", -(paneWidth - (adjustedWindowWidth * 0.5 - paneWidth * 0.5)) + 0.5 * (windowWidth - adjustedWindowWidth));

			var animate = function() {
				if(counter % 60 == 0) {
					animatables.forEach(function(animatable) {
						$("[data-animatable=" + animatable.id + "]").css("background-position", (animatable.currentFrame * (100 / animatable.length)) + "%");

						animatable.currentFrame = (animatable.currentFrame + 1) % animatable.length;
					});
				}

				counter++;
				this.rafID = requestAnimationFrame(animate);
			}.bind(this);

			this.rafID = requestAnimationFrame(animate);

			window.stop = function() {
				window.cancelAnimationFrame(this.rafID);
			}.bind(this);
		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	};
	return spinny;
});