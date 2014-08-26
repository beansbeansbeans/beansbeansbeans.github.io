define(['templates/project_detail'], function(projectTemplate) {
	function sign(x) {
		if(x===0) {
			return -1;
		} else {
			return (x < 0 ? -1 : 1);
		}
	}
	var straws = {
		glassWidth: 450,
		glassHeight: 325,
		strawTemplate: "<div class='straw'></div>",
		degToRadians: function(deg) {
			return deg * Math.PI / 180;
		},
		testForIntersection: function(straw) {
			var intersectionArray = [],
				dX = straw.height * Math.cos(this.degToRadians(straw.angle)),
				dY = straw.height * Math.sin(this.degToRadians(straw.angle)),
				slope = dY / dX,
				yIntercept = (-straw.top.y) - slope * straw.top.x,

				liesWithinStraw = function(point) {
					if( point.x >= straw.top.x && 
						point.x <= (straw.top.x + dX) && 
						point.y <= -straw.top.y && 
						point.y >= (-straw.top.y + dY)) {
						return true
					} 
					else {return false}
				}.bind(this),

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
						point.point = {
							x: (-this.glassHeight - yIntercept)/slope,
							y: -this.glassHeight
						}
					}
					return point;
				}.bind(this);

			intersectionArray.push(linearSolution("left"));
			intersectionArray.push(linearSolution("right"));
			intersectionArray.push(linearSolution("bottom"));

			intersectionArray.forEach(function(d) {
				var repeatArray = straw.intersectionPoints.filter(function(point) {
					return point.position === d.position;
				});
				if(liesWithinStraw(d.point) && !repeatArray.length) {straw.intersectionPoints.push(d)}
			});
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

			var straws = [];

			straws.push(new Straw({
				width: 15,
				height: 450,
				top: {
					x: 150,
					y: -200
				},
				angle: -60 + Math.random() * 10
			}));

			var release = function() {
				straws.forEach(function(d, i) {
					if(d.intersectionPoints.length < 2) {
						if(!d.intersectionPoints.length) {
							d.top.y++;
						} else {
							// window.cancelAnimationFrame(self.rafID);
							// return false;
							if(d.intersectionPoints[0].position === "bottom") {
								d.angle -= sign(d.angle);								
							} else {
								d.angle += sign(d.angle);
								// in this case we might also need to change the transform origin 
							}			

							var	dX = d.height * Math.cos(self.degToRadians(d.angle)),
								dY = d.height * Math.sin(self.degToRadians(d.angle)),
								slope = dY / dX;

							d.top.x = d.intersectionPoints[0].point.x - dX;
							d.top.y = -(d.intersectionPoints[0].point.y - dY);
						}

						d.el.css({
							transform: "translate3d(" + d.top.x + "px," + d.top.y + "px,0) rotate(" + parseInt((-90) - d.angle, 10) + "deg)"
						});

						self.testForIntersection(d);

						// TESTING FOR INTERSECTION
						// if the solution to the linear problem between the straw and any of the three sides of the glass lies within the glass, then that is an intersection point
						// update intersectionPoints

						// always try to move down - either directly or with a rotation
						// 
						// determine whether touching glass bottom: does one of its intersection points have a y value of the glass height?
						
						// there should just be one function - fall until hits an edge, fall until hits an edge, etc. until equilibrium
						
						// () if the straw is totally free form, move it straight down
						// () if the straw is touching the glass bottom, then have it pivot toward the bottom of the glass (either picking a random direction, or having it continue in the current direction)
						// () if the straw is touching the glass lip, have it pivot toward its own center point, and SIMULTANEOUSLY have it move down
						
						// straw.css({
						// 	transform: translate3d(x, y, z),
						// 	transformOrigin: whatever
						// });

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
