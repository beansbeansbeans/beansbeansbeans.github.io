define(['templates/log_detail'], function(logTemplate) {
	var stuff = {
		initialize: function() {
			var data = {
				title: "stuff",
				logContents: '<canvas id="myCanvas" width="400" height="400" style="border:1px solid #000"></canvas>'
			};

			$("#view").html(logTemplate(data));

			with( document.getElementById( 'myCanvas' ).getContext( '2d' ) ){

			  fillStyle = '#F88';
			  
			  shadowOffsetX = 10;
			  shadowOffsetY = 10;  
			  shadowBlur = 20;  
			  shadowColor = "rgba(0, 0, 0, .75)";          

			  translate( 50, 70 );
			  scale( 2, 2 );

			  beginPath();

			    // Draw huge anti-clockwise box
			    moveTo(  1000,  1000 );
			    lineTo( -1000,  1000 );
			    lineTo( -1000, -1000 );
			    lineTo(  1000, -1000 );
			    lineTo(  1000,  1000 );
			              
			    // Draw a small clockwise heart-shape
			    moveTo( 75, 40 );
			    bezierCurveTo(  75,   37,  70,   25,  50,   25 );
			    bezierCurveTo(  20,   25,  20, 62.5,  20, 62.5 );
			    bezierCurveTo(  20,   80,  40,  102,  75,  120 );
			    bezierCurveTo( 110,  102, 130,   80, 130, 62.5 );
			    bezierCurveTo( 130, 62.5, 130,   25, 100,   25 );
			    bezierCurveTo(  85,   25,  75,   37,  75,   40 );
			    
			  closePath();

			  fill();

			}
		}
	}
	return stuff;
});