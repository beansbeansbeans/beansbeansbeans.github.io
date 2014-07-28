define(['log/glyphs'], function(glyphs) {
    var renderer = {
        initialize: function(id) {
            this.id = id;
            this.canvasWidth = $(window).width() * 0.65;

            var naturalWordWidth = this.id.split("").reduce(function(prev, current) {
                return prev + glyphs.letters[current].width;
            }, 0);

            this.scaleFactor = (this.canvasWidth / naturalWordWidth).toFixed(3);

            this.canvasHeight = glyphs.height * this.scaleFactor * 1.5;

            this.renderLetters();
            this.renderVis();
        },
        drawSVGInCanvas: function(letters) {
            var lettersArr = letters.split("");
            lettersArr.forEach(function(d, i) {
                var cPathData = glyphs.letters[d].path;
                cPathData = cPathData.replace(/([a-z])/ig, ",$1");
                cPathData = cPathData.split(",");

                cPathData.forEach(function(d, i) {
                    var digits = d.substring(1).split(" "),
                        command = d.charAt(0);

                    if(command == "T") {
                        digits.unshift(2 * cPathData[i-1].digits[cPathData[i-1].digits.length - 1] - cPathData[i-1].digits[cPathData[i-1].digits.length - 3]);
                        digits.unshift(2 * cPathData[i-1].digits[cPathData[i-1].digits.length - 2] - cPathData[i-1].digits[cPathData[i-1].digits.length - 4]);
                        command = "Q";
                    } else if(command == "H") {
                        digits.push(cPathData[i-1].digits[cPathData[i-1].digits.length - 1]);
                        command = "L";
                    } else if(command == "V") {
                        digits.unshift(cPathData[i-1].digits[cPathData[i-1].digits.length - 2]);
                        command = "L";
                    }
                    cPathData[i] = {
                        command: command,
                        digits: digits
                    };
                });

                if(i>0) {
                    this.letterCtx.translate(glyphs.letters[lettersArr[i-1]].width, 0);
                }

                cPathData.forEach(function(d, i) {
                    if(d) {
                        if(d.command == "M") {
                            this.letterCtx.moveTo(d.digits[0], d.digits[1]);
                        } else if(d.command == "Q") {                                               this.letterCtx.quadraticCurveTo(d.digits[0], d.digits[1], d.digits[2], d.digits[3]);
                        } else if(d.command == "L") {
                            this.letterCtx.lineTo(d.digits[0], d.digits[1]);
                        } else if(d.command == "Z") {
                            this.letterCtx.lineTo(cPathData[0].digits[0], cPathData[0].digits[1]);
                        }
                    }
                }.bind(this));

                this.letterCtx.closePath();
            }.bind(this));
        },
        renderLetters: function() {
            this.letterCanvas = $("#letters"),
            this.letterCtx = this.letterCanvas[0].getContext('2d');

            this.letterCanvas[0].width = this.canvasWidth;
            this.letterCanvas[0].height = this.canvasHeight;

            this.letterCtx.shadowOffsetX = 10;
            this.letterCtx.shadowOffsetY = 10;
            this.letterCtx.shadowBlur = 20;
            this.letterCtx.shadowColor = "rgba(0, 0, 0, 0.5)";

            this.letterCtx.fillStyle = "white";

            this.letterCtx.beginPath();
            this.letterCtx.moveTo(this.canvasWidth, this.canvasHeight);
            this.letterCtx.lineTo(this.canvasWidth, 0);
            this.letterCtx.lineTo(0, 0);
            this.letterCtx.lineTo(0, this.canvasHeight);
            this.letterCtx.lineTo(this.canvasWidth, this.canvasHeight);

            this.letterCtx.translate(0, glyphs.height * this.scaleFactor + 0.5*(this.canvasHeight - (glyphs.height * this.scaleFactor)));
            this.letterCtx.scale(this.scaleFactor, -this.scaleFactor);

            this.drawSVGInCanvas(this.id);

            this.letterCtx.fill();
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
            audio.preload = true;

            $("#audio").append(audio).css("padding-top", this.canvasHeight);

            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            requestAnimationFrame(drawWave);

            function drawWave() {
                if(counter%2 == 0) {
                    var freqByteData = new Uint8Array(analyser.frequencyBinCount);
                        buffer = 10,
                        bottomBuffer = Math.floor(self.canvasHeight * 0.2),
                        space = 5,
                        offset = 100,
                        numBars = Math.round(self.canvasWidth / buffer),
                        ptsArr = [];

                    analyser.getByteFrequencyData(freqByteData),

                    ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);

                    for (var i=0; i<numBars; ++i) {
                        var magnitude = freqByteData[i + offset];
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
