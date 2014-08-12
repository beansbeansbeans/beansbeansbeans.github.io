define(['templates/project_detail'], function(projectTemplate) {
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
			    range = 100,
			    prefixedTransform = getVendorPrefix("transform");

			function getVendorPrefix(property) {
				var vendors = ['', 'webkit', 'Moz', 'O', 'ms'];
				var prop = String(property);
				vendors.every(function (vendor, index) {
					if (index > 0) {
						prop = vendor + property.charAt(0).toUpperCase() + property.slice(1);
					}
					return typeof document.body.style[prop] === 'undefined';
				});
				return prop;
			}

			function move(e) {
			  if(lastPosition) {
			    var delta = e.pageY - lastPosition;
			    if(Math.abs(currentPosition - startingPosition) < range) {
				    currentPosition += delta;
				    $(e.target).css(prefixedTransform, "translateY(" + currentPosition + "px)");
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

			/*
			BEGIN ANIMATION CODE
			 */
			
			var leaves = [
				{
					path: [[500, 0], [150, 200], [550, 350], [150, 550], [450, 650]],
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
						strokeColor: 'red'
					}
				},
				{
					path: [[-50, -50], [450, 100], [120, 350], [580, 550], [150, 650]],
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
						strokeColor: 'pink'
					}
				},
				{
					path: [[380, -80], [580, 200], [220, 300], [500, 500], [10, 750]],
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
						strokeColor: 'green'
					}
				},
				{
					path: [[500, 0], [180, 100], [480, 350], [175, 450], [300, 600]],
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
						strokeColor: 'blue'
					}
				}
			];

			function renderBezier(ctx, segments, xMod, yMod) {
				ctx.beginPath();
				ctx.strokeStyle = "white";
				ctx.lineWidth = 3;
				ctx.moveTo(segments[0].point[0] + xMod, segments[0].point[1] + yMod);
				segments.forEach(function(point, index) {
					var nextIndex = (index+1)%segments.length;
					ctx.bezierCurveTo(
						point.point[0] + point.handleOut[0] + xMod, 
						point.point[1] + point.handleOut[1] + yMod, 
						segments[nextIndex].point[0] + segments[nextIndex].handleIn[0] + xMod, 
						segments[nextIndex].point[1] + segments[nextIndex].handleIn[1] + yMod, 
						segments[nextIndex].point[0] + xMod, 
						segments[nextIndex].point[1] + yMod
					);
				});
				ctx.stroke();
				ctx.closePath();
			}

			function getBoundingBox(ctx, segments) {
				var alphaThreshold = 15,
					minX = Infinity,
					minY = Infinity,
					maxX = -Infinity,
					maxY = -Infinity,
					width = ctx.canvas.width,
					height = ctx.canvas.height;
				
				ctx.save();
				ctx.strokeStyle = '#000';
				ctx.lineWidth = 1;

				renderBezier(ctx, segments, 0, 0);
				var data = ctx.getImageData(0, 0, width, height).data;

				for(var x=0; x<width; x++) {
					for(var y=0; y<height; y++) {
						var alpha = data[(width*y + x) * 4 + 3];
						if(alpha > alphaThreshold) {
							if (x > maxX) maxX = x;
							if (x < minX) minX = x;
							if (y > maxY) maxY = y;
							if (y < minY) minY = y;
						}
					}
				}

				ctx.clearRect(0, 0, width, height);

				ctx.restore();

				return {
					x: minX,
					y: minY,
					width: maxX - minX,
					height: maxY - minY
				}
			}

			function drawSprite(ctx, clippingCtx, index, destX, destY, flipFlag) {
				var path = leaves[index].animatable,
					sourceX = flipFlag ? (canvasTemp.width - path.boundingBox.width) : 0,
					sourceY = path.spriteY,
					sourceWidth = path.boundingBox.width,
					sourceHeight = path.boundingBox.height;

				ctx.drawImage(clippingCtx.canvas, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, sourceWidth, sourceHeight);
			}

			function drawSegment(segmentObj, debugColor) {
				canvases.forEach(function(canvas, canvasIdx) {
					canvas.ctx.save();
					canvas.ctx.strokeStyle = debugColor;
					canvas.ctx.beginPath();
					canvas.ctx.moveTo(segmentObj.startPoint[0] - (canvasIdx * canvasWidth), segmentObj.startPoint[1]);
					canvas.ctx.lineTo(segmentObj.endPoint[0] - (canvasIdx * canvasWidth), segmentObj.endPoint[1]);
					canvas.ctx.stroke();
					canvas.ctx.restore();
				});
			}

			function getLocationAt(hypoteneuse, segmentObj) {
				return {
					x: segmentObj.startPoint[0] + (hypoteneuse * Math.cos(segmentObj.angle)),
					y: segmentObj.startPoint[1] + (hypoteneuse * Math.sin(segmentObj.angle))
				}
			}

			var canvasWidth = 100,
				canvasHeight = 500,
				canvases = [],
				canvasTemp = document.createElement("canvas"),
				ctxTemp = canvasTemp.getContext('2d');

			[].forEach.call(document.querySelectorAll("canvas"), function(d) {
				canvases.push({
					node: d,
					ctx: d.getContext('2d')
				});
				canvases[canvases.length - 1].node.width = canvasWidth;
				canvases[canvases.length - 1].node.height = canvasHeight;
			});

			function createSpritesheet() {
			 	
			 	canvasTemp.width = canvasTemp.height = 1000;

				leaves.forEach(function(d) {
					var boundingBox = getBoundingBox(ctxTemp, d.animatable.segments);

					d.animatable.segments.forEach(function(point) {
						point.point[0] -= boundingBox.x;
						point.point[1] -= boundingBox.y;
					});

					d.animatable.boundingBox = {
						width: boundingBox.width,
						height: boundingBox.height
					}
				});

				canvasTemp.width = 2 * Math.max.apply(Math, leaves.map(function(d) {
					return d.animatable.boundingBox.width;
				}));

				canvasTemp.height = leaves.reduce(function(previous, current) {
					return previous + current.animatable.boundingBox.height;
				}, 0);

				var yModAccumulator = 0;

				leaves.forEach(function(d, i) {
					var yMod = (i > 0) ? yModAccumulator += leaves[i-1].animatable.boundingBox.height : 0;

					leaves[i].animatable.spriteY = yMod;

					renderBezier(ctxTemp, d.animatable.segments, 0, yMod);

					ctxTemp.save();
					ctxTemp.translate(canvasTemp.width, 0);
					ctxTemp.scale(-1, 1);
					renderBezier(ctxTemp, d.animatable.segments, 0, yMod);
					ctxTemp.restore();
				});

				// document.body.appendChild(canvasTemp); //DEBUG
			}

			function createSegmentObjects() {
				leaves.forEach(function(d, i) {
					var leafWidth = leaves[i].animatable.boundingBox.width;
					leaves[i].segments = [];
					leaves[i].path.forEach(function(point, pointIdx) {
						if(pointIdx < (leaves[i].path.length - 1)) {

							var startPoint = leaves[i].path[pointIdx],
								endPoint = leaves[i].path[pointIdx + 1],
								segmentAngle = Math.atan2(endPoint[1] - startPoint[1], endPoint[0] - startPoint[0]),
								projectionX = leafWidth * Math.cos(segmentAngle),
								projectionY = leafWidth * Math.sin(segmentAngle);

							leaves[i].segments.push({
								tanAngle: Math.atan((endPoint[1] - startPoint[1])/(endPoint[0] - startPoint[0])),
								angle: segmentAngle,
								intersectionPoint: [startPoint[0], startPoint[1]],
								startPoint: [startPoint[0] - projectionX, startPoint[1] - projectionY],
								endPoint: [endPoint[0] + projectionX, endPoint[1] + projectionY],
								length: Math.floor(Math.sqrt(Math.pow((endPoint[1] + projectionY) - (startPoint[1] - projectionY), 2) + Math.pow((endPoint[0] + projectionX) - (startPoint[0] - projectionX), 2)))
							});
						}
					});
				});
			}

			function drawSegmentObjects() {
				leaves.forEach(function(d, i) {
					d.segments.forEach(function(segment, segmentIdx) {
						drawSegment(segment, d.animatable.strokeColor)
					});
				})
			}

			function createClippingRegions() {
				leaves.forEach(function(d, i) {
					d.clippingRegion = document.createElement("canvas");
					// document.body.appendChild(d.clippingRegion); // DEBUG
					d.clippingRegion.width = canvasWidth * canvases.length;
					d.clippingRegion.height = canvasHeight;
					d.clippingRegionCtx = d.clippingRegion.getContext('2d');

					var maskSegments = [];

					d.segments.forEach(function(segment, segmentIdx) {
						segment.direction = (segment.angle >= (Math.PI / 2)) ? 1 : -1;
						if(segmentIdx == 0) {
							segment.abovePoint = [segment.intersectionPoint[0], segment.intersectionPoint[1] - d.animatable.boundingBox.height];
							segment.belowPoint = [segment.intersectionPoint[0], segment.intersectionPoint[1] + d.animatable.boundingBox.height];
						} else {
							var angleDiff = Math.abs((Math.abs(segment.tanAngle) - Math.abs(d.segments[segmentIdx - 1].tanAngle))) / 2,
								multiplier = (Math.abs(segment.tanAngle) > Math.abs(d.segments[segmentIdx - 1].tanAngle)) ? Math.abs(d.segments[segmentIdx - 1].tanAngle) / d.segments[segmentIdx - 1].tanAngle : Math.abs(segment.tanAngle) / segment.tanAngle;

							if(!multiplier) multiplier = 1;

							segment.abovePoint = [segment.intersectionPoint[0] - (Math.sin(angleDiff * multiplier) * d.animatable.boundingBox.width), segment.intersectionPoint[1] - (Math.cos(angleDiff * multiplier) * d.animatable.boundingBox.width)];
							segment.belowPoint = [segment.intersectionPoint[0] + (Math.sin(angleDiff * multiplier) * d.animatable.boundingBox.width), segment.intersectionPoint[1] + (Math.cos(angleDiff * multiplier) * d.animatable.boundingBox.width)];
						}
					});

					var negativeDirectionSegments = d.segments.filter(function(segment) {
						return segment.direction != d.segments[0].direction;
					});

					negativeDirectionSegments.sort(function(a, b) {
						return a.intersectionPoint[1] - b.intersectionPoint[1];
					});

					var positiveDirectionSegments = d.segments.filter(function(segment) {
						return segment.direction == d.segments[0].direction && segment != d.segments[0];
					});

					positiveDirectionSegments.sort(function(a, b) {
						return b.intersectionPoint[1] - a.intersectionPoint[1];
					});
					
					maskSegments.push(d.segments[0].abovePoint);
					negativeDirectionSegments.forEach(function(d) {
						maskSegments.push(d.abovePoint);
						maskSegments.push(d.belowPoint);
					});

					maskSegments.push([d.segments[d.segments.length - 1].endPoint[0], d.segments[d.segments.length - 1].endPoint[1] + d.animatable.boundingBox.width]);
					maskSegments.push([d.segments[d.segments.length - 1].endPoint[0], d.segments[d.segments.length - 1].endPoint[1] - d.animatable.boundingBox.width]);

					positiveDirectionSegments.forEach(function(d) {
						maskSegments.push(d.belowPoint);
						maskSegments.push(d.abovePoint);
					});

					maskSegments.push(d.segments[0].belowPoint);

					d.clippingRegionCtx.beginPath();
					d.clippingRegionCtx.moveTo(maskSegments[0][0], maskSegments[0][1]);

					maskSegments.forEach(function(point, pointIdx) {
						d.clippingRegionCtx.lineTo(maskSegments[(pointIdx + 1) % maskSegments.length][0], maskSegments[(pointIdx + 1) % maskSegments.length][1]);
					});

					// d.clippingRegionCtx.stroke();
					d.clippingRegionCtx.clip();
				});
			}

			function createTrackers() {
				leaves.forEach(function(leaf, leafIdx) {
					leaf.frontTracker = {};
					leaf.frontTracker.currentSegment = 0;
					leaf.frontTracker.currentPosition = 0;
					leaf.frontTracker.pastThreshold = false;
					leaf.frontTracker.moving = true;

					leaf.flipTracker = {};
					leaf.flipTracker.currentSegment = (leaf.segments.length % 2 == 0) ? leaf.segments.length - 1 : leaf.segments.length - 2;
					leaf.flipTracker.currentPosition = leaf.segments[leaf.flipTracker.currentSegment].length;
					leaf.flipTracker.pastThreshold = true;
					leaf.flipTracker.moving = true;
				});
			}

			createSpritesheet();

			createSegmentObjects();

			drawSegmentObjects();

			createClippingRegions();

			createTrackers();

			/*
			RAF
			 */

			var pixelsPerFrame = 2,
				self = this;

			function animate() {

				leaves.forEach(function(d, i) {
					d.clippingRegionCtx.clearRect(0, 0, d.clippingRegion.width, d.clippingRegion.height);
				});

				canvases.forEach(function(canvas, canvasIdx) {
					canvases[canvasIdx].ctx.clearRect(0, 0, canvases[canvasIdx].node.width, canvases[canvasIdx].node.height);
				});

				leaves.forEach(function(d, i) {

					if (d.frontTracker.currentPosition <= d.segments[d.frontTracker.currentSegment].length) {
						d.frontTracker.currentPosition += pixelsPerFrame;
					} else {
						d.frontTracker.moving = false;
					}

					if (d.flipTracker.currentPosition <= d.segments[d.flipTracker.currentSegment].length) {
						d.flipTracker.currentPosition += pixelsPerFrame;
					} else {
						d.flipTracker.moving = false;
					}

					if (!d.frontTracker.pastThreshold && d.frontTracker.currentPosition >= (d.segments[d.frontTracker.currentSegment].length - (d.animatable.boundingBox.width * 2))) {
						d.frontTracker.pastThreshold = true;
						d.flipTracker.currentSegment = (d.frontTracker.currentSegment + 1) % (d.segments.length);
						d.flipTracker.currentPosition = 0;
						d.flipTracker.pastThreshold = false;
						d.flipTracker.moving = true;
					}

					if (!d.flipTracker.pastThreshold && d.flipTracker.currentPosition >= (d.segments[d.flipTracker.currentSegment].length - (d.animatable.boundingBox.width * 2))) {
						d.flipTracker.pastThreshold = true;
						d.frontTracker.currentSegment = (d.flipTracker.currentSegment + 1) % (d.segments.length);
						d.frontTracker.currentPosition = 0;
						d.frontTracker.pastThreshold = false;
						d.frontTracker.moving = true;
					}
					
					var frontLocation = getLocationAt(d.frontTracker.currentPosition, d.segments[d.frontTracker.currentSegment]),
						flipLocation = getLocationAt(d.flipTracker.currentPosition, d.segments[d.flipTracker.currentSegment]);

					if(d.frontTracker.moving) {
						d.clippingRegionCtx.translate(frontLocation.x, frontLocation.y);
						d.clippingRegionCtx.rotate(d.segments[d.frontTracker.currentSegment].angle);
						drawSprite(d.clippingRegionCtx, ctxTemp, i, -d.animatable.boundingBox.width / 2, -d.animatable.boundingBox.height / 2);
						d.clippingRegionCtx.rotate(-d.segments[d.frontTracker.currentSegment].angle);
						d.clippingRegionCtx.translate(-frontLocation.x, -frontLocation.y);
						canvases.forEach(function(canvas, canvasIdx) {
							if(frontLocation.x >= ((canvasIdx * canvasWidth) - d.animatable.boundingBox.width / 2) && frontLocation.x <= ((canvasIdx * canvasWidth) + canvasWidth + d.animatable.boundingBox.width / 2)) {
								// copy in-memory canvas to DOM canvas
								canvas.ctx.drawImage(d.clippingRegion, 0 + (canvasIdx * canvasWidth), 0, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
							}
						})
					}

					if(d.flipTracker.moving) {
						d.clippingRegionCtx.translate(flipLocation.x, flipLocation.y);
						d.clippingRegionCtx.rotate(Math.PI + d.segments[d.flipTracker.currentSegment].angle);
						drawSprite(d.clippingRegionCtx, ctxTemp, i, -d.animatable.boundingBox.width / 2, -d.animatable.boundingBox.height / 2, true);
						d.clippingRegionCtx.rotate(-(Math.PI + d.segments[d.flipTracker.currentSegment].angle));
						d.clippingRegionCtx.translate(-flipLocation.x, -flipLocation.y);

						canvases.forEach(function(canvas, canvasIdx) {
							if(flipLocation.x >= ((canvasIdx * canvasWidth) - d.animatable.boundingBox.width / 2) && flipLocation.x <= ((canvasIdx * canvasWidth) + canvasWidth + d.animatable.boundingBox.width / 2)) {
								// copy in-memory canvas to DOM canvas
								canvas.ctx.drawImage(d.clippingRegion, 0 + (canvasIdx * canvasWidth), 0, canvasWidth, canvasHeight, 0, 0, canvasWidth, canvasHeight);
							}
						});
					}
				});

				// drawSegmentObjects();
				self.rafID = requestAnimationFrame(animate);

			}

			this.rafID = requestAnimationFrame(animate);

		},
		destroy: function() {
			window.cancelAnimationFrame(this.rafID);
		}
	};
	return leaves;
})