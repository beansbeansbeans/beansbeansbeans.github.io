define(['templates/project_detail'], function(projectTemplate) {
	var straws = {
		glassWidth: 450,
		glassHeight: 325,
		glassEdges: {
			left: {
				start: {},
				finish: {}
			},
			right: {
				start: {},
				finish: {}
			},
			bottom: {
				start: {},
				finish: {}
			}
		},
		strawTemplate: "<div class='straw'></div>",
		degToRadians: function(deg) { return deg * Math.PI / 180 },
		radToDegrees: function(rad) { return rad * 57.2958 },
		tiltAxis: function() {	
			var rotation = this.orientation - ($("#tilter").attr("max") / 2) || 0;
			$("#glassOutline").css("transform", "rotate(" + rotation + "deg)");

			var tLRotation = -this.innerLeftRightAngle - rotation,
				bLRotation = this.innerLeftRightAngle - rotation,
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

			this.strawArray.forEach(function(d) {
				this.findLimits(d);
				this.testIntersectGlass(d);
			}.bind(this));

			console.log("GLASS EDGES COMING UP:");
			console.log(this.glassEdges);
			console.log("do they intersect?");
			console.log(this.strawArray[0].intersectsGlass);

		},
		findLimits: function(straw) {
			straw.dX = Math.cos(this.degToRadians(straw.angle)) * straw.height;
			straw.dY = Math.sin(this.degToRadians(straw.angle)) * straw.height;
			straw.slope = straw.dY / straw.dX;

			straw.intercept = straw.top.y - straw.slope * straw.top.x;
			straw.motionCase = (straw.angle > -90) ? 1 : -1;

			straw.yLimit = 0;
			straw.xLimit = 0;
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
					x: straw.top.x,
					y: edge.slope * straw.top.x + edge.intercept
				}
			}

			return {
				x: xSolution,
				y: straw.slope * xSolution + straw.intercept
			}
		},
		between: function(a, b, c) {
			if(!(a < b && b < c) && !(c < b && b < a)) {
				return false;
			}
			return true;
		},
		liesWithin: function(point, straw, side) {
			if(point === false) return false;

			var edge = this.glassEdges[side];

			if(!this.between(straw.top.x, point.x, straw.top.x + straw.dX) || !this.between(straw.top.y, point.y, straw.top.y + straw.dY)) {
				if((straw.dY !== 0 || (point.y !== straw.top.y || (!this.between(straw.top.x, point.x, straw.top.x + straw.dX)))) && (straw.dX !== 0 || (point.x !== straw.top.x || (!this.between(straw.top.y, point.y, straw.top.y + straw.dY))))) {
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
		initialize: function() {
			var data = {
				identifier: "straws",
				title: "Straws",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta quibusdam voluptatibus aperiam doloribus vero, repudiandae officia odio consectetur sequi?",
				projectContents: '<button id="stopRAF">stop raf</button><div id="glass"><div class="testPoint1"></div><div class="testPoint2"></div><div class="testPoint3"></div><div class="testPoint4"></div><div id="glassOutline"></div></div><input type="range" id="tilter" min="0" max="80"/>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime, laboriosam.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium iste eius vero quasi debitis molestiae omnis ea quas. Quibusdam, est."
			},
			self = this;

			$("#view").html(projectTemplate(data));

			$("#stopRAF").on("click", function() {
				window.cancelAnimationFrame(this.rafID);
			}.bind(this));

			$("#tilter").on("change", function() {
				this.orientation = $("#tilter").val();
				this.tiltAxis(this.orientation);
			}.bind(this));

			$("#glass").css({
				width: this.glassWidth,
				height: this.glassHeight
			});

			this.glassEdges.left.start = {
				x: 0,
				y: 0
			}

			this.glassEdges.right.start = {
				x: this.glassWidth,
				y: 0
			}

			this.glassEdges.left.finish = {
				x: 0,
				y: -this.glassHeight
			}

			this.glassEdges.bottom.start = {
				x: 0,
				y: -this.glassHeight
			}

			this.glassEdges.right.finish = {
				x: this.glassWidth,
				y: -this.glassHeight
			}

			this.glassEdges.bottom.finish = {
				x: this.glassWidth,
				y: -this.glassHeight
			}

			this.hypoteneuse = Math.round(Math.sqrt(Math.pow(this.glassWidth, 2) + Math.pow(this.glassHeight, 2)));
			this.innerLeftRightAngle = Math.abs(this.radToDegrees(Math.acos(this.glassWidth/this.hypoteneuse)));

			var Straw = function(options) {
				this.width = options.width || 10;
				this.height = options.height || self.glassHeight * 1.25;
				this.top = options.top;
				this.angle = options.angle;
				this.el = $(self.strawTemplate);

				this.el.appendTo("#glass").css({
					position: "absolute",
					background: "#ec4911",
					width: this.width,
					height: this.height,
					transform: "translate3d(" + this.top.x + "px," + (-this.top.y) + "px, 0) rotate(" + parseInt((-90) - this.angle, 10) + "deg)",
					transformOrigin: "top left"
				});
			}

			this.strawArray = [];

			// this.strawArray.push(new Straw({
			// 	width: 25,
			// 	height: 450,
			// 	top: {
			// 		x: 140,
			// 		y: -350
			// 	},
			// 	angle: -55
			// }));

			this.strawArray.push(new Straw({
				width: 25,
				height: 475,
				top: { //cartesian
					x: 40,
					y: 100
				},
				angle: -60
			}));

			var release = function() {
				this.strawArray.forEach(function(d, i) {

					if(d.intersectsGlass === true) {
						d.angle += 1 * d.motionCase; // motionCase: 1 (wants to move right) or -1
						this.findLimits(d);
						d.top.x = (d.motionCase * (d.top.x + 1 * d.motionCase) < d.xLimit) ? d.top.x + 1 * d.motionCase : d.top.x;
					}

					d.top.y = (d.top.y + 1 < d.yLimit) ? d.top.y + 1 : d.top.y;

					if((d.intersectsGlass === true && d.xLimit === d.top.x && d.yLimit === d.top.y) || d.dY > 0) {
						// if the straw has reached its limits or if its bottom is higher than its top
						d.angle -= 1 * d.motionCase;
						this.findLimits(d);
					}

					d.el.css("transform", "translate3d(" + d.top.x + "px," + (-d.top.y) + "px,0) rotate(" + parseInt((-90) - d.angle, 10) + "deg)");

					this.testIntersectGlass(d);

				}.bind(this));

				this.rafID = requestAnimationFrame(release);

			}.bind(this);

			// this.rafID = requestAnimationFrame(release);
			this.tiltAxis();
		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	};
	window.straws = straws;
	return straws;
});
