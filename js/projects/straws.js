define(['templates/project_detail'], function(projectTemplate) {
	var straws = {
		glassWidth: 450,
		glassHeight: 325,
		strawTemplate: "<div class='straw'></div>",
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
					var point = {position: edge};
					if(edge === "left") {
						point.point = {
							x: 0,
							y: yIntercept
						}
					} else if(edge === "right") {
						point.point = {
							x: this.glassWidth,
							y: slope * this.glassWidth + yIntercept
						}
					} else {
						if(slope == Number.POSITIVE_INFINITY || slope == Number.NEGATIVE_INFINITY) {
							point.point = {
								x: straw.top.x,
								y: -this.glassHeight
							}
						} else {
							point.point = {
								x: (-this.glassHeight - yIntercept)/slope,
								y: -this.glassHeight
							}
						}
					}
					return point;
				}.bind(this);
				
			if(slope !== Number.POSITIVE_INFINITY && slope !== Number.NEGATIVE_INFINITY) {
				intersectionArray.push(linearSolution("left"));
				intersectionArray.push(linearSolution("right"));
			}

			intersectionArray.push(linearSolution("bottom"));

			intersectionArray.forEach(function(d) {
				var repeatArray = straw.intersectionPoints.filter(function(point) {
					return point.position === d.position;
				});
				if(this.liesWithinStraw(d.point, straw, dX, dY) && this.liesWithinGlass(d.point) && !repeatArray.length) {straw.intersectionPoints.push(d)}
			}.bind(this));
		},
		handleDragStart: function(e) {
			$(e.currentTarget).attr('data-being-dragged', true);
			this.indexOfDraggedStraw = $(".straw").index($(e.currentTarget));
		},
		handleDragEnd: function() {
			$('[data-being-dragged=true]').attr("data-being-dragged", false);
		},
		handleDragMove: function(e) {
			if(!$('[data-being-dragged=true]').length) return false;
			console.log("dragging a straw");
			console.log(this);

			// var straw = this.strawArray[this.indexOfDraggedStraw],
			// 	dX = straw.height * Math.cos(this.degToRadians(straw.angle)),
			// 	dY = straw.height * Math.sin(this.degToRadians(straw.angle)),
			// 	multiplier = (e.clientX - straw.top.x)/ straw.width; 

		},
		initialize: function() {
			var data = {
				identifier: "straws",
				title: "Straws",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta quibusdam voluptatibus aperiam doloribus vero, repudiandae officia odio consectetur sequi?",
				projectContents: '<button id="stopRAF">stop raf</button><div id="glass"></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime, laboriosam.",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium iste eius vero quasi debitis molestiae omnis ea quas. Quibusdam, est."
			},
			self = this;

			$("#view").html(projectTemplate(data));

			$("#stopRAF").on("click", function() {
				window.cancelAnimationFrame(this.rafID);
			}.bind(this));

			$("#glass").css({
				width: this.glassWidth,
				height: this.glassHeight
			});

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

			$("body").on("mousedown", ".straw", this.handleDragStart.bind(this));
			$("body").on("mouseup", this.handleDragEnd.bind(this));
			$("body").on("mousemove", this.handleDragMove.bind(this));

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

			var release = function() {
				this.strawArray.forEach(function(d, i) {
					if(d.el.attr("data-being-dragged") == "true") {
						return false;
					}
					if(d.intersectionPoints.length < 2) {
						if(!d.intersectionPoints.length) {
							d.top.y++;
						} else {
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

						self.testForIntersection(d);
					}
				});

				this.rafID = requestAnimationFrame(release);

			}.bind(this);

			this.rafID = requestAnimationFrame(release);
		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	};
	return straws;
});
