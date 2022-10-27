const https = require("http");

const data = JSON.stringify({
	type: "Z5RWEB",
	sn: 12345,
	messages: [
		{
			id: 0,
			operation: "power_on",
			fw: "1.0.1",
			conn_fw: "2.0.2",
			active: 0,
			mode: 0,
			controller_ip: "192.168.0.34",
		},
	],
});

const options = {
	hostname: "192.168.0.34",
	port: 3000,
	path: "/todos",
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		"Content-Length": data.length,
    "User-Agent": "Z5R WEB",
    "Accept": "*/*",
    "Accept-Encoding":"gzip, deflate, br",
    "Connection":"keep-alive",
	},
};

const req = https.request(options, (res) => {
	console.log(`statusCode: ${res.statusCode}`);

	res.on("data", (d) => {
		process.stdout.write(d);
	});
});

req.on("error", (error) => {
	console.error(error);
});

req.write(data);
req.end();
