define(['log/glyphs'], function(glyphs) {
    var renderer = {
        initialize: function(id) {
            this.id = id;
            this.canvasWidth = 500;
            this.canvasHeight = 400;

            this.renderLetters();
            this.renderVis();
        },
        renderLetters: function() {
            var canvas = $("#letters"),
                ctx = canvas[0].getContext('2d');

            canvas[0].width = this.canvasWidth;
            canvas[0].height = this.canvasHeight;

            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 10;
            ctx.shadowBlur = 20;
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

            ctx.fillStyle = "white";

            ctx.beginPath();
            ctx.moveTo(this.canvasWidth, this.canvasHeight);
            ctx.lineTo(0, this.canvasHeight);
            ctx.lineTo(0, 0);
            ctx.lineTo(this.canvasWidth, 0);
            ctx.lineTo(this.canvasWidth, this.canvasHeight);

            var cPathData = glyphs.c;
            cPathData = cPathData.replace(/([a-z])/ig, ",$1");
            cPathData = cPathData.split(",");

            cPathData.forEach(function(d, i) {
                var digits = d.substring(1).split(" "),
                    command = d.charAt(0);
                cPathData[i] = {
                    command: command,
                    digits: digits
                };
            });

            ctx.scale(0.15, 0.15);

            cPathData.forEach(function(d, i) {
                if(d) {
                    if(d.command == "M") {
                        ctx.moveTo(d.digits[0], d.digits[1]);
                        return;
                    }
                    if(d.command == "Q") {                                               ctx.quadraticCurveTo(d.digits[0], d.digits[1], d.digits[2], d.digits[3]);
                        return;
                    }
                    if(d.command == "T") {
                        ctx.quadraticCurveTo(cPathData[i-1].digits[cPathData[i-1].digits.length - 4], cPathData[i-1].digits[cPathData[i-1].digits.length - 3], d.digits[0], d.digits[1]);
                        return;
                    }
                    if(d.command == "L") {
                        ctx.lineTo(d.digits[0], d.digits[1]);
                        return;
                    }
                    if(d.command == "V") {
                        ctx.lineTo(cPathData[i-1].digits[cPathData[i-1].digits.length - 2], d.digits[0]);
                        return;
                    }
                    if(d.command == "Z") {
                        ctx.lineTo(cPathData[0].digits[0], cPathData[0].digits[1]);
                        return;
                    }
                }
            });

            ctx.closePath();
            ctx.fill();
        },
        renderVis: function() {
            var canvas = $("#fft"),
                ctx = canvas[0].getContext('2d'),
                audio = new Audio(),
                audioCtx = new webkitAudioContext(),
                analyser = audioCtx.createAnalyser(),
                source = audioCtx.createMediaElementSource(audio),
                counter = 0,
                self = this;

            canvas[0].width = this.canvasWidth;
            canvas[0].height = this.canvasHeight;

            ctx.shadowOffsetX = 12;
            ctx.shadowOffsetY = 5;
            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

            ctx.lineWidth = 5;
            ctx.strokeStyle = "#fff9ef";

            audio.src = this.id + ".ogg";
            audio.controls = true;

            $("#audio").append(audio).css("padding-top", this.canvasHeight);

            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            requestAnimationFrame(drawWave);

            function drawWave() {
                if(counter%2 == 0) {
                    var freqByteData = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(freqByteData),
                        buffer = 10,
                        bottomBuffer = 50,
                        space = 5,
                        offset = 100,
                        numBars = Math.round(self.canvasWidth / buffer),
                        ptsArr = [];

                    ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);

                    for (var i=0; i<numBars; ++i) {
                        var magnitude = freqByteData[i + offset] + bottomBuffer;
                        ptsArr.push(i*(space + buffer));
                        ptsArr.push(self.canvasHeight - magnitude - bottomBuffer);
                    }

                    drawCurve(ctx, ptsArr);
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
    return renderer;
});
