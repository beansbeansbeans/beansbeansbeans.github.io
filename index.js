var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs");

http.createServer(function(request, response) {
	var uri = url.parse(request.url).pathname
	, filename = path.join(process.cwd(), uri);

	fs.exists(filename, function(exists) {

		if (fs.statSync(filename).isDirectory()) filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			if(request.url == "/stuff.ogg") {
				var filePath = path.join(__dirname, '/stuff.ogg');
			    var stat = fs.statSync(filePath);
				response.writeHead(200, {
					"Content-Type": "audio/ogg",
					"Content-Length": stat.size
				});
				var readStream = fs.createReadStream(filePath);
			    readStream.pipe(response);
			} else {
				response.writeHead(200);
				response.write(file, "binary");
				response.end();
			}
		});
	});

}).listen(8080);

console.log("Static file server running");
