const http = require("http");
const fs = require("fs");
const { stringify } = require("querystring");
const { SendPost } = require("./Send");

const set_active = false;

const host = "192.168.0.34";
const port = 3001;
console.log(`Сервер запущен по адресу http://${host}:${port}`);

const PowerOn = [
	{
		id: 0,
		operation: "power_on",
		fw: "1.0.1",
		conn_fw: "2.0.2",
		active: 0,
		mode: 0,
		controller_ip: "192.168.0.34"
	}
];

let intervalObj = {};

http
	.createServer(async (request, response) => {
		if (request.url === "/user") {
			const buffers = []; // буфер для получаемых данных

			for await (const chunk of request) {
				buffers.push(chunk); // добавляем в буфер все полученные данные
			}

			const body = JSON.parse(Buffer.concat(buffers).toString());
			
            //console.log(stringify(body), body.messages);
            console.log("body.messages[0].operation", body.messages[0].operation);

			switch (body.messages[0].operation) {
				case "set_active":
					{
						console.log("set_active");
						clearInterval(intervalObj);
						response.end(
							JSON.stringify({
								date: "2019-08-30 13:33:24",
								interval: 8,
								messages: [
									{
										id: 123456789,
										"success ": 1,
									},
								],
							})
						);
					}
					break;
				default:
					{
						AnswerPing = {
							type: "Z5RWEB",
							sn: 44282,
							messages: [
								{ id: 729568616, operation: "ping", active: 1, mode: 0 },
							],
						};

						response.end(JSON.stringify(AnswerPing));
					}
					break;
			}
		}
	})
	.listen(3000, () => {
        // intervalObj = setInterval(() => {
        //     SendPost(host, port, PowerOn);
        // }, 5000);
    });
