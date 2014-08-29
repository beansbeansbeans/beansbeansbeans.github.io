define(['templates/project_detail'], function(projectTemplate) {
	var straws = {
		glassWidth: 450,
		glassHeight: 325,
		strawTemplate: "<div class='straw'></div>",
		tiltAxis: function() {
			// Maybe the coordinates can just be virtual - on desktop you transform the glass sides with CSS and on mobile you do nothing at all - just respect the virtual coordinates. On desktop the virtual coordinates would line up with the visible glass, on mobile they would only line up when parallel with the ground. 
			
			var rotation = this.orientation - ($("#tilter").attr("max") / 2);
			$("#glassOutline").css("transform", "rotate(" + rotation + "deg)");

			// must update all coordinates
			// this.glassTopLeft.x = ;
			// this.glassTopLeft.y = ;

			this.glassLeftEdgeSlope = (this.glassTopLeft.y - this.glassBottomLeft.y) / (this.glassTopLeft.x - this.glassBottomLeft.x);
			this.glassLeftEdgeIntercept = this.glassTopLeft.y - this.glassLeftEdgeSlope * this.glassTopLeft.x;

			console.log("left edge slope: " + this.glassLeftEdgeSlope);
			console.log("left edge intercept: " + this.glassLeftEdgeIntercept);

			this.glassRightEdgeSlope = (this.glassTopRight.y - this.glassBottomRight.y) / (this.glassTopRight.x - this.glassBottomRight.x);
			this.glassRightEdgeIntercept = this.glassTopRight.y - this.glassRightEdgeSlope * this.glassTopRight.x;

			console.log("right edge slope: " + this.glassRightEdgeSlope);
			console.log("right edge intercept: " + this.glassRightEdgeIntercept);

			this.glassBottomEdgeSlope = (this.glassBottomLeft.y - this.glassBottomRight.y) / (this.glassBottomLeft.x - this.glassBottomRight.x);
			this.glassBottomEdgeIntercept = this.glassBottomLeft.y - this.glassRightEdgeSlope * this.glassBottomLeft.x;

			console.log("bottom edge slope: " + this.glassBottomEdgeSlope);
			console.log("bottom edge intercept: " + this.glassBottomEdgeIntercept);

		},
		degToRadians: function(deg) {
			return deg * Math.PI / 180;
		},
		liesWithinGlass: function(point) {
			if( point.x >= 0 &&
				point.x <= this.glassWidth &&
				point.y <= 0 &&
				point.y >= -this.glassHeight) {
				return true;
			}
			else {return false}
		},
		liesWithinStraw: function(point, straw, dX, dY) {
			var topLeft = {
				x: (straw.top.x < (straw.top.x + dX)) ? straw.top.x : (straw.top.x + dX),
				y: (-straw.top.y < (-straw.top.y + dY)) ? -straw.top.y : (-straw.top.y + dY)
			},
			bottomRight = {
				x: (straw.top.x > (straw.top.x + dX)) ? straw.top.x : (straw.top.x + dX),
				y: (-straw.top.y > (-straw.top.y + dY)) ? -straw.top.y : (-straw.top.y + dY)
			};

			if( point.x >= topLeft.x && 
				point.x <= bottomRight.x && 
				point.y >= topLeft.y && 
				point.y <= bottomRight.y) {
				return true
			} 
			else {return false}
		},
		testForIntersection: function(straw) {
			var intersectionArray = [],
				dX = straw.height * Math.cos(this.degToRadians(straw.angle)),
				dY = straw.height * Math.sin(this.degToRadians(straw.angle)),
				slope = dY / dX,
				yIntercept = (-straw.top.y) - slope * straw.top.x,
				linearSolution = function(edge) {
					var point = {
						position: edge,
						point: {}
					};
					if(edge === "left") {
						var sideSlope = this.glassLeftEdgeSlope,
							sideIntercept = this.glassLeftEdgeIntercept,
							sidePoint = this.glassTopLeft;
					} else if(edge === "right") {
						var sideSlope = this.glassRightEdgeSlope,
							sideIntercept = this.glassRightEdgeIntercept,
							sidePoint = this.glassTopRight;
					} else {
						var sideSlope = this.glassBottomEdgeSlope,
							sideIntercept = this.glassBottomEdgeIntercept,
							sidePoint = this.glassBottomLeft;
					}

					if(sideSlope == slope) {
						point.point.x = Infinity;
						point.point.y = Infinity;
					} else {
						if(sideSlope == Number.POSITIVE_INFINITY || sideSlope == Number.NEGATIVE_INFINITY) {
							point.point.x = sidePoint.x;
							point.point.y = slope * sidePoint.x + yIntercept;
						} else if(sideSlope == 0) {
							point.point.x = (sidePoint.y - yIntercept) / slope;
							point.point.y = sidePoint.y;
						} else {
							console.log("sides are neither vertical nor horizontal");
							point.point.x = (sideIntercept - yIntercept) / (slope - sideSlope);
							point.point.y = slope * point.point.x + yIntercept;
						}
					}

					return point;
				}.bind(this);
				
			intersectionArray.push(linearSolution("left"));
			intersectionArray.push(linearSolution("right"));
			intersectionArray.push(linearSolution("bottom"));

			straw.intersectionPoints = [];

			intersectionArray.forEach(function(d) {
				var repeatArray = straw.intersectionPoints.filter(function(point) {
					return point.position === d.position;
				});
				if(this.liesWithinStraw(d.point, straw, dX, dY) && this.liesWithinGlass(d.point) && !repeatArray.length) {
					straw.intersectionPoints.push(d)
				}
			}.bind(this));
		},
		initialize: function() {
			var data = {
				identifier: "straws",
				title: "Straws",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta quibusdam voluptatibus aperiam doloribus vero, repudiandae officia odio consectetur sequi?",
				projectContents: '<button id="stopRAF">stop raf</button><div id="glass"><div id="glassOutline"></div></div><input type="range" id="tilter" min="0" max="80"/>',
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

			this.glassTopLeft = {
				x: 0,
				y: 0
			}

			this.glassTopRight = {
				x: this.glassWidth,
				y: 0
			}

			this.glassBottomLeft = {
				x: 0,
				y: -this.glassHeight
			}

			this.glassBottomRight = {
				x: this.glassWidth,
				y: -this.glassHeight
			}

			this.offsetLeft = $("#glass").offset().left;
			this.offsetTop = $("#glass").offset().top;

			var Straw = function(options) {
				this.width = options.width || 10;
				this.height = options.height || self.glassHeight * 1.25;
				this.top = options.top;
				this.angle = options.angle;
				this.el = $(self.strawTemplate);
				this.intersectionPoints = [];
				this.transformOrigin = "top left";

				this.el.appendTo("#glass").css({
					position: "absolute",
					background: "#ec4911",
					width: this.width,
					height: this.height,
					transform: "translate3d(" + this.top.x + "px," + this.top.y + "px, 0) rotate(" + parseInt((-90) - this.angle, 10) + "deg)",
					transformOrigin: this.transformOrigin
				});
			}

			this.strawArray = [];

			this.strawArray.push(new Straw({
				width: 25,
				height: 450,
				top: {
					x: 40,
					y: -150
				},
				angle: -55 - Math.random() * 10
			}));

			this.strawArray.push(new Straw({
				width: 30,
				height: 475,
				top: {
					x: 350,
					y: -100
				},
				angle: -130
			}))

			var release = function() {
				this.strawArray.forEach(function(d, i) {
					if(d.el.attr("data-being-dragged") == "true") return false;
					if(d.intersectionPoints.length < 2) {
						if(!d.intersectionPoints.length) d.top.y++;
						else {
							if(d.intersectionPoints[0].position == "bottom") {
								d.angle += (d.angle < -90) ? -0.5 : 0.5;
								var	dX = d.height * Math.cos(self.degToRadians(d.angle)),
									dY = d.height * Math.sin(self.degToRadians(d.angle));
							} else {
								if(d.angle < -45 && d.angle > -135) {
									d.angle += (d.angle < -90) ? -0.2 : 0.2;
								}

								var	dX = d.height * Math.cos(self.degToRadians(d.angle)),
									dY = d.height * Math.sin(self.degToRadians(d.angle)),
									shrinker = Math.abs(0.95 * Math.abs(d.intersectionPoints[0].point.x - d.top.x) / dX);

								dX *= shrinker;
								dY *= shrinker;
								
								if(dY < 1) d.intersectionPoints[0].point.y -= 1
							}

							d.top.x = d.intersectionPoints[0].point.x - dX;
							d.top.y = -(d.intersectionPoints[0].point.y - dY);
						}

						d.el.css({
							transform: "translate3d(" + d.top.x + "px," + d.top.y + "px,0) rotate(" + parseInt((-90) - d.angle, 10) + "deg)"
						});

					}
					self.testForIntersection(d);
				});

				this.rafID = requestAnimationFrame(release);

			}.bind(this);

			this.rafID = requestAnimationFrame(release);
			this.tiltAxis();
		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	};
	return straws;
});
