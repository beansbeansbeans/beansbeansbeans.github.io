define(['templates/log_detail'], function(logTemplate) {
	var stuff = {
		initialize: function() {
			var data = {
				title: "stuff",
				logContents: '<canvas id="myCanvas" width="400" height="400"></canvas>'
			};

			$("#view").html(logTemplate(data));

			var canvas = document.getElementById('myCanvas');
			var ctx = canvas.getContext('2d');

			ctx.fillStyle = '#Fff';

			ctx.shadowOffsetX = 10;
			ctx.shadowOffsetY = 10;  
			ctx.shadowBlur = 20;  
			ctx.shadowColor = "rgba(0, 0, 0, .75)";          

			ctx.translate( 50, 70 );
			ctx.scale( 2, 2 );

			ctx.beginPath();
			ctx.strokeStyle = "white";

			// Draw huge anti-clockwise box
			ctx.moveTo(  1000,  1000 );
			ctx.lineTo( -1000,  1000 );
			ctx.lineTo( -1000, -1000 );
			ctx.lineTo(  1000, -1000 );
			ctx.lineTo(  1000,  1000 );

			// Draw a small clockwise heart-shape
			ctx.moveTo( 75, 40 );
			ctx.bezierCurveTo(  75,   37,  70,   25,  50,   25 );
			ctx.bezierCurveTo(  20,   25,  20, 62.5,  20, 62.5 );
			ctx.bezierCurveTo(  20,   80,  40,  102,  75,  120 );
			ctx.bezierCurveTo( 110,  102, 130,   80, 130, 62.5 );
			ctx.bezierCurveTo( 130, 62.5, 130,   25, 100,   25 );
			ctx.bezierCurveTo(  85,   25,  75,   37,  75,   40 );

			ctx.closePath();

			ctx.fill();

		}
	}
	return stuff;
});