define(['templates/project_detail', 'lib/d3'], function(projectTemplate, d3) {
	var notes = {
		notesKey: [
			{
				note: "c",
				color: "#BE0000",
				freq: 262
			},
			{
				note: "d",
				color: "#CF2257",
				freq: 294
			},
			{
				note: "f",
				color: "#FD6041",
				freq: 349
			},
			{
				note: "g",
				color: "#FEAA3A",
				freq: 392
			},
			{
				note: "a",
				color: "#EFC94C",
				freq: 440
			},
			{
				note: "c'",
				color: "#45B29D",
				freq: 523
			},
			{
				note: "d'",
				color: "#94B500",
				freq: 587
			},
			{
				note: "f'",
				color: "#2DA4A8",
				freq: 698
			},
			{
				note: "g'",
				color: "#80BDB6",
				freq: 784
			},
			{
				note: "a'",
				color: "#334D5C",
				freq: 880
			},
			{
				note: "c''",
				color: "#435772",
				freq: 1046
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
				playTime = 5,
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
				playIcon = '<svg height="350" version="1.1" width="350" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative;"><path fill="#333333" d="M11.166,23.963C11.166,23.963,22.359,17.5,22.359,17.5C23.789,16.676,23.789,15.325,22.359,14.5C22.359,14.5,11.166,8.037,11.166,8.037C9.737,7.21,8.57,7.89,8.57,9.537C8.57,9.537,8.57,22.463,8.57,22.463C8.568,24.113,9.737,24.789,11.166,23.963C11.166,23.963,11.166,23.963,11.166,23.963" transform="scale(2)"></path></svg>',
				refreshIcon = '<svg height="350" version="1.1" width="350" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative;"><path fill="#333333" d="M19.275,3.849l1.695,8.56l1.875-1.642c2.311,3.59,1.72,8.415-1.584,11.317c-2.24,1.96-5.186,2.57-7.875,1.908l-0.84,3.396c3.75,0.931,7.891,0.066,11.02-2.672c4.768-4.173,5.521-11.219,1.94-16.279l2.028-1.775L19.275,3.849zM8.154,20.232c-2.312-3.589-1.721-8.416,1.582-11.317c2.239-1.959,5.186-2.572,7.875-1.909l0.842-3.398c-3.752-0.93-7.893-0.067-11.022,2.672c-4.765,4.174-5.519,11.223-1.939,16.283l-2.026,1.772l8.26,2.812l-1.693-8.559L8.154,20.232z" transform="scale(1.5)"></path></svg>',
				helpIcon = '<svg height="350" version="1.1" width="350" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative;"><path fill="#333333" d="M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.328,24.371h-2.707v-2.596h2.707V24.371zM17.328,19.003v0.858h-2.707v-1.057c0-3.19,3.63-3.696,3.63-5.963c0-1.034-0.924-1.826-2.134-1.826c-1.254,0-2.354,0.924-2.354,0.924l-1.541-1.915c0,0,1.519-1.584,4.137-1.584c2.487,0,4.796,1.54,4.796,4.136C21.156,16.208,17.328,16.627,17.328,19.003z" transform="scale(1.35)"></path></svg>';

			var calcWidthFactor = function(arr) {
				return (containerWidth - buffer * (arr.length - 1)) / arr.reduce(function(prev, current) {return prev + current.duration;}, 0);
			}

			var color = d3.scale.ordinal()
						.range(this.notesKey.map(function(note) {return note.color}))
						.domain(this.notesKey.map(function(note) {return note.note}));

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
				$(".project-contents").after('<div class="icon help">' + helpIcon + '</div>');
				$(".project-contents").after('<div class="icon refresh">' + refreshIcon + '</div>');
				$(".project-contents").after('<div class="icon player">' + playIcon + '</div>');
				
				context = new webkitAudioContext();
				oscillator = context.createOscillator();
				oscillator.start(0);
				oscillator.type = 0;

				$(".player").on("click", "svg", function() {
					oscillator.connect(context.destination);
					$("body").addClass("refreshing-notes");
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
						oscillator.disconnect(0);
						$("body").removeClass("refreshing-notes");
					}, delay);
				});

				$(".help").on("click", "svg", drawInstructional);

				$(".refresh").on("click", "svg", function() {
					keyboard = [];
					for(i=0; i<15; i++) {
						var randIndex = Math.round(Math.random() * (this.notesKey.length - 1));
						keyboard.push({
							note: this.notesKey[randIndex].note,
							frequency: this.notesKey[randIndex].freq,
							duration: 1
						});
					}
					drawKeyboard();
				}.bind(this));
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
					oscillator.connect(context.destination);
					previousEl = document.elementFromPoint(mouseX, mouseY);
					rafID = requestAnimationFrame(moveDraggable);
				});
				$keyboard.on("mouseup" + eventNamespace, refresh);
				$("body").removeClass("refreshing-notes");
			}

			var refresh = function() {
				if(!remix.length) {return}

				oscillator.disconnect(0);
				$(".player").text("").append(playIcon);
				$("body").addClass("refreshing-notes");
				remix.push({
					note: $(currentEl).attr("data-note"),
					duration: dragDuration,
					frequency: $(currentEl).attr("data-freq")
				});

				keyboard = remix;
				drawSVG();
				remix = [];
				$(".key rect").attr("class", "");
				window.cancelAnimationFrame(rafID);

				$keyboard.off(eventNamespace).remove();
				$(".notes").attr("class", "keyboard").find(".note").attr("class", "key");
				attachHandlers();
				dragDuration = 0;
				drawNotes();
			}

			var drawKeyboard = function() {

				// cheating...
				$(".keyboard").html("");

				var widthFactor = calcWidthFactor(keyboard),
					accumulatedTransformX = 0,
					noteGroups = d3.select(".keyboard").selectAll("div").data(keyboard);

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
					.attr("fill", function(d) {return color(d.note)})
					.attr("width", function(d) {return d.duration * widthFactor})
					.attr("data-note", function(d) {return d.note})
					.attr("data-freq", function(d) {return d.frequency});

				noteGroups.exit().remove();
			}

			var drawSVG = function() {
				var widthFactor = calcWidthFactor(remix),
					accumulatedTransformX = 0,
					noteGroups = d3.select(".notes").selectAll("g").data(remix);

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
					.attr("height", containerHeight);

				noteGroups
					.transition()
					.duration(100)
					.attr("transform", function(d, i) {
						return "translate(" + parseInt(d.transformX, 10) + ", 0)";
					})
					.select("rect")
					.attr("fill", function(d) {return color(d.note)})
					.attr("width", function(d) {return d.duration * widthFactor})
					.attr("data-note", function(d) {return d.note})
					.attr("data-freq", function(d) {return d.frequency})
					.transition()
					.duration(100)
					.attr("fill-opacity", 1);

				noteGroups.exit().remove();
			}

			var drawInstructional = function() {

				$("body").addClass("refreshing-notes");
				$(".keyboard").attr("class", "keyboard dim");

				function getLocationAt(hypoteneuse, segmentObj) {
					return {
						x: Math.round(segmentObj.startPoint[0] + (hypoteneuse * Math.cos(segmentObj.angle))),
						y: Math.round(segmentObj.startPoint[1] + (hypoteneuse * Math.sin(segmentObj.angle)))
					}
				}

				$(".project-contents").append("<div class='canvas'><div class='text'>Create new melodies<br/> by swiping</div></div>");
				$(".canvas").width(containerWidth);
				$(".canvas").height(containerHeight);

				$(".canvas .text").css("margin-top", (containerHeight - $(".canvas .text").height())/2);

				var path = [
						[0.1 * containerWidth, 0.1 * containerHeight],
						[0.8 * containerWidth, 0.15 * containerHeight],
						[0.3 * containerWidth, 0.3 * containerHeight],
						[0.85 * containerWidth, 0.4 * containerHeight],
						[0.5 * containerWidth, 0.6 * containerHeight],
						[0.85 * containerWidth, 0.7 * containerHeight]
					],
					segments = [],
					counter = 0,
					segmentIndex = 0,
					rafID = null;

				setTimeout(function() {
					rafID = requestAnimationFrame(swipe);
				}, 750);

				for(i=0; i<path.length - 1; i++) {
					var angle = Math.atan2(path[i+1][1] - path[i][1], path[i+1][0] - path[i][0])
					segments.push({
						startPoint: path[i],
						endPoint: path[i+1],
						angle: angle,
						length: Math.abs(path[i+1][1] - path[i][1]) / Math.sin(angle)
					});
				}

				function swipe() {
					if(segmentIndex == segments.length) {
						cancelAnimationFrame(rafID);
						setTimeout(function() {
							$("body").removeClass("refreshing-notes");
							$(".keyboard").attr("class", "keyboard");
							$(".canvas").remove();
						}, 750);
						return false;
					}

					var currentLocation = getLocationAt(counter, segments[segmentIndex]);

					$("<div class='particle'></div>").appendTo(".canvas").css({
						top: currentLocation.y,
						left: currentLocation.x
					});

					if(counter > segments[segmentIndex].length) {
						segmentIndex++;
						counter = 0;
					}

					counter += 25;
					rafID = requestAnimationFrame(swipe);
				}
			}

			setUp();
			drawNotes();
			drawKeyboard();
			drawSVG();
			attachHandlers();
			drawInstructional();
		}
	}

	return notes;
});

