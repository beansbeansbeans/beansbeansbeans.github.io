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
		rafID: null,
		initialize: function() {
			var data = {
				identifier: "notes",
				title: "Notes",
				blurb: "Color represents frequency and width represents duration. Swipe back and forth to create new melodies.",
				projectContents: '',
				caption: "Built with d3js and CSS transforms.",
				description: "I had an idea for an effect where you would scrub forward and backward along a track of music and then be able to play back your scrubbing exactly as it had happened, allowing you to hear the points where you had lingered on a note or blazed through a section, which might be a cool piece of music in itself. The other half of the effect would be that you could then scrub through the outcome of your original scrubbing, and you could repeat this cycle as many times as you wanted, ending up with an extremely distorted version of the original track. <br/><br/>I ended up implementing the effect with a randomly generated sequence of frequencies (from the Javanese pentatonic scale) rather than a track of music because I thought it would make for a simpler visualization."
			},
			widthScale = d3.scale.linear().domain([320, 2000]).range([0.75, 0.35]),
			bufferScale = d3.scale.linear().domain([300, 1000]).range([4, 12]),
			iconScale = d3.scale.linear().domain([300, 1000]).range([1, 1.5]),
			particleSizeScale = d3.scale.linear().domain([300, 1000]).range([20, 45]),
			particleIncrementScale = d3.scale.linear().domain([300, 1000]).range([14, 38]);

			$("#view").html(projectTemplate(data));
			
			var keyboard = [],
				playTime = 5,
				oscillator,
				context,
				gainNode,
				containerWidth = widthScale($(window).width()) * $(window).width(),
				containerHeight = containerWidth / 3,
				buffer = bufferScale(containerWidth),
				remix = [],
				mouseX,
				mouseY,
				$keyboard,
				counter = 0,
				currentEl,
				previousEl,
				dragDuration = 0,
				eventNamespace = ".notes",
				playIcon = '<svg height="350" version="1.1" width="350" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative;"><path fill="#333333" d="M11.166,23.963C11.166,23.963,22.359,17.5,22.359,17.5C23.789,16.676,23.789,15.325,22.359,14.5C22.359,14.5,11.166,8.037,11.166,8.037C9.737,7.21,8.57,7.89,8.57,9.537C8.57,9.537,8.57,22.463,8.57,22.463C8.568,24.113,9.737,24.789,11.166,23.963C11.166,23.963,11.166,23.963,11.166,23.963" transform="scale(' + (1.18 * iconScale(containerWidth)) + ')"></path></svg>',
				refreshIcon = '<svg height="350" version="1.1" width="350" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative;"><path fill="#333333" d="M19.275,3.849l1.695,8.56l1.875-1.642c2.311,3.59,1.72,8.415-1.584,11.317c-2.24,1.96-5.186,2.57-7.875,1.908l-0.84,3.396c3.75,0.931,7.891,0.066,11.02-2.672c4.768-4.173,5.521-11.219,1.94-16.279l2.028-1.775L19.275,3.849zM8.154,20.232c-2.312-3.589-1.721-8.416,1.582-11.317c2.239-1.959,5.186-2.572,7.875-1.909l0.842-3.398c-3.752-0.93-7.893-0.067-11.022,2.672c-4.765,4.174-5.519,11.223-1.939,16.283l-2.026,1.772l8.26,2.812l-1.693-8.559L8.154,20.232z" transform="scale(' + (iconScale(containerWidth) * 0.9) + ')"></path></svg>',
				helpIcon = '<svg height="350" version="1.1" width="350" xmlns="http://www.w3.org/2000/svg" style="overflow: hidden; position: relative;"><path fill="#333333" d="M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z M17.328,24.371h-2.707v-2.596h2.707V24.371zM17.328,19.003v0.858h-2.707v-1.057c0-3.19,3.63-3.696,3.63-5.963c0-1.034-0.924-1.826-2.134-1.826c-1.254,0-2.354,0.924-2.354,0.924l-1.541-1.915c0,0,1.519-1.584,4.137-1.584c2.487,0,4.796,1.54,4.796,4.136C21.156,16.208,17.328,16.627,17.328,19.003z" transform="scale(' + (iconScale(containerWidth) * 0.8) + ')"></path></svg>';

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
				if(counter%2 == 0) {
					dragDuration++;
					currentEl = document.elementFromPoint(mouseX, mouseY);
					if($(currentEl).attr("data-freq") !== undefined) {
						oscillator.frequency.value = +$(currentEl).attr("data-freq");
					}
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
				this.rafID = requestAnimationFrame(moveDraggable);
			}.bind(this);

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
				$(".project-contents").after('<div class="icons"></div>');
				$('.icons').append('<div class="icon player">' + playIcon + '</div><div class="icon refresh">' + refreshIcon + '</div><div class="icon help">' + helpIcon + '</div>');
				
				context = new AudioContext();
				oscillator = context.createOscillator();
				oscillator.start(0);
				oscillator.type = 0;

				gainNode = context.createGain();
				gainNode.gain.value = 0.2;

				oscillator.connect(gainNode);

				$(".player").on("click", "svg", function() {
					gainNode.connect(context.destination);
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
						gainNode.disconnect(0);
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
				$keyboard.on("mousemove" + eventNamespace + ", touchmove" + eventNamespace, function(e) {
					if(e.clientX) {mouseX = e.clientX;
					} else {mouseX = e.originalEvent.touches[0].clientX;}

					if(e.clientY) {mouseY = e.clientY;
					} else {mouseY = e.originalEvent.touches[0].clientY;
					}
				});
				$keyboard.on("mouseleave" + eventNamespace, function() {
					$(".key").removeClass("active half-active");
					refresh();
				});
				$keyboard.on("mousedown" + eventNamespace + ", touchstart" + eventNamespace, function() {
					gainNode.connect(context.destination);
					previousEl = document.elementFromPoint(mouseX, mouseY);
					this.rafID = requestAnimationFrame(moveDraggable);
					$keyboard.attr("class", "keyboard remixing");
				}.bind(this));
				$keyboard.on("mouseup" + eventNamespace + ", touchend" + eventNamespace, refresh);
				$("body").removeClass("refreshing-notes");
			}.bind(this);

			var refresh = function() {
				if(!remix.length) {return}

				$keyboard.attr("class", "keyboard");
				gainNode.disconnect(0);
				$(".player").text("").append(playIcon);
				$("body").addClass("refreshing-notes");
				if($(currentEl).attr("data-note") !== undefined) {
					remix.push({
						note: $(currentEl).attr("data-note"),
						duration: dragDuration,
						frequency: $(currentEl).attr("data-freq")
					});
				}

				keyboard = remix;
				drawSVG();
				remix = [];
				$(".key rect").attr("class", "");
				window.cancelAnimationFrame(this.rafID);

				$keyboard.off(eventNamespace).remove();
				$(".notes").attr("class", "keyboard").find(".note").attr("class", "key");
				attachHandlers();
				dragDuration = 0;
				drawNotes();
			}.bind(this);

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
					rafID = null,
					increment = Math.round(particleIncrementScale(containerWidth)),
					size = Math.round(particleSizeScale(containerWidth));

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
						left: currentLocation.x,
						width: size,
						height: size
					});

					if(counter > segments[segmentIndex].length) {
						segmentIndex++;
						counter = 0;
					}

					counter += increment;
					rafID = requestAnimationFrame(swipe);
				}
			}

			setUp();
			drawNotes();
			drawKeyboard();
			drawSVG();
			attachHandlers();
			drawInstructional();
		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	}

	return notes;
});

