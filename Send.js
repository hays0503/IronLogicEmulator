const https = require("http");

function SendPost(hostname, port, messages) {
	console.log("\n", messages);

	const data = JSON.stringify({
		type: "Z5RWEB",
		sn: 12345,
		messages: messages,
	});

	const options = {
		hostname: hostname,
		port: port,
		path: "/user",
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Content-Length": data.length,
			"User-Agent": "Z5R WEB",
			Accept: "*/*",
			"Accept-Encoding": "gzip, deflate, br",
			Connection: "keep-alive",
		},
	};

	const req = https.request(options, (res) => {
		console.log(`statusCode: ${res.statusCode}`);

		res.on("data", (d) => {
			process.stdout.write(d);
		});
	});

	req.on("error", (error) => {
		if (error.code == "ECONNREFUSED") {
			console.log("Не могу подключиться к устройству");
			return error;
		}
		console.error(error);
		//return error
	});

	req.write(data);
	req.end();
}

module.exports = {
	SendPost,
};
