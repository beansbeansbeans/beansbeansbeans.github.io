define(['d3', 'underscore', 'templates/project_detail'], function(d3, _, projectTemplate) {
	var spotlights = {
		initialize: function() {
			var data = {
				identifier: "spotlights", 
				title: "Spotlights", 
				blurb: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste, enim.",
				projectContents: "<div id='sliders'></div><div id='scene'></div>",
				caption: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque aliquid nostrum quasi veniam, voluptatibus est obcaecati ipsam eum fugit necessitatibus!",
				description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi quam optio id eius doloremque aliquid excepturi pariatur dicta tempore at amet beatae asperiores quae fugit veniam, aspernatur illum aut culpa impedit cumque neque enim tenetur, dolorem dolorum eos! Eveniet, illum."
			}

			$("#view").html(projectTemplate(data));


			var svg = d3.select("#scene").append("svg")
			.attr("width", 960)
			.attr("height", 500)
			.append('g'),
			indexOfArr = function(arr1, fnd) {
				for (var i = 0, len1 = arr1.length; i < len1; i++) {
					if (!(i in arr1)) continue
						if (elementComparer(arr1[i], fnd)) return i
					}
				return -1;
			},
			elementComparer = function(fnd1, fnd2) {
				var type1 = typeof fnd1;
				var type2 = typeof fnd2;
				if (!((type1 == "number" && type2 == "number") && (fnd1 + "" == "NaN" && fnd2 + "" == "NaN"))) {
					if (type1 == "object" && fnd1 + "" != "null") {
						var len1 = fnd1.length;
						if (type2 == "object" && fnd2 + "" != "null") {
							var len2 = fnd2.length;
							if (len1 !== len2) return false
								for (var i = 0; i < len1; i++) {
									if (!(i in fnd1 && i in fnd2)) {
										if (i in fnd1 == i in fnd2) continue
											return false;
									}
									if (!elementComparer(fnd1[i], fnd2[i])) return false
								}
						}
					} else {
						if (fnd1 !== fnd2) return false
					}
			}
			return true;
		},
		dotProduct = function(vectorOne, vectorTwo) {
			return vectorOne[0]*vectorTwo[0] + vectorOne[1]*vectorTwo[1]
		},
		crossProduct = function(vectorOne, vectorTwo) {
			return vectorOne[0]*vectorTwo[1] - vectorOne[1]*vectorTwo[0]
		},
		intersectionPoints = [[80, 41.5], [80, 458.5], [880, 41.5], [880, 458.5], [720, 41.5], [240, 41.5], [400, 41.5], [560, 41.5], [385, 458.5], [548, 458.5], [400, 458.5], [650, 458.5], [800, 458.5], [190, 458.5], [350, 458.5], [580, 458.5]],
		boundingBox = {
			"leftEdge": {
				"startPoint": 0,
				"endPoint": 1
			},
			"rightEdge": {
				"startPoint": 2,
				"endPoint": 3
			},
			"topEdge": {
				"startPoint": 0,
				"endPoint": 2,
				"splitPoints": []
			},
			"bottomEdge": {
				"startPoint": 1,
				"endPoint": 3,
				"splitPoints": []
			}
		},
		hinges = [5, 6, 7, 4],
		spotlightRayBounds = [8, 9, 13, 14, 11, 12, 10, 15],
		Spotlight = function(hinge, edge1, edge2) {
			this.leftEdge = {
				"startPoint": hinge,
				"endPoint": intersectionPoints[edge1][0] > intersectionPoints[edge2][0] ? edge2 : edge1,
				"splitPoints": []
			},
			this.rightEdge = {
				"startPoint": hinge,
				"endPoint": intersectionPoints[edge1][0] > intersectionPoints[edge2][0] ? edge1 : edge2,
				"splitPoints": []
			}
		},
		spotlights = [],
		segments = [],
		polygons = [],
		cleanedPolygons = [],
		colors = d3.scale.ordinal()
		.domain([0, 1, 2, 3, 4])
		.range(["#FF7F66", "#7ECEFD", "#2185C5", "#3E454C", "#1C1D21"]),
		leftToRightTopToBottom = function(arr) {
			arr = _.sortBy(arr, function(point) {
				return intersectionPoints[point][0]
			})
			arr = _.sortBy(arr, function(point) {
				return intersectionPoints[point][1]
			})
			return arr;
		},
		extractSegments = function(edge) {
			edge.splitPoints = leftToRightTopToBottom(edge.splitPoints);
			if(edge.splitPoints.length == 0) {
				segments.push({
					"startPoint": edge.startPoint,
					"endPoint": edge.endPoint
				})
			}
			else {
				edge.splitPoints.forEach(function(d, i) {
					if(i == 0 && edge.splitPoints.length == 1) {
						segments.push({
							"startPoint": edge.startPoint,
							"endPoint": d
						})
						segments.push({
							"startPoint": d,
							"endPoint": edge.endPoint
						})
					}
					else if (i == 0) {
						segments.push({
							"startPoint": edge.startPoint,
							"endPoint": d
						})
					}
					else if(i == edge.splitPoints.length - 1) {
						segments.push({
							"startPoint": edge.splitPoints[i-1],
							"endPoint": d
						})
						segments.push({
							"startPoint": d,
							"endPoint": edge.endPoint
						})
					}
					else if(i == edge.splitPoints.length) return
						else {
							segments.push({
								"startPoint": edge.splitPoints[i-1],
								"endPoint": d
							})
						}
					})
			}
		},
		liesInBox = function(point) {
			if(point[0] >= intersectionPoints[boundingBox.leftEdge.startPoint][0] && point[0] <= intersectionPoints[boundingBox.rightEdge.startPoint][0] && point[1] >= intersectionPoints[boundingBox.leftEdge.startPoint][1] && point[1] <= intersectionPoints[boundingBox.leftEdge.endPoint][1]) {
				point[0] = Math.round(point[0] * 10) / 10;
				point[1] = Math.round(point[1] * 10) / 10;
				return point;
			}
			else return [];
		},
		midpointBetween = function(point1, point2) {
			var midpoint = [];
			        midpoint.push(((point2[0] - point1[0]) / 2) + point1[0]) // x value
			        midpoint.push(((point2[1] - point1[1]) / 2) + point1[1]) // y value
			        return midpoint
			    },
			    slopeOf = function(startPoint, endPoint) {
			    	return (endPoint[1] - startPoint[1]) / (endPoint[0] - startPoint[0])
			    },
			    bOf = function(slope, point) {
			    	return point[1] - (slope*point[0])
			    },
			    intersects = function(line1, line2) {
			    	var intersection = [],
			    	line1M = Math.round(slopeOf(intersectionPoints[line1.startPoint], intersectionPoints[line1.endPoint]) * 100) / 100,
			    	line2M = Math.round(slopeOf(intersectionPoints[line2.startPoint], intersectionPoints[line2.endPoint]) * 100) / 100,
			    	line1B = Math.round(bOf(line1M, intersectionPoints[line1.startPoint]) * 100) / 100,
			    	line2B = Math.round(bOf(line2M, intersectionPoints[line2.startPoint]) * 100) / 100;
			    	if( line1M == line2M ) return
			    		else if( line1M == Number.POSITIVE_INFINITY || line1M == Number.NEGATIVE_INFINITY ) intersection[0] = line2.endPoint[0]
			    			else if( line2M == Number.POSITIVE_INFINITY || line2M == Number.NEGATIVE_INFINITY ) intersection[0] = line1.endPoint[0]
			    				else intersection[0] = (line2B - line1B) / (line1M - line2M)
			    					intersection[1] = line1M * intersection[0] + line1B;
			    				return liesInBox(intersection);
			    			},
			    			segmentCounter = 0,
			    			initializePolygon = function(segmentCounter, endPoint, startPoint) {
			    				polygons[segmentCounter] = {"depth": 0, "points": []};
			    				polygons[segmentCounter].points.push(endPoint);
			    				polygons[segmentCounter].points.push(startPoint);
			    				generatePolygon(segments[segmentCounter], endPoint, startPoint)
			    			},
			    			generatePolygon = function(currentSegment, endPoint, startPoint) {
			    				var candidates = [], internalSegmentCounter = 0;
			    				for(var segment in segments) {
			    					if (segments.indexOf(segments[segment]) !== segmentCounter) {
			    						if(segments[segment].startPoint == startPoint || segments[segment].endPoint == startPoint) candidates.push(segments[segment])
			    					}
			    			}
			    			candidates.forEach(function(d, i) {
			    				var pointA = intersectionPoints[endPoint],
			    				pointB = intersectionPoints[startPoint],
			    				pointC = d.startPoint == startPoint ? intersectionPoints[d.endPoint] : intersectionPoints[d.startPoint],
			    				vectorAB = [pointB[0] - pointA[0], pointB[1] - pointA[1]],
			    				vectorBC = [pointC[0] - pointB[0], pointC[1] - pointB[1]],
			    				ABDotBC = dotProduct(vectorAB, vectorBC),
			    				ABCrossBC = crossProduct(vectorAB, vectorBC),
			    				lengthVectorAB = Math.sqrt(Math.pow(pointB[0] - pointA[0], 2) + Math.pow(pointB[1] - pointA[1], 2)),
			    				lengthVectorBC = Math.sqrt(Math.pow(pointC[0] - pointB[0], 2) + Math.pow(pointC[1] - pointB[1], 2)),
			    				threePointAngle = Math.acos(ABDotBC/(lengthVectorAB*lengthVectorBC)) * 57.296;
			    				if(threePointAngle && ABCrossBC < 0) candidates[i].angle = 180 - threePointAngle;
			    				else candidates[i].angle = 1000;
			    			})
			    			candidates = _.sortBy(candidates, function(candidate) {
			    				return candidate.angle
			    			});
			        if(candidates[0].angle == 1000) { //wrong handedness
			        	polygons.pop();
			        	initializePolygon(segmentCounter, startPoint, endPoint)
			        }
			        else { //in the middle of a polygon
			        	var winningPoint = candidates[0].startPoint == startPoint ? candidates[0].endPoint : candidates[0].startPoint;
			        	if(polygons[segmentCounter].points.indexOf(winningPoint) == -1) {
			        		internalSegmentCounter++;
			        		polygons[segmentCounter].points.push(winningPoint);
			        		generatePolygon(internalSegmentCounter, startPoint, winningPoint)
			        	}
			          else { //we've reached the end of a polygon
			          	if(segmentCounter == segments.length - 1) return
			          		else {
			          			segmentCounter++;
			          			initializePolygon(segmentCounter, segments[segmentCounter].endPoint, segments[segmentCounter].startPoint)
			          		}
			          	}
			          }
			      },
			      generatePolygonData = function() {
			      	polygons = [];
			      	segments = [];
			      	cleanedPolygons = [];
			      	segmentCounter = 0;
			      	intersectionPoints.splice(16);
			      	spotlights.forEach(function(d, i) {
			      		d.leftEdge.splitPoints = [];
			      		d.rightEdge.splitPoints = [];
			      	});
			      	boundingBox.topEdge.splitPoints = [];
			      	boundingBox.bottomEdge.splitPoints = [];

			      	intersectionPoints.forEach(function(d, i) {
			      		if(d[1] == 41.5 && d[0] !== 80 && d[0] !== 880) boundingBox.topEdge.splitPoints.push(i)
			      			if(d[1] == 458.5 && d[0] !== 80 && d[0] !== 880) boundingBox.bottomEdge.splitPoints.push(i)
			      		});
			      	extractSegments(boundingBox.topEdge)
			      	extractSegments(boundingBox.bottomEdge);
			      	segments.push({
			      		"startPoint": boundingBox.leftEdge.startPoint,
			      		"endPoint": boundingBox.leftEdge.endPoint
			      	})
			      	segments.push({
			      		"startPoint": boundingBox.rightEdge.startPoint,
			      		"endPoint": boundingBox.rightEdge.endPoint
			      	})

			      	for( var i=0; i<spotlights.length; i++) {
			      		for( var j=i+1; j<spotlights.length; j++) {

			      			if(indexOfArr(intersectionPoints, intersects(spotlights[i].leftEdge, spotlights[j].leftEdge)) == -1 && intersects(spotlights[i].leftEdge, spotlights[j].leftEdge).length > 0) {
			      				intersectionPoints.push(intersects(spotlights[i].leftEdge, spotlights[j].leftEdge));
			      				spotlights[i].leftEdge.splitPoints.push(intersectionPoints.length - 1);
			      				spotlights[j].leftEdge.splitPoints.push(intersectionPoints.length - 1);
			      			}

			      			if(indexOfArr(intersectionPoints, intersects(spotlights[i].leftEdge, spotlights[j].rightEdge)) == -1 && intersects(spotlights[i].leftEdge, spotlights[j].rightEdge).length > 0) {
			      				intersectionPoints.push(intersects(spotlights[i].leftEdge, spotlights[j].rightEdge));
			      				spotlights[i].leftEdge.splitPoints.push(intersectionPoints.length - 1);
			      				spotlights[j].rightEdge.splitPoints.push(intersectionPoints.length - 1);
			      			}

			      			if(indexOfArr(intersectionPoints, intersects(spotlights[i].rightEdge, spotlights[j].leftEdge)) == -1 && intersects(spotlights[i].rightEdge, spotlights[j].leftEdge).length > 0) {
			      				intersectionPoints.push(intersects(spotlights[i].rightEdge, spotlights[j].leftEdge));
			      				spotlights[i].rightEdge.splitPoints.push(intersectionPoints.length - 1);
			      				spotlights[j].leftEdge.splitPoints.push(intersectionPoints.length - 1);
			      			}

			      			if(indexOfArr(intersectionPoints, intersects(spotlights[i].rightEdge, spotlights[j].rightEdge)) == -1 && intersects(spotlights[i].rightEdge, spotlights[j].rightEdge).length > 0) {
			      				intersectionPoints.push(intersects(spotlights[i].rightEdge, spotlights[j].rightEdge));
			      				spotlights[i].rightEdge.splitPoints.push(intersectionPoints.length - 1);
			      				spotlights[j].rightEdge.splitPoints.push(intersectionPoints.length - 1);
			      			}

			      		}
			      	}

			        // uncomment for debugging: 
			        // updateIntersectionPoints(intersectionPoints)
			        
			        spotlights.forEach(function(d, i) {
			        	extractSegments(d.leftEdge);
			        	extractSegments(d.rightEdge);
			        })
			        
			        initializePolygon(segmentCounter, segments[segmentCounter].endPoint, segments[segmentCounter].startPoint);
			        cleanedPolygons.push(polygons[i])
			        for(i=0; i<polygons.length; i++) { 
			        	var flag = true;
			        	for(j=0; j<cleanedPolygons.length; j++) {
			        		var testPol = _.clone(polygons[i].points),
			        		testCleanedPol = _.clone(cleanedPolygons[j].points);
			        		if(testPol.sort().toString() === testCleanedPol.sort().toString()) flag = false;
			        	}
			        	if(flag) cleanedPolygons.push(polygons[i])
			        }
			    cleanedPolygons.forEach(function(d, i) {
			    	var depth = 0,
			    	intermediatePoint = midpointBetween(intersectionPoints[d.points[1]], intersectionPoints[d.points[2]]),
			    	testPoint = midpointBetween(intersectionPoints[d.points[0]], intermediatePoint);
			    	spotlights.forEach(function(spotlight, index) {
			    		var testM = slopeOf(intersectionPoints[spotlight.leftEdge.startPoint], testPoint),
			    		testB = bOf(testM, testPoint),
			    		testIntersectionX = (intersectionPoints[spotlight.leftEdge.endPoint][1] - testB)/testM;
			    		if(testIntersectionX >= intersectionPoints[spotlight.leftEdge.endPoint][0] && testIntersectionX <= intersectionPoints[spotlight.rightEdge.endPoint][0]) depth++
			    	})
			    	d.depth = depth;
			    })
			},
			updateIntersectionPoints = function(pointsData) {
				var renderedPoints = svg.selectAll("text").data(pointsData);

				renderedPoints
				.text(function(d, i) {
					return i
				})
				.attr("x", function(d, i) {
					return d[0]
				})
				.attr("y", function(d, i) {
					return d[1]
				})

				renderedPoints.enter().append("text")
				.text(function(d, i) {
					return i
				})
				.attr("x", function(d, i) {
					return d[0]
				})
				.attr("y", function(d, i) {
					return d[1]
				})

				renderedPoints
				.text(function(d, i) {
					return i
				})
				.attr("x", function(d, i) {
					return d[0]
				})
				.attr("y", function(d, i) {
					return d[1]
				})

				renderedPoints.exit().remove()

			},
			updateSpotlights = function(spotlightData) {
			        //spotlightData will be the spotlights object
			        var renderedSpotlights = svg.selectAll("path").data(spotlightData);

			        // update (the only relevant operation, I think)
			        renderedSpotlights.attr("d", function(d, i) {
			        	return "M" + intersectionPoints[d.leftEdge.startPoint][0] + " " + intersectionPoints[d.leftEdge.startPoint][1] + "L" + intersectionPoints[d.leftEdge.endPoint][0] + " " + intersectionPoints[d.leftEdge.endPoint][1] + "L" + intersectionPoints[d.rightEdge.endPoint][0] + " " + intersectionPoints[d.rightEdge.endPoint][1] + "z"
			        })

			        // enter (this is needed, but it will only happen once)
			        renderedSpotlights.enter().append("path")
			        .attr("stroke", "none")
			        .attr("fill", "#F7E967")
			        .attr("fill-opacity", .5)
			        .attr("d", function(d, i) {
			        	return "M" + intersectionPoints[d.leftEdge.startPoint][0] + " " + intersectionPoints[d.leftEdge.startPoint][1] + "L" + intersectionPoints[d.leftEdge.endPoint][0] + " " + intersectionPoints[d.leftEdge.endPoint][1] + "L" + intersectionPoints[d.rightEdge.endPoint][0] + " " + intersectionPoints[d.rightEdge.endPoint][1] + "z"
			        })
			    },
			    updatePolygons = function(polygonData) {
			    	var renderedPolygons = svg.selectAll("polygon").data(polygonData);

			        // update
			        renderedPolygons
			        .attr("fill", function(d, i) {
			        	return colors(d.depth)
			        })
			        .attr("points", function(d, i) {
			        	var pointString = "";
			        	d.points.forEach(function(point, index) {
			        		pointString += intersectionPoints[point][0];
			        		pointString += ",";
			        		pointString += intersectionPoints[point][1];
			        		pointString += " "
			        	})
			        	return pointString;
			        })

			        // enter
			        renderedPolygons.enter().append("polygon")
			          // .attr("stroke", "white")
			          // .attr("stroke-width", 1)
			          .attr("fill", function(d, i) {
			          	return colors(d.depth)
			          })
			          .attr("clip-path", "url(#myClip)")
			          .attr("points", function(d, i) {
			          	var pointString = "";
			          	d.points.forEach(function(point, index) {
			          		pointString += intersectionPoints[point][0];
			          		pointString += ",";
			          		pointString += intersectionPoints[point][1];
			          		pointString += " "
			          	})
			          	return pointString;
			          })

			        // enter and update

			        // exit
			        renderedPolygons.exit().remove();

			    },
			    initialize = function() {

			    	svg.append("defs").append("clipPath")
			    	.attr("id", "myClip")
			    	.append("circle")

			    	svg.append("line")
			    	.attr("stroke", "#222222")
			    	.attr("stroke-width", "1")
			    	.attr("x1", 0)
			    	.attr("y1", 0)
			    	.attr("x2", 960)
			    	.attr("y2", 500)

			    	svg.append("line")
			    	.attr("stroke", "#222222")
			    	.attr("stroke-width", "1")
			    	.attr("x1", 960)
			    	.attr("y1", 0)
			    	.attr("x2", 0)
			    	.attr("y2", 500)

			    	svg.append("rect")
			    	.attr("x", 160)
			    	.attr("y", 83)
			    	.attr("width", 640)
			    	.attr("height", 333)
			    	.attr("stroke", "#222222")
			    	.attr("stroke-width", 1)
			    	.attr("fill", "white");

			    	function handleSlider(i, range) {
			    		$("#" + i + "[type=range]").on("change", function() {
			    			var leftIndex = spotlightRayBounds[i*2],
			    			rightIndex = spotlightRayBounds[i*2 + 1];
			    			intersectionPoints[leftIndex][0] = parseInt(this.value) - range;
			    			intersectionPoints[rightIndex][0] = parseInt(this.value) + range;
			    			updateSpotlights(spotlights)
			    			generatePolygonData();
			    			updatePolygons(cleanedPolygons)
			    		})         
			    	}
			    	for( var i = 0; i < spotlightRayBounds.length / 2; i++ ) {
			    		spotlights[i] = new Spotlight(hinges[i], spotlightRayBounds[i*2], spotlightRayBounds[i*2 + 1]);
			    		var spotlightHalfRange = .5 * (intersectionPoints[spotlights[i].rightEdge.endPoint][0] - intersectionPoints[spotlights[i].leftEdge.endPoint][0]),
			    		min = 85 + spotlightHalfRange + i,
			    		max = 875 - spotlightHalfRange - i,
			    		value = intersectionPoints[spotlights[i].leftEdge.endPoint][0] + spotlightHalfRange;
			    		$("#sliders").append("<input type='range' id='" + i + "' min='" + min + "' max='" + max + "' value='" + value + "'>");
			    		handleSlider(i, spotlightHalfRange)
			    	};

			    };
			    initialize();
			    updateSpotlights(spotlights);
			    generatePolygonData();
			    updatePolygons(cleanedPolygons);

			    (function() {
			    	var width = 845;
			    	var height = 467;
			    var r = 38; // radius of the balls
			    var dt = 0.5;
			    var a = -0.2;

			    var x = 118;
			    var vx = 4;
			    var h = height - r;
			    var y = 300;
			    var vy = 0;

			    function updateX() {
			    	x = x + vx * dt;
			    	if (x > width) {
			    		x = width;
			    		vx = -vx;
			    	}
			    	if (x < 118) {
			    		vx = -vx;
			    		x = 118;
			    	}
			    }

			    function updateY() {
			    	vy += a * dt;
			    	y += vy * dt;

			    	if (y < r) {
			    		vy = -vy;
			    		y = r;
			    	}
			    }

			    var ball = svg.select("defs").select("circle")
			    ball.attr('cx', x)
			    .attr("r", r);

			    function update() {
			    	updateX();
			    	updateY();
			    	ball.attr('cx', x);
			    	ball.attr('cy', height - y);
			    }

			    function start() {
			    	update();
			    	setInterval(update, 10);
			    }

			    start();
			})();


		}
	};
	return spotlights;
});