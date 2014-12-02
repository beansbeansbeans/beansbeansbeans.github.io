// the problem here is if the user drags their mouse out of the photo, release is not called

define(['lib/d3', 'templates/project_detail'], function(d3, projectTemplate) {
	var spinny = {
		needsLoading: true,
		preloadAssets: [
			"project_spinny/globe_sprite.jpg",
			"project_spinny/globe_mask.png"
		],
		mobilePreloadAssets: [
			"project_spinny/globe_sprite_mobile.jpg",
			"project_spinny/globe_mask_mobile.png"
		],
		initialize: function() {
			var data = {
				identifier: "spinny",
				title: "Spinny",
				blurb: "Spin the globe.",
				projectContents: '<div id="triptych"><div id="spinny_globe"></div><div id="phone_mask"></div><div id="globe_mask"></div><div id="instructional"><div class="cta">spin</div><svg id="svg_left"><path d="M69.4,71.9C-38.3,10.3,0.1-10.2,46.3,4.6"/></svg><svg id="svg_right"><path d="M91.2,0c42.3,34.6,58.3,96.2-84.1,16.2c-18.8-10.5,5.8,19.9,5.8,25.6S-0.3,16.7,4.5,13c2.6-1.9,16,0,26.3,0"/></svg></div></div>',
				caption: "Built with JavaScript.",
				description: "I wanted to make an interactive photorealistic scene. In this scene the globe is interactive - the user can spin it by dragging over it. I thought the presence of other animated elements (the candle and the phone) would enhance the scene by making the user feel like they were interacting with a video."
			},
			nativePaneWidth = 850,
			windowWidth = $(window).width(),
			adjustedWindowWidth = windowWidth < 2000 ? windowWidth : 2000,
			widthScale = d3.scale.linear().domain([320, 2000]).range([1.0, 0.4]).clamp(true),
			paneHeightRatio = 0.563,
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
				rafID: undefined,
				counter: 0
			},
			globeConfig = {
				length: 61,
				width: 0.36,
				heightRatio: 1,
				left: 0.5182,
				top: 0.044
			},
			animatables = [
				{
					id: "candle",
					length: 35,
					currentFrame: 0,
					width: 0.02333,
					heightRatio: 2.69,
					left: 0.185,
					top: 0.6005
				},
				{
					id: "phone",
					length: 102,
					currentFrame: 0,
					width: 0.134,
					heightRatio: 0.3134,
					left: 0.372, 
					top: 0.852
				}
			],
			counter = 0,
			fileSuffix = "";

			if($(window).width() <= mobile_landscape) {
                fileSuffix = "_mobile";
                nativePaneWidth = 600;
            }

			$("#view").html(projectTemplate(data));

			var mainPane = $("#triptych"),
				globe = $("#spinny_globe"),
				container = $("#project-spinny #triptych");

			container.css("background-image", "url(../images/project_spinny/main_pane" + fileSuffix + ".jpg)");
			$("#phone_mask").css("background-image", "url(../images/project_spinny/mask" + fileSuffix + ".png)");
			$("#globe_mask").css("background-image", "url(../images/project_spinny/globe_mask" + fileSuffix + ".png)");

			globe.css({
				backgroundImage: "url(../images/project_spinny/globe_sprite" + fileSuffix + ".jpg)",
				backgroundSize: ((paneWidth / nativePaneWidth) * (globeConfig.width * nativePaneWidth) * globeConfig.length) + "px auto",
				width: 100 * ((globeConfig.width * nativePaneWidth) / nativePaneWidth) + "%",
				height: 100 * (((globeConfig.width * nativePaneWidth) * globeConfig.heightRatio) / (nativePaneWidth * paneHeightRatio)) + "%",
				top: (globeConfig.top * 100) + "%",
				left: (globeConfig.left * 100) + "%"
			});

			animatables.forEach(function(animatable) {
				$("<div data-animatable=" + animatable.id + "></div>").appendTo(mainPane).css({
					position: "absolute",
					left: (animatable.left * 100) + "%",
					top: (animatable.top * 100) + "%",
					backgroundSize: ((paneWidth / nativePaneWidth) * (animatable.width * nativePaneWidth) * animatable.length) + "px auto",
					backgroundImage: "url(../images/project_spinny/" + animatable.id + "_sprite" + fileSuffix + ".jpg)",
					width: 100 * ((animatable.width * nativePaneWidth) / nativePaneWidth) + "%",
					height: 100 * (((animatable.width * nativePaneWidth) * animatable.heightRatio) / (nativePaneWidth * paneHeightRatio)) + "%"
				});
			});

			$("#phone_mask").css("background-size", ((paneWidth / nativePaneWidth) * (0.23176 * nativePaneWidth)) + "px auto");
			$("#globe_mask").css("background-size", ((paneWidth / nativePaneWidth) * (0.60118 * nativePaneWidth)) + "px auto");

			mainPane.css({
				width: paneWidth,
				height: Math.round(paneWidth * paneHeightRatio),
				marginLeft: -0.5 * paneWidth
			});

			$("#project-spinny .project-contents").css("height", Math.round(paneWidth * paneHeightRatio));

			$("#project-spinny #svg_left").css({
				width: (0.15 * paneWidth) + "px",
				height: (0.25 * paneWidth * paneHeightRatio) + "px"
			})[0].setAttribute("viewBox", "0 0 69 72");

			$("#project-spinny #svg_right").css({
				width: (0.23 * paneWidth) + "px",
				height: (0.2 * paneWidth * paneHeightRatio) + "px"
			})[0].setAttribute("viewBox", "0 0 121 55.4");

			var animate = function() {
				if(counter % 5 == 0) {
					animatables.forEach(function(animatable) {
						$("[data-animatable=" + animatable.id + "]").css("background-position", (animatable.currentFrame * (100 / (animatable.length - 1))) + "%");

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
				globe.css("background-position", ((((x % globeConfig.length) * (100 / (globeConfig.length - 1)))) % 100) + "%");
			}

			var autoScroll = function() {
				var elapsed,
					delta,
					proceed = true;

				if(spinState.amplitude) {
					if(spinState.counter % Math.ceil(60 / globeConfig.length) == 0) {
						elapsed = (Date.now() - spinState.timestamp) / Math.ceil(60 / globeConfig.length);
						delta = spinState.amplitude * Math.exp(-elapsed / spinState.timeConstant);
						if(delta >= 1 || delta <= -1) {
							scroll(Math.round(spinState.target - delta));
						} else {
							proceed	= false;
						}
					}
					if(proceed) {
						spinState.rafID = requestAnimationFrame(autoScroll);
						spinState.counter++;
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
		            return Math.round(0.25 * e.targetTouches[0].clientX);
		        }

		        return Math.round(0.25 * e.clientX);
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
					delta = x - spinState.reference;
					spinState.reference = x;
					// scroll(spinState.offset + delta);
					scroll(spinState.offset - delta);
				}

				e.preventDefault();
				e.stopPropagation();
				return false;
			}

			this.release = function(e) {
				if(spinState.pressed) {
					spinState.pressed = false;

					clearInterval(spinState.ticker);
					spinState.target = spinState.offset;
					if(spinState.velocity > 2 || spinState.velocity < -2) {
						spinState.amplitude = 0.25 * spinState.velocity;
						spinState.target = spinState.offset + spinState.amplitude;
					}
					spinState.amplitude = spinState.target - spinState.offset;
					spinState.rafID = requestAnimationFrame(autoScroll);

					e.preventDefault();
					e.stopPropagation();
					return false;
				}
			}

			if (typeof window.ontouchstart !== 'undefined') {
	            container[0].addEventListener('touchstart', tap);
	            container[0].addEventListener('touchmove', drag);
	            window.addEventListener('touchend', this.release);
	        } else {
		        container[0].addEventListener('mousedown', tap);
		        container[0].addEventListener('mousemove', drag);
		        window.addEventListener('mouseup', this.release);
	        }
		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
			window.removeEventListener('touchend', this.release);
			window.removeEventListener('mouseup', this.release);
		}
	};
	return spinny;
});