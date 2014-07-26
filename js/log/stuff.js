define(['templates/log_detail', 'log/log_renderer'], function(logTemplate, logRenderer) {
	var stuff = {
		initialize: function() {
			var data = {
				title: "stuff",
				logContents: '<canvas id="fft" width="350" height="300"></canvas><canvas id="myCanvas" width="400" height="400"></canvas>'
			};

			$("#view").html(logTemplate(data));

			logRenderer.initialize(data.title);

			var canvas = document.getElementById('myCanvas');
			var ctx = canvas.getContext('2d');

			ctx.fillStyle = '#FFF';

			ctx.shadowOffsetX = 10;
			ctx.shadowOffsetY = 10;
			ctx.shadowBlur = 20;
			ctx.shadowColor = "rgba(0, 0, 0, .5)";

			ctx.translate( -30, -70 );
			ctx.scale( 3, 3 );

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

			/*
			BEGIN WAVE
			 */

			var waveCanvas = $("#fft"),
				waveCtx = waveCanvas[0].getContext('2d'),
				waveHeight = waveCanvas[0].height,
				waveWidth = waveCanvas[0].width,
				audio = new Audio(),
				audioCtx = new webkitAudioContext(),
				analyser = audioCtx.createAnalyser(),
				source = audioCtx.createMediaElementSource(audio),
				counter = 0;

			audio.src = 'test.ogg';
			audio.controls = true;

			$("#myaudio").append(audio);

			source.connect(analyser);
			analyser.connect(audioCtx.destination);

			requestAnimationFrame(drawWave);

			function drawWave() {
				if(counter%2 == 0) {
					var freqByteData = new Uint8Array(analyser.frequencyBinCount);
					analyser.getByteFrequencyData(freqByteData);

					var buffer = 10,
						bottomBuffer = 50,
						space = 5,
						offset = 100,
						numBars = Math.round(waveWidth / buffer),
						ptsArr = [],
						shadowArr = [];

					waveCtx.clearRect(0, 0, waveWidth, waveHeight);

					for (var i=0; i<numBars; ++i) {
						var magnitude = freqByteData[i + offset] + bottomBuffer;
						ptsArr.push(i*(space + buffer));
						ptsArr.push(waveHeight - magnitude - bottomBuffer);

						shadowArr.push(i*(space + buffer) + 12);
						shadowArr.push(waveHeight - magnitude - bottomBuffer - 5);
					}

					waveCtx.shadowOffsetX = 12;
					waveCtx.shadowOffsetY = 5;
					waveCtx.shadowBlur = 12;
					waveCtx.shadowColor = "rgba(0, 0, 0, .5)";

					// waveCtx.lineWidth = 2;
					// waveCtx.strokeStyle = "rgba(0, 0, 0, 0.2)";
					// drawCurve(waveCtx, shadowArr);
					//
					waveCtx.lineWidth = 5;
					waveCtx.strokeStyle = "#fff9ef";
					drawCurve(waveCtx, ptsArr);
				}

				counter++;
				requestAnimationFrame(drawWave);
			}

			function drawCurve(ctx, ptsa) {
				ctx.beginPath();
				drawLines(ctx, getCurvePoints(ptsa));
			}

			function drawLines(ctx, pts) {
				ctx.moveTo(pts[0], pts[1]);
				for(i=2;i<pts.length-1;i+=2) ctx.lineTo(pts[i], pts[i+1]);
					ctx.stroke();
			}

			function getCurvePoints(pts) {
				var tension = 0.5,
						numOfSegments = 16;

				var _pts = [], res = [],
						x, y,
						t1x, t2x, t1y, t2y,
						c1, c2, c3, c4,
						st, t, i;

				_pts = pts.slice(0);

				_pts.unshift(pts[1]);
				_pts.unshift(pts[0]);
				_pts.push(pts[pts.length - 2]);
				_pts.push(pts[pts.length - 1]);

				for (i=2; i < (_pts.length - 4); i+=2) {
						for (t=0; t <= numOfSegments; t++) {

								t1x = (_pts[i+2] - _pts[i-2]) * tension;
								t2x = (_pts[i+4] - _pts[i]) * tension;
								t1y = (_pts[i+3] - _pts[i-1]) * tension;
								t2y = (_pts[i+5] - _pts[i+1]) * tension;

								st = t / numOfSegments;

								c1 =   2 * Math.pow(st, 3)  - 3 * Math.pow(st, 2) + 1;
								c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2);
								c3 =       Math.pow(st, 3)  - 2 * Math.pow(st, 2) + st;
								c4 =       Math.pow(st, 3)  -     Math.pow(st, 2);

								x = c1 * _pts[i]    + c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
								y = c1 * _pts[i+1]  + c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

								res.push(x);
								res.push(y);
						}
				}

				return res;
			}


		}
	}
	return stuff;
});
