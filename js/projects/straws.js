define(['templates/project_detail'], function(projectTemplate) {
	var straws = {
		glassWidth: 450,
		glassHeight: 325,
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
		strawTemplate: "<div class='straw'></div>",
		degToRadians: function(deg) { return deg * Math.PI / 180 },
		radToDegrees: function(rad) { return rad * 57.2958 },
		tiltAxis: function() {	
			$("#glassOutline").css("transform", "rotate(" + this.orientation + "deg)");

			var tLRotation = -this.innerLeftRightAngle - this.orientation,
				bLRotation = this.innerLeftRightAngle - this.orientation,
				xDiff = Math.round((Math.abs(Math.cos(this.degToRadians(tLRotation))) * this.hypoteneuse / 2) - (this.glassWidth / 2)),
				yDiff = Math.round((this.glassHeight / 2) - (Math.abs(Math.sin(this.degToRadians(tLRotation))) * this.hypoteneuse / 2)),
				altXDiff = Math.round((this.glassWidth / 2) - (Math.abs(Math.cos(this.degToRadians(bLRotation))) * this.hypoteneuse / 2)),
				altYDiff = Math.round((this.glassHeight / 2) - (Math.abs(Math.sin(this.degToRadians(bLRotation))) * this.hypoteneuse / 2));

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

			// if(Math.abs(rotation) > 10) {
			// 	this.direction = rotation > 0 ? -1 : 1;
			// } else {
			// 	this.strawArray.forEach(function(d) {
			// 		d.direction = d.angle < -90 ? -1 : 1;
			// 	});
			// }
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
		testIntersectGlass: function(straw) {
			if(this.liesWithin(this.intersects(straw, "left"), straw, "left") || this.liesWithin(this.intersects(straw, "right"), straw, "right") || this.liesWithin(this.intersects(straw, "bottom"), straw, "bottom")) {
				straw.intersectsGlass = true;
			} else {
				straw.intersectsGlass = false;
			}
		},
		updateStrawProps: function(straw) {
			// needs width, height, direction, range, finish
		},
		updateStrawFinish: function(straw) {

		},
		initialize: function() {
			var data = {
				identifier: "straws",
				title: "Straws",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta quibusdam voluptatibus aperiam doloribus vero, repudiandae officia odio consectetur sequi?",
				projectContents: '<button id="stopRAF">stop raf</button><div id="glass"><div class="testPoint1"></div><div class="testPoint2"></div><div class="testPoint3"></div><div class="testPoint4"></div><div id="glassOutline"></div></div><input type="range" id="tilter" min="0" max="50"/><button id="plus">+</button><button id="minus">-</button>',
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
				this.orientation = $("#tilter").val() - ($("#tilter").attr("max") / 2);
				this.tiltAxis();
			}.bind(this))

			$("#glass").css({
				width: this.glassWidth,
				height: this.glassHeight
			});

			this.hypoteneuse = Math.round(Math.sqrt(Math.pow(this.glassWidth, 2) + Math.pow(this.glassHeight, 2)));
			this.innerLeftRightAngle = Math.abs(this.radToDegrees(Math.acos(this.glassWidth/this.hypoteneuse)));

			var Straw = function(options) {
				this.width = options.width;
				this.height = options.height;
				this.el = $(self.strawTemplate);
				this.direction = [-1, 1][Math.round(Math.random())];
				this.range = (0.7 + Math.random() * 0.3).toFixed(2);
				
				// assuming here that we're starting at the range limit
				var glassBottomHypDistance = (1 - this.range) * self.glassWidth / 2;

				this.finish = {
					x: self.glassEdges.bottom.start.x + Math.cos(self.degToRadians(self.orientation)) * (this.direction == 1 ? glassBottomHypDistance : self.glassWidth - glassBottomHypDistance),
					y: self.glassEdges.bottom.start.y + Math.sin(self.degToRadians(self.orientation)) * (this.direction == 1 ? glassBottomHypDistance : self.glassWidth - glassBottomHypDistance)
				}

				if(Math.round(Math.sqrt(Math.pow(self.glassWidth - glassBottomHypDistance, 2) + Math.pow(self.glassHeight, 2))) < this.height) {
					// straw goes over
					this.angle = self.radToDegrees(Math.atan(self.glassHeight/(self.glassWidth - glassBottomHypDistance)));
				} else {
					// straw leans against right edge
					this.angle = self.radToDegrees(Math.atan( Math.sqrt(Math.pow(this.height, 2) - Math.pow((self.glassWidth - glassBottomHypDistance), 2)) / (self.glassWidth - glassBottomHypDistance)));
				}

				if(this.direction == -1) this.angle = (180 - this.angle);

				this.dX = Math.cos(self.degToRadians(this.angle)) * this.height;
				this.dY = Math.sin(self.degToRadians(this.angle)) * this.height;
				this.slope = this.dY / this.dX;
				this.intercept = this.finish.y - this.slope * this.finish.x;

				this.start = {
					x: this.finish.x + this.dX,
					y: this.finish.y + this.dY
				}

				self.testIntersectGlass(this);

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

			this.strawArray = [];

			this.strawArray.push(new Straw({
				width: 25,
				height: 475
			}));

			var release = function() {
				this.strawArray.forEach(function(d, i) {
					// every frame, try to move the finish point. in this case we're not worrying about it yet - all straws are at their maximum finish
					// next, try to move the angle and see if that results in an intersecting straw
					d.angle += d.direction * 0.5;

					if(this.testIntersectGlass(d)) {
						// reverse movement
					} else {
						// preserve movement
					}

					d.css("transform", "translate3d(" + d.finish.x + "px," + (-d.finish.y) + "px, 0) rotate(" + parseInt((-90) - d.angle, 10) + "deg)");
				}.bind(this));

				this.rafID = requestAnimationFrame(release);

			}.bind(this);

		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	};

	window.straws = straws;
	return straws;
});
