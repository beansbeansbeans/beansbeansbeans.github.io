define(['templates/project_detail', 'lib/d3'], function(projectTemplate, d3) {
	var notes = {
		notesKey: [
			{
				note: "f#",
				color: "#BE0000",
				freq: 370
			},
			{
				note: "g",
				color: "#CF2257",
				freq: 392
			},
			{
				note: "g#",
				color: "#FD6041",
				freq: 415
			},
			{
				note: "a",
				color: "#FEAA3A",
				freq: 440
			},
			{
				note: "a#",
				color: "#EFC94C",
				freq: 466
			},
			{
				note: "b",
				color: "#45B29D",
				freq: 494
			},
			{
				note: "c",
				color: "#94B500",
				freq: 523
			},
			{
				note: "c#",
				color: "#2DA4A8",
				freq: 554
			},
			{
				note: "d",
				color: "#80BDB6",
				freq: 587
			},
			{
				note: "d#",
				color: "#334D5C",
				freq: 622
			},
			{
				note: "e",
				color: "#435772",
				freq: 659
			},
			{
				note: "f",
				color: "#432852",
				freq: 698
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
				buffer = 8,
				playTime = 6,
				oscillator,
				context,
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
				eventNamespace = ".notes",
				playIcon = '<svg height="350" version="1.1" width="350" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative;"><path fill="#333333" d="M11.166,23.963C11.166,23.963,22.359,17.5,22.359,17.5C23.789,16.676,23.789,15.325,22.359,14.5C22.359,14.5,11.166,8.037,11.166,8.037C9.737,7.21,8.57,7.89,8.57,9.537C8.57,9.537,8.57,22.463,8.57,22.463C8.568,24.113,9.737,24.789,11.166,23.963C11.166,23.963,11.166,23.963,11.166,23.963" transform="scale(2)"></path></svg>';

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

				if(![].every.call(d3.selectAll(".note")[0], function(d, i) {
					return $(d).find("rect").attr("width") > 3;
				})) {
					$(".key rect").attr("class", "");
					return false;
				}

				if(counter%3 == 0) {

					dragDuration++;
					currentEl = document.elementFromPoint(mouseX, mouseY);
					oscillator.frequency.value = $(currentEl).attr("data-freq");

					if($(currentEl).is("rect")) {
						
						$(".key rect").attr("class", "");
						$(currentEl).attr("class", "active");
						$(currentEl).parent().prev().find("rect").attr("class", "half-active");
						$(currentEl).parent().next().find("rect").attr("class", "half-active");
	
						$(".player").text($(currentEl).attr("data-note"));

						if(currentEl !== previousEl) {
							if($(previousEl).attr("data-note") !== undefined) {
								remix.push({
									note: $(previousEl).attr("data-note"),
									frequency: $(previousEl).attr("data-freq"),
									duration: dragDuration
								});
							}

							drawSVG();

							previousEl = currentEl;
							dragDuration = 0;
						}
					}

				}

				counter++;
				rafID = requestAnimationFrame(moveDraggable);
			}

			var setUp = function() {
				$(".project-contents").width(containerWidth);
				$(".project-contents").height(containerHeight);

				$("body").addClass("refreshing-notes");

				for(i=0; i<15; i++) {
					var randIndex = Math.round(Math.random() * (this.notesKey.length - 1));
					keyboard.push({
						note: this.notesKey[randIndex].note,
						frequency: this.notesKey[randIndex].freq,
						duration: 1
					});
				}

				d3.select(".project-contents")
					.append("svg")
					.attr("class", "keyboard")
					.attr("width", containerWidth)
					.attr("height", containerHeight);

				$(".project-contents").after('<div class="player">' + playIcon + '</div>');

				$(".player").on("click", "svg", function() {
					$("body").addClass("refreshing-notes");
					context = new webkitAudioContext();
					oscillator = context.createOscillator();
					oscillator.connect(context.destination);
					oscillator.start(0);
					oscillator.type = 0;
					var delay = 0,
						totalDuration = keyboard.reduce(function(prev, current) {
							return prev + current.duration;
						}, 0),
						durFactor = playTime / totalDuration;

					for(i=0; i<keyboard.length; i++) {
						(function(index) {
							setTimeout(function() {
								$(".player").text(keyboard[index].note);
								$($keyboard.find(".key")).find("rect").attr("class", "key");
								$($keyboard.find(".key").get(index * 2)).find("rect").attr("class", "active");
								oscillator.frequency.value = keyboard[index].frequency;
							}, delay);
							delay += keyboard[index].duration * durFactor * 1000;
						})(i);
					}

					setTimeout(function() {
						$($keyboard.find(".key")).find("rect").attr("class", "key");
						$(".player").text("").append(playIcon);
						oscillator.stop();
						$("body").removeClass("refreshing-notes");
					}, delay);
				});

			}.bind(this);

			var drawNotes = function() {
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
					refresh();
				});

				$keyboard.on("mousedown" + eventNamespace, function() {
					context = new webkitAudioContext();
					oscillator = context.createOscillator();
					oscillator.connect(context.destination);
					oscillator.start(0);
					oscillator.type = 0;

					previousEl = document.elementFromPoint(mouseX, mouseY);
					rafID = requestAnimationFrame(moveDraggable);
				});

				$keyboard.on("mouseup" + eventNamespace, refresh);

				$("body").removeClass("refreshing-notes");
			}

			var refresh = function() {
				if(!remix.length) {
					return;
				}

				oscillator.stop();
				$(".player").text("").append(playIcon);

				$("body").addClass("refreshing-notes");

				remix.push({
					note: $(currentEl).attr("data-note"),
					duration: dragDuration
				});

				keyboard = remix;

				drawSVG();

				remix = [];

				$(".key rect").attr("class", "");
				window.cancelAnimationFrame(rafID);

				$(".keyboard").attr("class", "keyboard fade");

				setTimeout(function() {
					$keyboard.off(eventNamespace);
					$(".keyboard").remove();
					$(".notes").attr("class", "keyboard").find(".note").attr("class", "key");
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
						return d.note;
					})
					.attr("data-freq", function(d) {
						return d.frequency;
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
					.attr("data-freq", function(d) {
						return d.frequency;
					})
					.transition()
					.duration(100)
					.attr("fill-opacity", 1);

				noteGroups
					.exit().remove();
			}

			setUp();
			drawNotes();
			drawKeyboard();
			drawSVG();
			attachHandlers();

		}
	}

	return notes;
});

