define(['fisheye', 'lib/d3', 'templates/project_detail'], function(fisheye, d3, projectTemplate) {
	var pixels = {
		intervalID: null,
		initialize: function() {
			var data = {
				identifier: "pixels",
				title: "Pixels",
				blurb: "This is an animation of a turning head. Hover over any pixel within the animation to magnify it.",
				projectContents: '<div id="border"><div id="movie"></div></div>',
				caption: "Built with d3js, a fisheye distortion plugin for d3js, and scalable vector graphics.",
				description: "I wanted to try to apply a <a href='http://bost.ocks.org/mike/fisheye/' target='_blank'>Cartesian distortion effect</a> to a pixellated image."
			};

			$("#view").html(projectTemplate(data));

			var data,
				svg,
				size = 500,
				pixelWidth,
				transitionDuration = 500;

			$("#movie").css({
				width: size,
				height: size
			});

			$("#border").css({
				width: size + 50,
				height: size + 25
			});

			d3.json("/js/projects/pixels.json", function(nodes) {
				data = nodes;

				svg = d3.select("#movie").append("svg")
				.attr("width", size)
				.attr("height", size)
				.append("g")
				.attr("class", "pixels");

				function update(data) {

					var pixel = svg.selectAll(".pixel").data(data);
					var itemsPerRow = 20;
					pixelWidth = Math.floor(size / itemsPerRow);

					pixel.transition().duration(transitionDuration).delay(function(d, i) {
						return Math.random() * transitionDuration
					}).ease("linear").attr("fill", function(d) {
						return "rgb(" + d.r + "," + d.g + "," + d.b + ")"
					});

					pixel.enter().append("rect")
					.attr("class", "pixel")
					.attr("stroke", "white")
					.attr("stroke-width", "2")
					.attr("width", pixelWidth)
					.attr("height", pixelWidth)
					.attr("rx", 5)
					.attr("ry", 5)
					.attr("x", function(d, i) {
						return Math.floor(i / itemsPerRow) * pixelWidth
					})
					.attr("y", function(d, i) {
						return ( i % itemsPerRow ) * pixelWidth
					})
					.attr("fill", function(d) {
						return "rgb(" + d.r + "," + d.g + "," + d.b + ")"
					})

					fisheyeInit();

				}

				var i = 0;

				this.intervalID = setInterval(function() {
					update(data[i]);
					i++;
					if(i== nodes.length) i=0;
				}, transitionDuration);

			}.bind(this));

			// CARTESIAN DISTORTION
			// ====================

			var rowLen = 20, width, height, boxTest, boxes, xSteps, ySteps, boxSteps, xFisheye, yFisheye;

			var fisheyeInit = function() {
				width = size;
				height = size;

				boxes = rowLen;
				xSteps =  d3.range(0, width, width/rowLen);
				ySteps =  d3.range(0, height, height/rowLen);
				boxSteps = d3.range(boxes*boxes);

			     //set scale and origin focus
			     xFisheye = fisheye.scale(d3.scale.identity).domain([0, width]).focus(width/2).distortion(1.25);
			     yFisheye = fisheye.scale(d3.scale.identity).domain([0, height]).focus(height/2).distortion(1.25);

			     var svg = d3.select("#movie");

			     boxTest = svg.selectAll(".pixel");

			     svg.on("mousemove", function() {

			     	var mouse = d3.mouse(this);
			     	xFisheye.focus(mouse[1]); 
			     	yFisheye.focus(mouse[0]); 
			     	redraw();

			     });

			 };

			 function defaultDraw() {

			 	boxTest.transition().attr("y", function(d, i) {
			 		return ( i % rowLen ) * pixelWidth
			 	})
			 	.transition().attr("x", function(d, i) {
			 		return Math.floor(i / rowLen) * pixelWidth
			 	})
			 	.transition().attr("width", pixelWidth)
			 	.transition().attr("height", pixelWidth)

			 }

			 function redraw() { 

			 	boxTest.attr("y", function(d,i){
			 		return xFisheye(xSteps[i%rowLen]);
			 	}) 

			 	.attr("x", function(d,i){
			 		var rowNum = Math.floor(i/rowLen);
			 		return yFisheye(ySteps[rowNum-1] || 0) + (yFisheye(ySteps[rowNum]) - yFisheye(ySteps[rowNum-1] || 0))})

			 	.attr("height", function(d,i){
			 		var rowNum = Math.floor(i/rowLen);
			 		return (xFisheye(xSteps[(i+1)%rowLen] || height) - xFisheye(xSteps[i%rowLen]))})

			 	.attr("width", function(d,i){
			 		var rowNum = Math.floor(i/rowLen);
			 		return (yFisheye(ySteps[rowNum+1]|| width) - yFisheye(ySteps[rowNum]))})

			 }
			},
			destroy: function() {
				window.clearInterval(this.intervalID);
			}
		};
		return pixels;
	});