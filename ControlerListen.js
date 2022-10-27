const http = require("http");
http
	.createServer(function (request, response) {
		response.end("Hello NodeJS!");
	})
	.listen(3000, "192.168.0.34", function () {
		console.log("Сервер начал прослушивание запросов");
	});
