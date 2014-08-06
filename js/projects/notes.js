define(['templates/project_detail', 'lib/d3'], function(projectTemplate, d3) {
	var notes = {
		notesKey: [
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
			
			var keyboard = [],
				buffer = 10,
				containerWidth = 600,
				containerHeight = 200,
				remix = [],
				mouseX,
				mouseY,
				$keyboard,
				counter = 0,
				currentEl,
				previousEl,
				dragDuration = 0,
				rafID = null;

			for(i=0; i<12; i++) {
				keyboard.push({
					note: this.notesKey[Math.round(Math.random() * (this.notesKey.length - 1))].note,
					duration: 1
				});
			}

			var calcWidthFactor = function(arr) {
				return (containerWidth - buffer * (arr.length - 1)) / arr.reduce(function(prev, current) {
					return prev + current.duration;
				}, 0);
			}

			var color = d3.scale.ordinal()
						.range(this.notesKey.map(function(note) {
							return note.color
						}))
						.domain(this.notesKey.map(function(note) {
							return note.note
						}));

			var moveDraggable = function() {
				if(counter%5 == 0) {

					dragDuration++;
					currentEl = document.elementFromPoint(mouseX, mouseY);

					if(currentEl !== previousEl) {
						remix.push({
							note: $(previousEl).attr("data-note"),
							duration: dragDuration
						});

						drawSVG();

						previousEl = currentEl;
						dragDuration = 0;
					}
				}
				counter++;
				rafID = requestAnimationFrame(moveDraggable);
			}

			$(".project-contents").width(containerWidth);

			d3.select(".project-contents")
				.append("div")
				.attr("class", "keyboard")
				.style("height", containerHeight);

			d3.select(".project-contents")
				.append("svg")
				.attr("width", containerWidth)
				.attr("height", containerHeight);

			$keyboard = $(".keyboard");

			$keyboard.on("mouseover", ".key", function(e) {
				$(".key").removeClass("active half-active");
				$(e.target).addClass("active");
				$(e.target).prev().addClass("half-active");
				$(e.target).next().addClass("half-active");
			});

			$keyboard.on("mousemove", function(e) {
				mouseX = e.clientX;
				mouseY = e.clientY;
			})

			$keyboard.on("mouseleave", function() {
				$(".key").removeClass("active half-active");
			});

			$keyboard.on("mousedown", function() {
				previousEl = document.elementFromPoint(mouseX, mouseY);
				rafID = requestAnimationFrame(moveDraggable);
			});

			$keyboard.on("mouseup", function() {
				window.cancelAnimationFrame(rafID);
			});

			var drawKeyboard = function() {
				var widthFactor = calcWidthFactor(keyboard),
					noteGroups = d3.select(".keyboard").selectAll("div")
									.data(keyboard);

				noteGroups.enter().append("div")
						.attr("class", "key")
						.style("background-color", function(d) {
							return color(d.note)
						})
						.style("width", function(d) {
							return d.duration * widthFactor;
						})
						.style("margin-right", buffer)
						.attr("data-note", function(d) {
							return d.note
						});
			}

			var drawSVG = function() {
				var widthFactor = calcWidthFactor(remix),
					accumulatedTransformX = 0,
					noteGroups = d3.select("svg").selectAll("g")
						.data(remix);

				remix.forEach(function(d, i) {
					d.transformX = accumulatedTransformX;
					accumulatedTransformX += buffer + d.duration * widthFactor;
				});

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

			drawKeyboard();
			drawSVG();

		}
	}

	return notes;
});

