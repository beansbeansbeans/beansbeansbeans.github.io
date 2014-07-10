define(['paper', 'underscore', 'templates/project_detail'], function(paper, _, projectTemplate) {
	var leaves = {
		initialize: function() {
			var data = {
				identifier: "leaves",
				title: "Leaves",
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque, perspiciatis!",
				projectContents: '<div id="scene"><canvas id="canvas_0"></canvas><canvas id="canvas_1"></canvas><canvas id="canvas_2"></canvas><canvas id="canvas_3"></canvas><canvas id="canvas_4"></canvas><canvas id="canvas_5"></canvas></div>',
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, cumque!",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, veritatis consequatur suscipit labore minima quisquam numquam nemo harum, inventore laboriosam."
			};

			$("#view").html(projectTemplate(data));

			var lastPosition,
			    currentPosition,
			    startingPosition,
			    range = 100;

			function move(e) {
			  if(lastPosition) {
			    var delta = e.pageY - lastPosition;
			    if(Math.abs(currentPosition - startingPosition) < range) {
				    currentPosition += delta;
				    $(e.target).css("-webkit-transform", "translateY(" + currentPosition + "px)");
			    }
			  }
			  lastPosition = e.pageY;
			}

			function handleDragStart() {
				startingPosition = parseInt($(this).attr("data-current-transform"));
			  	currentPosition = startingPosition;
				$("body").on("mousemove", move);
			}

			function handleDragEnd() {
			  $("body").off("mousemove");
			  lastPosition = undefined;
			  $(this).attr("data-current-transform", currentPosition);
			}

			$("canvas").each(function(i, d) {
			  $(d).attr("data-current-transform", 0);
			  $(d).on("mousedown", handleDragStart);
			  $(d).on("mouseup", handleDragEnd);
			});

			paper.setup(document.getElementById("canvas_0"));

			window.globals = {
				viewWidth: 100,
				viewHeight: 500,
				leaves: [
				{
					path: [[300, -100], [800, 100], [100, 500], [800, 850], [0, 900]],
					animatable: {
						segments: [
							{
								point: [50, 20], 
								handleIn: [0, 0], 
								handleOut: [-20, 47.5]
							},
							{
								point: [52.5, 110], 
								handleIn: [-17.5, -40], 
								handleOut: [-10, -5]
							},
							{
								point: [32.5, 67.5], 
								handleIn: [2.5, 22.5], 
								handleOut: [-20, 40]
							},
							{
								point: [90, 140], 
								handleIn: [-57.5, -5],
								handleOut: [-32.5, -17.5]
							},
							{
								point: [47, 55], 
								handleIn: [85, -10],
								handleOut: [-5, -10]
							},
							{
								point: [50, 20], 
								handleIn: [-5, 20], 
								handleOut: [0, 0]
							}
						],
						strokeColor: "#FAFAFF"
					}
				},
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
						strokeColor: "#FAFAFF"
					}
				},
				{
					path: [[1050, -50], [200, 300], [800, 600], [350, 900], [1050, 1100]],
					animatable: {
						segments: [
							{
								point: [37.5, 20.5],
								handleIn: [0, 0],
								handleOut: [41.25, -30]
							},
							{
								point: [146.25, 37.5],
								handleIn: [-15, -15],
								handleOut: [-45, 33]
							},
							{
								point: [40, 30],
								handleIn: [43.75, 51],
								handleOut: [-15, 0]
							},
							{
								point: [2, 40],
								handleIn: [18.75, -7.5],
								handleOut: [48.75, -28]
							},
							{
								point: [114, 24.3],
								handleIn: [-3.75, -2],
								handleOut: [-22.5, -11.25]
							},
							{
								point: [37.5, 21],
								handleIn: [22.5, -7.5],
								handleOut: [0, 0]
							}
						],
						strokeColor: "#FAFAFF"
					}
				},
				{
					path: [[-50, 200], [500, 300], [50, 600], [900, 700], [500, 1050]],
					animatable: {
						segments: [
							{
								point: [70, 2.5],
								handleIn: [0, 0],
								handleOut: [-45, 15]
							},
							{
								point: [32.5, 125],
								handleIn: [-45, -42.5],
								handleOut: [-2.5, -30]
							},
							{
								point: [52.5, 50],
								handleIn: [-10, 10],
								handleOut: [-15, 40]
							},
							{
								point: [67.5, 190],
								handleIn: [-35, -57.5],
								handleOut: [-10, -20]
							},
							{
								point: [55, 150],
								handleIn: [0, 15],
								handleOut: [150, -12.5]
							},
							{
								point: [70, 2.5],
								handleIn: [-25, 35],
								handleOut: [0, 0]
							}
						],
						strokeColor: "#FAFAFF"
					}
				},
				{
					path: [[600, -100], [100, 200], [700, 300], [100, 600], [550, 700], [100, 900], [1000, 1100]],
					animatable: {
						segments: [
							{
								point: [64.13, 20.8],
								handleIn: [0, 0],
								handleOut: [-67.5, 77.65]
							},
							{
								point: [75.6, 178.75],
								handleIn: [-78.3, -3.37],
								handleOut: [-23.62, -27]
							},
							{
								point: [57.37, 107.9],
								handleIn: [-3.37, 22.5],
								handleOut: [-2.05, 36.45]
							},
							{
								point: [124.87, 220.6],
								handleIn: [-35, -30.37],
								handleOut: [-24.3, -29.7]
							},
							{
								point: [75.6, 145],
								handleIn: [6.75, 27],
								handleOut: [94.5, -57.37]
							},
							{
								point: [64.12, 20.8],
								handleIn: [-13.5, 54],
								handleOut: [0, 0]
							}
						],
						strokeColor: "#FAFAFF"
					}
				},
				{
					path: [[1050, 0], [400, 200], [800, 400], [250, 650], [600, 800], [100, 950], [950, 1050]],
					animatable: {
						segments: [
							{
								point: [78.75, 33],
								handleIn: [0, 0],
								handleOut: [6, 47.25]
							},
							{
								point: [61.5, 176.25],
								handleIn: [-90, -71.25],
								handleOut: [15, -17.25]
							},
							{
								point: [84, 76.5],
								handleIn: [1.5, 28.5],
								handleOut: [1.8, 45]
							},
							{
								point: [49.5, 199.5],
								handleIn: [47.5, -52.5],
								handleOut: [15, -6]
							},
							{
								point: [84, 165],
								handleIn: [-4.5, 7.5],
								handleOut: [75, 1.5]
							},
							{
								point: [78.75, 33],
								handleIn: [78, 63],
								handleOut: [0, 0]
							}
						],
						strokeColor: "#FAFAFF"
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

					for(i=0; i<canvasCount; i++) {

						if(leaf.group.canvasGroup && leaf.group.canvasGroup.indexOf(canvases[i].idx) > -1) {
							canvases[i].selfLeaves[leafIdx].group.visible = true;
							placeLeaf(canvases[i], leafIdx, false);
						} else {
							canvases[i].selfLeaves[leafIdx].group.visible = false;
						}

						if(leaf.flipGroup.canvasGroup && leaf.flipGroup.canvasGroup.indexOf(canvases[i].idx) > -1) {
							canvases[i].selfLeaves[leafIdx].flipGroup.visible = true;
							placeLeaf(canvases[i], leafIdx, true);
						} else {
							canvases[i].selfLeaves[leafIdx].flipGroup.visible = false;
						}

						canvases[i].view.draw();

					}
				});

				window.webkitRequestAnimationFrame(animate);
			}

			window.webkitRequestAnimationFrame(animate);

			/*
			BEGIN PAPERSCRIPT
			 */

			var canvases = [];
			var canvasCount = 5;

			for(i=0; i<canvasCount; i++) {
				canvases[i] = new paper.Project(document.getElementById("canvas_" + (i+1)));
				canvases[i].idx = (i + 1);
				canvases[i].selfLeaves = [];
				canvases[i].view.viewSize = [window.globals.viewWidth, window.globals.viewHeight];
			}

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

				for(i=0; i<canvasCount; i++) {
					canvases[i].selfLeaves[leafIdx] = {};
					canvases[i].selfLeaves[leafIdx].group = leaf.group.clone();
					canvases[i].selfLeaves[leafIdx].group.rotate(leaf.group.currentRotation * -1);
					canvases[i].selfLeaves[leafIdx].flipGroup = leaf.flipGroup.clone();
					canvases[i].selfLeaves[leafIdx].flipGroup.rotate(leaf.flipGroup.currentRotation * -1);
					canvases[i].selfLeaves[leafIdx].mask = leaf.path.mask.clone();
					canvases[i].selfLeaves[leafIdx].mask.segments = canvases[i].selfLeaves[leafIdx].mask.segments.map(function(d) {
						return {
							x: d.point.x - (canvases[i].idx - 1) * window.globals.viewWidth,
							y: d.point.y
						}
					});

					canvases[i].activeLayer.addChild(new paper.Group({
						children: [canvases[i].selfLeaves[leafIdx].mask, canvases[i].selfLeaves[leafIdx].group, canvases[i].selfLeaves[leafIdx].flipGroup],
						clipped: true
					}));
				}

			})

		}
	};
	return leaves;
})