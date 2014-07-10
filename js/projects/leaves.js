define(['paper', 'underscore', 'templates/project_detail'], function(paper, _, projectTemplate) {
	var leaves = {
		initialize: function() {
			var data = {
				identifier: "leaves",
				title: "Leaves",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque, perspiciatis!",
				projectContents: '<button>click</button><div id="scene"><canvas id="canvas_0"></canvas><canvas id="canvas_1"></canvas></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, cumque!",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, veritatis consequatur suscipit labore minima quisquam numquam nemo harum, inventore laboriosam."
			};

			$("#view").html(projectTemplate(data));

			$("button").on("click", function() {
				window.console.log = function() {};
			});

			paper.setup(document.getElementById("canvas_0"));

			window.globals = {
				viewWidth: 200,
				viewHeight: 1000,
				init: function(canvas) {
					var idx = canvas.view._id.slice(7);
					canvas.view.viewSize = [this.viewWidth, this.viewHeight];
				},
				leaves: [
				{
					path: [[0, 100], [900, 150], [100, 400], [700, 700], [0, 1200]],
					animatable: {
						segments: [
							{
								point: [78, 12],
								handleIn: [0, 0],
								handleOut: [-60, 24]
							},
							{
								point: [24, 168],
								handleIn: [-48, -60],
								handleOut: [-6, -30]
							},
							{
								point: [42, 102],
								handleIn: [-18, 30],
								handleOut: [-18, 48]
							},
							{
								point: [69, 208],
								handleIn: [-62, -50],
								handleOut: [-6, -12]
							},
							{
								point: [41, 165],
								handleIn: [3, 26],
								handleOut: [128, -42]
							},
							{
								point: [78, 12],
								handleIn: [-12, 72],
								handleOut: [0, 0] 
							}
						],
						strokeColor: '#d8a76c'
					}
				}
				]
			}

			/*
			UTILITIES
			 */

			function whichCanvas(path, location) {
				var canvasArr = [],
					xPos = location.x;

				canvasArr.push(Math.ceil(xPos / window.globals.viewWidth));
				if(Math.ceil(xPos / window.globals.viewWidth) > 1) canvasArr.push(Math.ceil((xPos - (path.bounds.width / 2)) / window.globals.viewWidth));
				canvasArr.push(Math.ceil((xPos + (path.bounds.width / 2)) / window.globals.viewWidth));
				canvasArr = _.uniq(canvasArr);

				return canvasArr;
			}

			function getBoundingBoxCenter(bounds) {
				return bounds.x + bounds.width / 2;
			}

			function reverseSegments(path) {
				var centerX = getBoundingBoxCenter(path.bounds);
				return path.segments.map(function(d) {
					return new paper.Segment([centerX + (centerX - d.point.x) , d.point.y], [-d.handleIn.x, d.handleIn.y], [-d.handleOut.x, d.handleOut.y]);
				})
			}

			function reversePath(path) {
				var segments = path.segments.map(function(d) {
						return d;
					}),
					copy = path.clone();
				copy.segments = reverseSegments(path);
				return copy;
			}

			function pointer(leaf, oddFlag, flipFlag) {
				var segmentCounter = oddFlag ? 1 : 0,
					everyOtherIndexArr = [],
					leafObj = leaves[leaf],
					leafGroup = flipFlag ? leaf.flipGroup : leaf.group,
					realWidth = leaf.group.children[0].bounds.width,
					mustMove = false,
					frameCounter = 0,
					partner,
					segmentGroup = leaf.path.children;

				for(var i=segmentCounter; i < segmentGroup.length; i+=2) {
					everyOtherIndexArr.push(i);
				}

				segmentCounter = 0;

				return {
					init: function(obj) {
						partner = obj;
						var startLocation = segmentGroup[this.getCounter()].getLocationAt(0);
						leafGroup.position.x = startLocation.point.x; /* saying can't get point of null */
						leafGroup.position.y = startLocation.point.y;
					},
					setMove: function(bool) {
						mustMove = bool;
						if(bool) this.setAngle();
					},
					getMove: function() {
						return mustMove;
					},
					setFrameCounter: function(val) {
						frameCounter = val;
					},
					getFrameCounter: function() {
						return frameCounter;
					},
					incrementCounter: function() {
						segmentCounter++;
					},
					getCounter: function() {
						return everyOtherIndexArr[segmentCounter%everyOtherIndexArr.length];
					},
					setAngle: function() {
						leafGroup.rotate(leafGroup.currentRotation * -1);
						leafGroup.rotate(segmentGroup[this.getCounter()].angle * 57.3);
						leafGroup.currentRotation = segmentGroup[this.getCounter()].angle * 57.3;
					},
					moveObject: function() {
						var currentSegment = segmentGroup[this.getCounter()],
							location = currentSegment.getLocationAt(frameCounter % currentSegment.length);

						leafGroup.position.x = location.point.x;
						leafGroup.position.y = location.point.y;
						leafGroup.canvasGroup = whichCanvas(leafGroup, leafGroup.position);

						if(Math.abs(leafGroup.position.x - currentSegment.segments[1].point.x) >= 5) {
							frameCounter++;
							this.setFrameCounter(frameCounter);
						} else {
							this.setMove(false);
							this.setFrameCounter(0);
							this.incrementCounter();
						}

						if(Math.sqrt(Math.pow(leafGroup.position.x - currentSegment.segments[1].point.x, 2) + Math.pow(leafGroup.position.y - currentSegment.segments[1].point.y, 2)) <= realWidth * 2 && !partner.getMove()) {
							partner.setMove(true);
							partner.moveObject();
						} 
					}
				}
			}

			function convertToSegments(points, width) {

				var segments = [],
					angleDiff = 0,
					newAngleDiff = 0,
					multiplier = 0,
					maskSegments = [];

				for(i=0; i<points.length - 1; i++) {

					var angle = Math.atan((points[i+1][1] - points[i][1])/(points[i+1][0] - points[i][0])),
						direction = (angle >= 0) ? 1 : -1,
						xDiff = Math.cos(angle) * width * direction,
						yDiff = Math.sin(angle) * width * direction,
						newStart = [points[i][0] - xDiff, points[i][1] - yDiff],
						newFinish = [points[i+1][0] + xDiff, points[i+1][1] + yDiff];

					segments.push(new paper.Path({
						segments: [newStart, newFinish]
					}));

					var thisSegment = segments[segments.length - 1];

					thisSegment.angle = angle;
					thisSegment.direction = direction;
					thisSegment.intersectionPoint = [points[i][0], points[i][1]];

					if(i==0) {
						thisSegment.abovePoint = [thisSegment.intersectionPoint[0], thisSegment.intersectionPoint[1] - width];
						thisSegment.belowPoint = [thisSegment.intersectionPoint[0], thisSegment.intersectionPoint[1] + width];
					}

					if(i>0) {
						
						angleDiff = Math.abs((Math.abs(segments[segments.length - 1].angle) - Math.abs(segments[segments.length - 2].angle)))/2;
						multiplier = (Math.abs(segments[segments.length - 1].angle) > Math.abs(segments[segments.length - 2].angle)) ? Math.abs(segments[segments.length - 2].angle) / segments[segments.length - 2].angle : Math.abs(segments[segments.length - 1].angle) / segments[segments.length - 1].angle;

						if(!multiplier) multiplier = 1; // in case it's NaN

						thisSegment.abovePoint = [thisSegment.intersectionPoint[0] - (Math.sin(angleDiff * multiplier) * width), thisSegment.intersectionPoint[1] - (Math.cos(angleDiff * multiplier) * width)];
						thisSegment.belowPoint = [thisSegment.intersectionPoint[0] + (Math.sin(angleDiff * multiplier) * width), thisSegment.intersectionPoint[1] + (Math.cos(angleDiff * multiplier) * width)];

					}

				}

				var negativeDirectionSegments = _.chain(segments)
					.filter(function(d) {return d.direction != segments[0].direction;})
					.sortBy(function(d) {return d.intersectionPoint[1];})
					.value();

				var positiveDirectionSegments = _.chain(segments)
					.filter(function(d) {return d.direction == segments[0].direction && d != segments[0];})
					.sortBy(function(d) {return -1 * d.intersectionPoint[1];})
					.value();

				maskSegments.push(segments[0].abovePoint);

				negativeDirectionSegments.forEach(function(d) {
					maskSegments.push(d.abovePoint);
					maskSegments.push(d.belowPoint);
				});

				maskSegments.push([points[points.length - 1][0], points[points.length - 1][1] + width]);
				maskSegments.push([points[points.length - 1][0], points[points.length - 1][1] - width]);

				positiveDirectionSegments.forEach(function(d) {
					maskSegments.push(d.belowPoint);
					maskSegments.push(d.abovePoint);
				});

				maskSegments.push(segments[0].belowPoint);

				var maskGroup = new paper.Group(segments);
				maskGroup.mask = new paper.Path({
					segments: maskSegments,
					strokeColor: 'red',
					closed: true
				});

				return maskGroup;

			}

			/*
			OBJECTS INITIALIZATION
			 */

			function constructAnimatables(arr) {
				arr.forEach(function(leaf) {

					var animatable = new paper.Path({
							segments: leaf.animatable.segments,
							strokeColor: leaf.animatable.strokeColor,
							strokeWidth: 3
						}),
						bounds = new paper.Path.Rectangle({
						x: animatable.bounds.x,
						y: animatable.bounds.y,
						width: animatable.bounds.width,
						height: animatable.bounds.height
					});
					
					leaf.group = new paper.Group([animatable, bounds]);
					leaf.group.currentRotation = 0;

					leaf.flipGroup = new paper.Group([reversePath(animatable), reversePath(bounds)]);
					leaf.flipGroup.currentRotation = 0;
					
				});
			}

			function constructPaths(arr) {
				arr.forEach(function(leaf) {
					var animPath = leaf.path;
					leaf.path = convertToSegments(animPath, leaf.group.bounds.width);
					leaf.path.length = 0;
					leaf.path.children.forEach(function(d) {leaf.path.length += d.length;});
					var clippingGroup = new paper.Group([leaf.path.mask, leaf.group, leaf.flipGroup]);
				});
			}

			function constructPointers(arr) {
				arr.forEach(function(leaf) {
					leaf.forwardPointer = pointer(leaf, false, false);
					leaf.reversePointer = pointer(leaf, true, true);

					leaf.forwardPointer.init(leaf.reversePointer);
					leaf.reversePointer.init(leaf.forwardPointer);
				});
			}

			function initialize() {
				constructAnimatables(window.globals.leaves);
				constructPaths(window.globals.leaves);
				constructPointers(window.globals.leaves);
			}

			initialize();

			var counter = 0;

			function animate() {
				window.globals.leaves.forEach(function(leaf) {
					if(leaf.forwardPointer.getMove()) {
						leaf.forwardPointer.moveObject();
					}
					if(leaf.reversePointer.getMove()) {
						leaf.reversePointer.moveObject();
					}
					if(counter%leaf.path.length == 0) {
						leaf.forwardPointer.setMove(true);
						leaf.forwardPointer.moveObject();
					}
				});

				counter++;

				window.globals.leaves.forEach(function(leaf, leafIdx) {
					if(leaf.group.canvasGroup && leaf.group.canvasGroup.indexOf(canvases[0].idx) > -1) {
						canvases[0].selfLeaves[leafIdx].group.visible = true;
						placeLeaf(canvases[0], leafIdx, false);
					} else {
						canvases[0].selfLeaves[leafIdx].group.visible = false;
					}

					if(leaf.flipGroup.canvasGroup && leaf.flipGroup.canvasGroup.indexOf(scope.idx) > -1) {
						canvases[0].selfLeaves[leafIdx].flipGroup.visible = true;
						placeLeaf(canvases[0], leafIdx, true);
					} else {
						canvases[0].selfLeaves[leafIdx].flipGroup.visible = false;
					}
				});

				paper.view.draw();

				window.webkitRequestAnimationFrame(animate);
			}

			window.webkitRequestAnimationFrame(animate);

			/*
			BEGIN PAPERSCRIPT
			 */

			var canvases = [];
			canvases[0] = new paper.Project(document.getElementById("canvas_1"));
			canvases[0].idx = 1;
			canvases[0].selfLeaves = [];

			console.log("CANVASES[0]");
			console.log(canvases[0]);

			// var scope = paper.setup(document.getElementById("canvas_1"));

			console.log("scope");
			// console.log(scope);
			// console.log(scope.project);

			// scope.idx = 1;
			// scope.selfLeaves = [];
			
			placeLeaf = function(scope, leafIdx, flipFlag) {
				var selfLeaf = scope.selfLeaves[leafIdx][flipFlag ? "flipGroup" : "group"],
					globalLeaf = window.globals.leaves[leafIdx][flipFlag ? "flipGroup" : "group"];

				selfLeaf.position = [globalLeaf.position.x - (scope.idx - 1) * window.globals.viewWidth, globalLeaf.position.y];

				if(selfLeaf.currentRotation != globalLeaf.currentRotation) {
					if(selfLeaf.currentRotation) {
						selfLeaf.rotate(selfLeaf.currentRotation * -1);
					}
					selfLeaf.rotate(globalLeaf.currentRotation);
					selfLeaf.currentRotation = globalLeaf.currentRotation;
				}
			};

			window.globals.leaves.forEach(function(leaf, leafIdx) {

				canvases[0].selfLeaves[leafIdx] = {};
				canvases[0].selfLeaves[leafIdx].group = leaf.group.clone();
				canvases[0].selfLeaves[leafIdx].group.rotate(leaf.group.currentRotation * -1);
				canvases[0].selfLeaves[leafIdx].flipGroup = leaf.flipGroup.clone();
				canvases[0].selfLeaves[leafIdx].flipGroup.rotate(leaf.flipGroup.currentRotation * -1);
				canvases[0].selfLeaves[leafIdx].mask = leaf.path.mask.clone();
				canvases[0].selfLeaves[leafIdx].mask.segments = canvases[0].selfLeaves[leafIdx].mask.segments.map(function(d) {
					return {
						x: d.point.x - (canvases[0].idx - 1) * window.globals.viewWidth,
						y: d.point.y
					}
				});

				canvases[0].activeLayer.addChild(new paper.Group({
					children: [canvases[0].selfLeaves[leafIdx].mask, canvases[0].selfLeaves[leafIdx].group, canvases[0].selfLeaves[leafIdx].flipGroup],
					clipped: true
				}));

			})

			window.globals.init(canvases[0]);

		}
	};
	return leaves;
})