define(['templates/project_detail', 'lib/d3'], function(projectTemplate, d3) {
	var notes = {
		initialize: function() {
			var data = {
				identifier: "notes",
				title: "Notes",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex, consequuntur.",
				projectContents: '',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia dignissimos, suscipit at ea repellendus!",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quis maxime laborum laudantium ducimus quidem, sequi alias numquam non ipsa, suscipit?"
			};

			$("#view").html(projectTemplate(data));

			$(".project-contents").append("<div class='notes'></div>");
			
			var notes = [
					{
						note: "f#",
						color: "#BE0000"
					},
					{
						note: "g",
						color: "#CF2257"
					},
					{
						note: "g#",
						color: "#FD6041"
					},
					{
						note: "a",
						color: "#FEAA3A"
					},
					{
						note: "a#",
						color: "#EFC94C"
					},
					{
						note: "b",
						color: "#45B29D"
					},
					{
						note: "c",
						color: "#94B500"
					},
					{
						note: "c#",
						color: "#2DA4A8"
					},
					{
						note: "d",
						color: "#80BDB6"
					},
					{
						note: "d#",
						color: "#334D5C"
					},
					{
						note: "e",
						color: "#435772"
					},
					{
						note: "f",
						color: "#432852"
					}
				],
				buffer = 10,
				containerWidth = 600,
				containerHeight = 200,
				noteWidth = (containerWidth - ((notes.length - 1) * buffer)) / notes.length,
				remix = [];

			$(".project-contents").width(containerWidth);

			notes.forEach(function(d, i) {
				$("<div class='note' data-note='" + d.note + "'></di>").appendTo(".notes").css({
					"background-color": d.color,
					"height": containerHeight,
					"width": noteWidth + "px",
					"margin-right": buffer + "px"
				});
			});

			$(".notes").on("mouseover", ".note", function(e) {
				$(".note").removeClass("active half-active");
				$(e.target).addClass("active");
				$(e.target).prev().addClass("half-active");
				$(e.target).next().addClass("half-active");
			});

			$(".notes").on("mouseleave", function() {
				$(".note").removeClass("active half-active");
			});

			$(".notes").on("click", ".note", function(e) {
				remix.push({
					note: $(e.target).attr("data-note"),
					duration: 1
				});
				drawSVG();
			});

			/*
			BEGIN D3 MVP
			 */
			
			var color = d3.scale.ordinal()
						.range(notes.map(function(note) {
							return note.color
						}))
						.domain(notes.map(function(note) {
							return note.note
						}));

			var remixBuffer = 10;

			d3.select(".project-contents")
				.append("svg")
				.attr("width", containerWidth)
				.attr("height", containerHeight);

			drawSVG = function() {
				var widthFactor = (containerWidth - remixBuffer * (remix.length - 1)) / remix.reduce(function(prev, current) {
						return prev + current.duration;
					}, 0),
					accumulatedTransformX = 0;

				remix.forEach(function(d, i) {
					d.transformX = accumulatedTransformX;
					accumulatedTransformX += remixBuffer + d.duration * widthFactor;
				});

				var noteGroups = d3.select("svg").selectAll("g")
					.data(remix);

				noteGroups.enter().append("g")
					.attr("class", "note")
					.append("rect")
					.attr("rx", 5)
					.attr("ry", 5)
					.attr("fill-opacity", 0)
					.attr("transform", "translate(" + containerWidth + ", 0)")
					.attr("height", containerHeight);

				noteGroups
					.transition()
					.duration(100)
					.attr("transform", function(d, i) {
						return "translate(" + parseInt(d.transformX - containerWidth, 10) + ", 0)";
					})
					.select("rect")
					.attr("fill", function(d) {
						return color(d.note);
					})
					.attr("width", function(d) {
						return d.duration * widthFactor;
					})
					.transition()
					.duration(100)
					.attr("fill-opacity", 1);

				noteGroups
					.exit().remove();
			}

			drawSVG();

		}
	}

	return notes;
});

