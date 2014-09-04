define(['templates/project_detail'], function(projectTemplate) {
	var straws = {
		glassWidth: 450,
		glassHeight: 425,
		orientation: 0,
		glassEdges: {
			left: {
				start: {
					x: 0,
					y: 0
				},
				finish: {
					x: 0,
					y: -this.glassHeight
				}
			},
			right: {
				start: {
					x: this.glassWidth,
					y: 0
				},
				finish: {
					x: this.glassWidth,
					y: -this.glassHeight
				}
			},
			bottom: {
				start: {
					x: 0,
					y: -this.glassHeight
				},
				finish: {
					x: this.glassWidth,
					y: -this.glassHeight
				}
			}
		},
		strawArray: [],
		strawTemplate: "<div class='straw'></div>",
		degToRadians: function(deg) { return deg * Math.PI / 180 },
		radToDegrees: function(rad) { return rad * 57.2958 },
		tiltAxis: function() {	
			$("#glassOutline").css("transform", "rotate(" + this.orientation + "deg)");

			var tLRotation = -this.innerLeftRightAngle - this.orientation,
				bLRotation = this.innerLeftRightAngle - this.orientation,
				xDiff = (Math.abs(Math.cos(this.degToRadians(tLRotation))) * this.hypoteneuse / 2) - (this.glassWidth / 2),
				yDiff = (this.glassHeight / 2) - (Math.abs(Math.sin(this.degToRadians(tLRotation))) * this.hypoteneuse / 2),
				altXDiff = (this.glassWidth / 2) - (Math.abs(Math.cos(this.degToRadians(bLRotation))) * this.hypoteneuse / 2),
				altYDiff = (this.glassHeight / 2) - (Math.abs(Math.sin(this.degToRadians(bLRotation))) * this.hypoteneuse / 2);

			this.glassEdges.left.start.x = 0 - xDiff;
			this.glassEdges.left.start.y = 0 - yDiff;

			this.glassEdges.left.finish.x = 0 + altXDiff;
			this.glassEdges.left.finish.y = -this.glassHeight + altYDiff;

			this.glassEdges.bottom.start.x = 0 + altXDiff;
			this.glassEdges.bottom.start.y = -this.glassHeight + altYDiff;

			this.glassEdges.bottom.finish.x = this.glassWidth + xDiff;
			this.glassEdges.bottom.finish.y = -this.glassHeight + yDiff;

			this.glassEdges.right.start.x = this.glassWidth - altXDiff;
			this.glassEdges.right.start.y = 0 - altYDiff;

			this.glassEdges.right.finish.x = this.glassWidth + xDiff;
			this.glassEdges.right.finish.y = -this.glassHeight + yDiff;

			Object.keys(this.glassEdges).forEach(function(d) {
				this.glassEdges[d].slope = (this.glassEdges[d].start.y - this.glassEdges[d].finish.y) / (this.glassEdges[d].start.x - this.glassEdges[d].finish.x);
				this.glassEdges[d].intercept = this.glassEdges[d].start.y - this.glassEdges[d].slope * this.glassEdges[d].start.x;
			}.bind(this));

			this.strawArray.forEach(function(d) {
				this.updateStrawFinish(d);
				d.intersectsGlass = false;
			}.bind(this));

			if(Math.abs(this.orientation) > 40) {
				this.strawArray.forEach(function(d) {
					this.updateStrawDirection(d, this.orientation > 0 ? 1 : -1)
				}.bind(this))
			}
		},
		intersects: function(straw, side) {
			var edge = this.glassEdges[side],
				xSolution = (edge.intercept - straw.intercept) / (straw.slope - edge.slope)

			if(straw.slope == edge.slope) return false;

			if(edge.slope == Number.POSITIVE_INFINITY || edge.slope == Number.NEGATIVE_INFINITY) {
				return {
					x: edge.start.x,
					y: straw.slope * edge.start.x + straw.intercept
				}
			}
			if(straw.slope == Number.POSITIVE_INFINITY || straw.slope == Number.NEGATIVE_INFINITY) {
				return {
					x: straw.start.x,
					y: edge.slope * straw.start.x + edge.intercept
				}
			}
			return {
				x: xSolution,
				y: straw.slope * xSolution + straw.intercept
			}
		},
		between: function(a, b, c) {
			if(!(a < b && b < c) && !(c < b && b < a)) return false;
			return true;
		},
		liesWithin: function(point, straw, side) {
			if(point === false) return false;

			var edge = this.glassEdges[side];

			if(!this.between(straw.start.x, point.x, straw.finish.x) || !this.between(straw.start.y, point.y, straw.finish.y)) {
				if((straw.dY !== 0 || (point.y !== straw.start.y || (!this.between(straw.start.x, point.x, straw.finish.x)))) && (straw.dX !== 0 || (point.x !== straw.start.x || (!this.between(straw.start.y, point.y, straw.finish.y))))) {
					return false;
				}
			}

			if(!this.between(edge.start.x, point.x, edge.finish.x) || !this.between(edge.start.y, point.y, edge.finish.y)) {
				if((edge.start.x !== edge.finish.x || (point.x !== edge.start.x || (!this.between(edge.start.y, point.y, edge.finish.y)))) && (edge.start.y !== edge.finish.y || (point.y !== edge.start.y || (!this.between(edge.start.x, point.x, edge.finish.x))))) {
					return false;
				}
			}

			return true;
		},
		testIntersectGlass: function(straw, side) {
			if(this.liesWithin(this.intersects(straw, side), straw, side)) {
				straw.intersectsGlass = true;
			} else {
				straw.intersectsGlass = false;
			}
		},
		updateStrawProps: function(straw) {
			straw.dX = Math.cos(this.degToRadians(straw.angle)) * straw.height;
			straw.dY = Math.sin(this.degToRadians(straw.angle)) * straw.height;
			straw.slope = straw.dY / straw.dX;
			straw.intercept = straw.finish.y - straw.slope * straw.finish.x;

			straw.start = {
				x: straw.finish.x + straw.dX,
				y: straw.finish.y + straw.dY
			}
		},
		updateStrawFinish: function(straw) {
			var glassBottomHypDistance = 0.5 * (1 - straw.range) * this.glassWidth + ((straw.rangeAdvance - 1) / -2) * straw.range * this.glassWidth;

			straw.finish = {
				x: this.glassEdges.bottom.start.x + Math.cos(this.degToRadians(-this.orientation)) * glassBottomHypDistance,
				y: this.glassEdges.bottom.start.y + Math.sin(this.degToRadians(-this.orientation)) * glassBottomHypDistance
			}
		},
		updateStrawMaxAngle: function(straw) {
			var maxHypDistance = (1 - straw.range) * this.glassWidth / 2;

			if(Math.round(Math.sqrt(Math.pow(this.glassWidth - maxHypDistance, 2) + Math.pow(this.glassHeight, 2))) < straw.height) {
				straw.maxAngle = this.radToDegrees(Math.atan(this.glassHeight/(this.glassWidth - maxHypDistance)));
			} else {
				straw.maxAngle = this.radToDegrees(Math.atan( Math.sqrt(Math.pow(straw.height, 2) - Math.pow((this.glassWidth - maxHypDistance), 2)) / (this.glassWidth - maxHypDistance)));
			}

			if(straw.direction == -1) straw.maxAngle = (180 - straw.maxAngle);
		},
		updateStrawDirection: function(straw, direction) {
			straw.direction = direction;
			straw.intersectsGlass = false;
			this.updateStrawMaxAngle(straw);
		},
		initialize: function() {
			var data = {
				identifier: "straws",
				title: "Straws",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta quibusdam voluptatibus aperiam doloribus vero, repudiandae officia odio consectetur sequi?",
				projectContents: '<button id="stopRAF">stop raf</button><div id="glass"><div class="testPoint1"></div><div class="testPoint2"></div><div class="testPoint3"></div><div class="testPoint4"></div><div id="glassOutline"></div></div><input type="range" id="tilter" min="0" max="90"/><button id="plus">+</button><button id="minus">-</button>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime, laboriosam.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium iste eius vero quasi debitis molestiae omnis ea quas. Quibusdam, est."
			},
			self = this;

			$("#view").html(projectTemplate(data));

			$("#stopRAF").on("click", function() {
				window.cancelAnimationFrame(this.rafID);
			}.bind(this));

			$("#plus, #minus").on("click", function(e) {
				var multiplier = 1;
				if($(e.target).attr("id") == "minus") multiplier = -1;
				$("#tilter").val(parseInt($("#tilter").val()) + 1 * multiplier);
				this.orientation = $("#tilter").val() - $("#tilter").attr("max") / 2;
				this.tiltAxis();
			}.bind(this))

			$("#glass").css({
				width: this.glassWidth,
				height: this.glassHeight
			});

			this.hypoteneuse = Math.sqrt(Math.pow(this.glassWidth, 2) + Math.pow(this.glassHeight, 2));
			this.innerLeftRightAngle = Math.abs(this.radToDegrees(Math.acos(this.glassWidth/this.hypoteneuse)));

			var Straw = function(options) {
				this.width = options.width;
				this.height = options.height;
				this.el = $(self.strawTemplate);
				this.direction = [-1, 1][Math.round(Math.random())];
				this.range = (0.6 + Math.random() * 0.3).toFixed(2);
				this.rangeAdvance = 0.75 * this.direction;

				this.rangeAdvanceRate = 0.001 * Math.random() * 5;

				self.updateStrawFinish(this);
				self.updateStrawMaxAngle(this);

				this.angle = this.maxAngle + 10 * this.direction + this.direction * Math.random() * 30;

				this.angleAdvanceRate = 0.1 * Math.random() * 3;

				self.updateStrawProps(this);

				this.el.appendTo("#glass").css({
					position: "absolute",
					background: "#ec4911",
					width: this.width,
					height: this.height,
					transform: "translate3d(" + this.finish.x + "px," + (-this.finish.y - this.height) + "px, 0) rotate(" + parseInt(90 - this.angle, 10) + "deg)",
					transformOrigin: "bottom left"
				});
			}

			this.tiltAxis();

			this.strawArray.push(new Straw({
				width: 25,
				height: 475
			}));

			this.strawArray.push(new Straw({
				width: 25,
				height: 525
			}));

			var release = function() {
				this.strawArray.forEach(function(d, i) {

					if(d.direction * (d.rangeAdvance - d.direction) < 0) {
						d.rangeAdvance += d.direction * d.rangeAdvanceRate;
						this.updateStrawFinish(d);
					}

					if(d.direction * (d.angle - (d.maxAngle - this.orientation)) > 0) {
						if(!d.intersectsGlass) {
							d.angle -= d.direction * d.angleAdvanceRate;
						}
						this.updateStrawProps(d);
					} else {
						d.angle = d.maxAngle - this.orientation;
					}

					d.el.css("transform", "translate3d(" + d.finish.x + "px," + (-d.finish.y - d.height) + "px, 0) rotate(" + this.degToRadians(90 - d.angle) + "rad)");

					this.testIntersectGlass(d, (d.direction == 1) ? "right" : "left");
				}.bind(this));

				this.rafID = requestAnimationFrame(release);

			}.bind(this);

			requestAnimationFrame(release);

		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	};

	window.straws = straws;
	return straws;
});
