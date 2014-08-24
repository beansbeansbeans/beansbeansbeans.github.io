define(['templates/project_detail'], function(projectTemplate) {
	var straws = {
		glassWidth: 450,
		glassHeight: 325,
		strawTemplate: "<div class='straw'></div>",
		degToRadians: function(deg) {
			return deg * Math.PI / 180;
		},
		testForIntersection: function(straw) {
			var intersectionArray = [],
				dX = (straw.height * Math.cos(this.degToRadians(-90 + straw.angle))),
				dY = (straw.height * Math.sin(this.degToRadians(-90 + straw.angle))),
				slope = dY / dX,
				yIntercept = straw.top.y - slope * straw.top.x;
				liesWithinStraw = function(point) {
					if(point.x >= straw.top.x && point.x <= (straw.top.x - dX) && point.y >= straw.top.y && point.y <= (straw.top.y - dY)) {return true} 
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
							x: (this.glassHeight - yIntercept)/slope,
							y: this.glassHeight
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
			
				this.el.appendTo("#glass").css({
					position: "absolute",
					background: "#ec4911",
					width: this.width,
					height: this.height,
					transform: "translate3d(" + this.top.x + "px," + this.top.y + "px, 0) rotate(" + this.angle + "deg)",
					transformOrigin: "bottom left"
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
				angle: -20 + Math.random() * 10
			}));

			// release
			// this should first drop the straw straight down, then pick an angle if perpendicular, else release down
			
			var release = function() {
				straws.forEach(function(d, i) {
					if(d.intersectionPoints.length < 2) {
						if(!d.intersectionPoints.length) { d.top.y++ } 
						else {
							// touching in one spot
						}

						d.el.css({
							transform: "translate3d(" + d.top.x + "px," + d.top.y + "px,0) rotate(" + d.angle + "deg)"
						});

						self.testForIntersection(d);

						console.log(d.intersectionPoints);

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

				// notes
				// once an intersection point has been added, over the course of the release it should retain that intersection point
				// 
				// so release is a requestAnimationFrame handler - and every frame it:
				// (1) calculates how to move the straw
				// (2) updates position of the straw
				// (3) updates intersection points of the straw 
				// 

			}.bind(this);

			this.rafID = requestAnimationFrame(release);
		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	};
	return straws;
});
