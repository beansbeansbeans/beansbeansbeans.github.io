define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var dancers = {
		rafID: null,
		intervalID: null,
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

			var maxTension = 1,
				minTension = -0;

			var line = d3.svg.line()
				.interpolate("cardinal");

			var svg = d3.select("#project-dancers .project-contents")
				.append("svg")
					.attr("width", $(window).width())
					.attr("height", 500)
				.append("g");

			var morph = function(element, data, initialTension) {
					var newTension = ((initialTension - 0.01) < minTension ? minTension : initialTension - 0.01);

					element.attr("data-tension", newTension);

					element.selectAll("path")[0].forEach(function(d, i) {
						d3.select(d).attr("d", line.tension(newTension)(data[i]));
					});

					this.rafID = requestAnimationFrame(function() {
						morph(element, data, newTension);
					});
				}.bind(this);

			var animateDancers = function() {
				var delay = 0;

				d3.selectAll(".dancer")[0].forEach(function(d, i) {
					d3.select(d).attr("class", "dancer");

					(function(time) {
						setTimeout(function() {
							d3.select(d).attr("class", "dancer on");
						}, time);
					})(delay);
					delay += 100;
				});
			}

			d3.json("/js/projects/dancers.json", function(data) {
				var self = this;
				data.forEach(function(dancer) {
					var dancerGroup = svg.append("g")
						.attr("class", "dancer");

					dancer.forEach(function(path) {
						dancerGroup.append("path")
							.attr("d", line.tension(maxTension)(path));
					});

					dancerGroup.attr("data-tension", maxTension)
						.on("mouseover", function() {
							var element = d3.select(this),
								initialTension = element.attr("data-tension");

							self.rafID = requestAnimationFrame(function() {
								morph(element, dancer, initialTension);
							});
						})
						.on("mouseout", function() {
							window.cancelAnimationFrame(morphTimeoutID);
						});
				});

				animateDancers();

				this.intervalID = setInterval(animateDancers, 13500);

			}.bind(this));
		},
		destroy: function() {
			clearInterval(this.intervalID);
			window.cancelAnimationFrame(this.rafID);
		}
	};
	return dancers;
})