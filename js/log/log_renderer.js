define(['log/glyphs', 'lib/d3'], function(glyphs, d3) {

    var ticker = (function() {
            var start = 0,
                tickerRAFID,
                pausedAt = 0,
                circumference,
                elapsed,
                update = function() {
                    elapsed = Date.now() - start + pausedAt;
                    var ratio = elapsed / (length * 1000);
                    $("circle").attr("stroke-dasharray", (ratio * circumference) + " 1000");
                    if(ratio > 1) {
                        $("#controls #toggler").removeClass("playing").addClass("paused");
                        $("circle").attr("stroke-dasharray", "0 1000");
                        pausedAt = 0;
                        start = 0;
                        renderer.reset();
                    } else {
                        tickerRAFID = requestAnimationFrame(update);
                    }
                };

            return {
                reset: function() {
                    start = 0;
                    pausedAt = 0;
                    window.cancelAnimationFrame(tickerRAFID);
                },
                tick: function() {
                    if(typeof circumference === 'undefined') { 
                        circumference = 2 * $("circle").attr("r") * Math.PI;
                    }
                    start = Date.now();
                    tickerRAFID = requestAnimationFrame(update);
                },
                pause: function() {
                    pausedAt = elapsed;
                    window.cancelAnimationFrame(tickerRAFID);
                }
            }
        })(),
        iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
        length,
        startedAt,
        buffer,
        pausedAt = 0,
        isPlaying,
        audioCtx = window.webkitAudioContext ? new webkitAudioContext() : new AudioContext(),
        source,
        analyser = audioCtx.createAnalyser(),
        colors = ["#2BBFBD", "#F2B33D", "#F29B30", "#F22E2E", "#F2385A", "#F5A503", "#56D9CD", "#3AA1BF", "#FC4349", "#ec4911"];

    var renderer = {
        reset: function() {
            pausedAt = 0;
            source.stop(0);
            isPlaying = false;
        },
        initialize: function(data) {
            if(data.overrides) {
                this.overrides = data.overrides;
            }

            var widthScale = d3.scale.linear().domain([400, 2000]).range([0.95, 0.6]).clamp(true);
            var wordXStretch = widthScale($(window).width()); // % of window width taken up by words

            this.id = data.title;
            length = data.length;
            this.canvasWidth = $(window).width() * wordXStretch * 2;

            var naturalWordWidth = this.id.split("").reduce(function(prev, current, index) {
                var letterWidth = glyphs.letters[current].width;

                if(data.overrides) {
                    data.overrides.forEach(function(override) {
                        if(override.index == index) {
                            letterWidth = override.width;
                            return false;
                        }
                    });
                }

                return prev + letterWidth;
            }, 0);

            this.scaleFactor = (this.canvasWidth / naturalWordWidth).toFixed(3);

            this.canvasHeight = glyphs.height * this.scaleFactor * 1.5;
            this.magnitudeScale = d3.scale.linear().domain([350, 650]).range([1, 2])(this.canvasHeight).toFixed(2);

            document.querySelector(".header").style.width = (wordXStretch * 100) + "%";
            document.querySelector(".header").style.paddingRight = (this.canvasWidth / 150) + 'px';

            this.renderLetters();
            this.renderVis();
        },
        destroy: function() {
            window.cancelAnimationFrame(this.requestID);
            ticker.pause();
            ticker.reset();
            source.stop(0);
            this.overrides = [];
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
                    if(this.overrides) {
                        var override = this.overrides.filter(function(override) {
                            return override.index == i - 1;
                        });

                        if(override.length) {
                            this.letterCtx.translate(override[0].width, 0);
                        } else {
                            this.letterCtx.translate(glyphs.letters[lettersArr[i-1]].width, 0);
                        }
                    } else {
                        this.letterCtx.translate(glyphs.letters[lettersArr[i-1]].width, 0);
                    }
                }

                cPathData.forEach(function(d, i) {
                    if(d) {
                        if(d.command == "M") {
                            this.letterCtx.moveTo(d.digits[0], d.digits[1]);
                        } else if(d.command == "Q") {
                            this.letterCtx.quadraticCurveTo(d.digits[0], d.digits[1], d.digits[2], d.digits[3]);
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
            $(".canvas-wrapper").css({
                width: this.canvasWidth / 2,
                height: this.canvasHeight / 2
            });

            this.letterCanvas = $("#letters"),
            this.letterCtx = this.letterCanvas[0].getContext('2d');

            this.letterCanvas[0].width = this.canvasWidth;
            this.letterCanvas[0].height = this.canvasHeight;

            this.letterCtx.shadowOffsetX = 12;
            this.letterCtx.shadowOffsetY = 12;
            this.letterCtx.shadowBlur = 20;
            this.letterCtx.shadowColor = "rgba(0, 0, 0, 0.4)";

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
            var request = new XMLHttpRequest();

            request.open('GET', "audio/" + this.id + ".mp3", true);
            request.responseType = 'arraybuffer';
            request.onload = function() {
                audioCtx.decodeAudioData(request.response, function(response) {
                    buffer = response;      
                    source = audioCtx.createBufferSource();
                    source.buffer = buffer;
                    source.connect(audioCtx.destination);

                    if(!iOS) {
                        isPlaying = true;
                        startedAt = Date.now();
                        source.start(0);

                        ticker.tick();

                        source.connect(analyser);
                        analyser.connect(audioCtx.destination);
                    } else {
                        isPlaying = false;
                    }

                    $("html").removeClass("loading"); 
                    this.requestID = requestAnimationFrame(drawWave);
                });
            };

            request.send();

            var canvas = $("#fft"),
                ctx = canvas[0].getContext('2d'),
                counter = 0,
                self = this;

            canvas.css("background-color", colors[Math.floor(Math.random() * colors.length)]);

            canvas[0].width = this.canvasWidth;
            canvas[0].height = this.canvasHeight;

            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 6;
            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)";

            ctx.lineWidth = 8;
            ctx.strokeStyle = "#fff9ef";

            $("#controls #toggler").on("click", function() {
                isPlaying = !isPlaying;
                if(isPlaying) {
                    $("#controls #toggler").addClass("playing").removeClass("paused");

                    source = audioCtx.createBufferSource();
                    source.buffer = buffer;
                    source.connect(audioCtx.destination);
                    source.connect(analyser);
                    analyser.connect(audioCtx.destination);
                    startedAt = Date.now() - pausedAt;
                    source.start(0, pausedAt / 1000);

                    ticker.tick();
                } else {
                    $("#controls #toggler").removeClass("playing").addClass("paused");
                    source.stop(0);
                    pausedAt = Date.now() - startedAt;
                    ticker.pause();
                }
            });

            function drawWave() {
                if(counter%2 == 0) {
                    var freqByteData = new Uint8Array(analyser.frequencyBinCount),
                        buffer = 10,
                        bottomBuffer = Math.floor(self.canvasHeight * 0.2),
                        space = 5,
                        offset = 0,
                        numBars = Math.round(self.canvasWidth / buffer),
                        ptsArr = [];

                    analyser.getByteFrequencyData(freqByteData);

                    ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);

                    for (var i=0; i<numBars; ++i) {
                        var magnitude = self.magnitudeScale * freqByteData[i + offset];
                        ptsArr.push(i*(space + buffer));
                        ptsArr.push(self.canvasHeight - magnitude - bottomBuffer);
                    }

                    drawCurve(ctx, ptsArr);
                }
                counter++;
                self.requestID = requestAnimationFrame(drawWave);
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
