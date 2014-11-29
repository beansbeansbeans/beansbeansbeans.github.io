// OPTIMIZATIONS: Consider bundling drag handler into rAF callback!

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
			spinState = {
				pressed: false,
				reference: undefined,
				velocity: undefined,
				amplitude: undefined,
				frame: undefined,
				offset: 0,
				timestamp: undefined,
				ticker: undefined,
				target: undefined,
				timeConstant: 125,
				rafID: undefined
			},
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
				window.cancelAnimationFrame(spinState.rafID);
			}.bind(this);

			var scroll = function(x) {
				spinState.offset = x;
				globe.css("background-position", ((x % globeConfig.length) * globeConfig.width) + "px");
			}

			var autoScroll = function() {
				var elapsed,
					delta;

				if(spinState.amplitude) {
					elapsed = Date.now() - spinState.timestamp;
					delta = spinState.amplitude * Math.exp(-elapsed / spinState.timeConstant);
					if(delta > 2 || delta < -2) {
						scroll(Math.round(spinState.target - delta));
						spinState.rafID = requestAnimationFrame(autoScroll);
					}
				}
			}

			var track = function() {
				var now,
					elapsed,
					delta,
					v;

				now = Date.now();
				elapsed = now - spinState.timestamp;
				spinState.timestamp = now;
				delta = spinState.offset - spinState.frame;
				spinState.frame = spinState.offset;

				v = 1000 * delta / (1 + elapsed);
				spinState.velocity = 0.8 * v + 0.2 * spinState.velocity;
			}

			var xpos = function(e) {
		        if (e.targetTouches && (e.targetTouches.length >= 1)) {
		            return e.targetTouches[0].clientX;
		        }

		        return e.clientX;
		    }

			var tap = function(e) {
				spinState.pressed = true;
				spinState.reference = xpos(e);

				spinState.velocity = spinState.amplitude = 0;
				spinState.frame = spinState.offset;
				spinState.timestamp = Date.now();
				clearInterval(spinState.ticker);
				spinState.ticker = setInterval(track, 100);

				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			var drag = function(e) {
				var x,
					delta;

				if(spinState.pressed) {
					x = xpos(e);
					delta = spinState.reference - x;
					if(delta > 2 || delta < -2) {
						spinState.reference = x;
						scroll(spinState.offset + delta);
					}
				}

				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			var release = function(e) {
				spinState.pressed = false;

				clearInterval(spinState.ticker);
				spinState.target = spinState.offset;
				if(spinState.velocity > 2 || spinState.velocity < -2) {
					spinState.amplitude = 0.7 * spinState.velocity;
					spinState.target = spinState.offset + spinState.amplitude;
				}
				spinState.amplitude = spinState.target - spinState.offset;
				spinState.rafID = requestAnimationFrame(autoScroll);

				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			if (typeof window.ontouchstart !== 'undefined') {
	            window.addEventListener('touchstart', tap);
	            window.addEventListener('touchmove', drag);
	            window.addEventListener('touchend', release);
	        }
	        window.addEventListener('mousedown', tap);
	        window.addEventListener('mousemove', drag);
	        window.addEventListener('mouseup', release);
		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	};
	return spinny;
});