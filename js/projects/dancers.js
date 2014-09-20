define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var dancers = {
		rafID: null,
		initialize: function() {
			var data = {
				identifier: "dancers",
				title: "Dancers",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam explicabo repellat odit natus odio? Quia exercitationem adipisci nemo alias pariatur!",
				projectContents: '',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure, ex!",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem animi esse eligendi iste omnis nisi quidem itaque doloremque distinctio beatae?"
			};

			$("#view").html(projectTemplate(data));

			var maxTension = 2,
				minTension = -2;

			var line = d3.svg.line()
				.interpolate("cardinal");

			var svg = d3.select("#project-dancers .project-contents")
				.append("svg")
					.attr("width", $(window).width())
					.attr("height", 500)
				.append("g");

			var morphTimeoutID = null,
				morph = function(element, data, initialTension) {
					var newTension = ((initialTension - 0.01) < minTension ? minTension : initialTension - 0.01);

					element.attr("d", line.tension(newTension)(data))
						.attr("data-tension", newTension);

					morphTimeoutID = requestAnimationFrame(function() {
						morph(element, data, newTension);
					});
				};

			d3.json("/js/projects/dancers.json", function(data) {
				data.forEach(function(d) {
					svg.append("path")
						.attr("d", line.tension(maxTension)(d))
						.attr("data-tension", maxTension)
						.on("mouseover", function() {
							var element = d3.select(this),
								initialTension = element.attr("data-tension");

							morphTimeoutID = requestAnimationFrame(function() {
								morph(element, d, initialTension);
							});
						})
						.on("mouseout", function() {
							window.cancelAnimationFrame(morphTimeoutID);
						})
				});
			});
		},
		destroy: function() {

		}
	};
	return dancers;
})