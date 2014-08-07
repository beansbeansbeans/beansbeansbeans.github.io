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
				rafID = null,
				eventNamespace = ".notes";

			for(i=0; i<13; i++) {
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

				if(counter%3 == 0) {

					dragDuration++;
					currentEl = document.elementFromPoint(mouseX, mouseY);

					$(".key rect").attr("class", "");

					if($(currentEl).is("rect")) {
						$(currentEl).attr("class", "active");
						$(currentEl).parent().prev().find("rect").attr("class", "half-active");
						$(currentEl).parent().next().find("rect").attr("class", "half-active");
	
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

				}
				counter++;
				rafID = requestAnimationFrame(moveDraggable);
			}

			$(".project-contents").width(containerWidth);
			$(".project-contents").height(containerHeight);

			d3.select(".project-contents")
				.append("svg")
				.attr("class", "keyboard")
				.attr("width", containerWidth)
				.attr("height", containerHeight);

			var drawNotes = function() {
				setTimeout(function() {
					$(".keyboard").attr("class", "keyboard");
					$("body").removeClass("refreshing-notes");
				}, 1000);

				d3.select(".project-contents")
					.append("svg")
					.attr("class", "notes")
					.attr("width", containerWidth)
					.attr("height", containerHeight);
			}

			var attachHandlers = function() {

				$keyboard = $(".keyboard");

				$keyboard.on("mousemove" + eventNamespace, function(e) {
					mouseX = e.clientX;
					mouseY = e.clientY;
				});

				$keyboard.on("mouseleave" + eventNamespace, function() {
					$(".key").removeClass("active half-active");
					if(remix.length) {
						refresh();
					}
				});

				$keyboard.on("mousedown" + eventNamespace, function() {
					previousEl = document.elementFromPoint(mouseX, mouseY);
					rafID = requestAnimationFrame(moveDraggable);
				});

				$keyboard.on("mouseup" + eventNamespace, refresh);
			}

			var refresh = function() {
				$("body").addClass("refreshing-notes");

				remix.push({
					note: $(currentEl).attr("data-note"),
					duration: dragDuration
				});

				drawSVG();

				remix = [];

				$(".key rect").attr("class", "");
				window.cancelAnimationFrame(rafID);

				$(".keyboard").attr("class", "keyboard fade");

				setTimeout(function() {
					$keyboard.off(eventNamespace);
					$(".keyboard").remove();
					$(".notes").attr("class", "keyboard bright").find(".note").attr("class", "key");
					$(".key").each(function(i, d) {
						var transformX = $(d).attr("transform"),
							startIdx = transformX.indexOf("("),
							stopIdx = transformX.indexOf(","),

						transformX = +transformX.substring(startIdx + 1, stopIdx);

						$(d).attr("transform", "translate(" + parseInt(transformX + containerWidth, 10) + ", 0)");
						$(d).find("rect").attr("transform", "");
					});
					attachHandlers();
					dragDuration = 0;
					drawNotes();
					drawSVG();
				}, 150);
			}

			var drawKeyboard = function() {
				var widthFactor = calcWidthFactor(keyboard),
					accumulatedTransformX = 0,
					noteGroups = d3.select(".keyboard").selectAll("div")
									.data(keyboard);

				keyboard.forEach(function(d, i) {
					d.transformX = accumulatedTransformX;
					accumulatedTransformX += buffer + d.duration * widthFactor
				});

				noteGroups.enter().append("g")
					.attr("class", "key")
					.attr("transform", function(d) {
						return "translate(" + parseInt(d.transformX, 10) + ", 0)";
					})
					.append("rect")
					.attr("rx", 5)
					.attr("ry", 5)
					.attr("height", containerHeight)
					.attr("fill", function(d) {
						return color(d.note)
					})
					.attr("width", function(d) {
						return d.duration * widthFactor;
					})
					.attr("data-note", function(d) {
						return d.note
					});
			}

			var drawSVG = function() {
				var widthFactor = calcWidthFactor(remix),
					accumulatedTransformX = 0,
					noteGroups = d3.select(".notes").selectAll("g")
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
					.attr("data-note", function(d) {
						return d.note;
					})
					.transition()
					.duration(100)
					.attr("fill-opacity", 1);

				noteGroups
					.exit().remove();
			}

			drawNotes();
			drawKeyboard();
			drawSVG();
			attachHandlers();

		}
	}

	return notes;
});

