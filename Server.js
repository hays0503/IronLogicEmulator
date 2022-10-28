const http = require("http");
const fs = require("fs");
const { stringify } = require("querystring");
const { SendPost } = require("./Send");

const ping = false;

const host = "192.168.0.34";
const port = 3000;

http
	.createServer(async (request, response) => {
		if (request.url === "/user") {
			const buffers = []; // буфер для получаемых данных

			for await (const chunk of request) {
				buffers.push(chunk); // добавляем в буфер все полученные данные
			}

			const body = JSON.parse(Buffer.concat(buffers).toString());

			body.messages.map((message) => {
				console.log("body.messages[0].operation", message);

				const operation = message?.operation
					? message.operation
					: "none_message";

				switch (operation) {
					case "power_on":
						{
							console.log("Operation power_on");
							const set_active = [
								{ id: 0, operation: "set_active", active: 1, online: 0 },
							];
							SendPost(host, port, set_active);
						}
						break;
					case "none_message":
						console.log("Пришло пустое сообщение {Не указана операция для выполнения} ");
						break;
					case "ping":
						console.log(`Контролер ${message.id}  пингует сервер`);
						const  ping_answer = [{"date":"2019-08-30 13:33:24","interval":8,"messages":[]}];
						SendPost(host, port, ping_answer);
						break;
					default:
						{
							console.log(
								"Пришло пустое сообщение, которое мы не смогли обработать, Что то вышло не так, вероятно {Проверь какое сообщение приходит от контролеров} "
							);
							response.end(
								"Пришло пустое сообщение, которое мы не смогли обработать, Что то вышло не так, вероятно {Проверь какое сообщение приходит от контролеров} "
							);
						}
						break;
				}
			});
		}
	})
	.listen(3001, () => {
		console.log(`Сервер запущен по адресу http://${host}:${port}`);
		// const Ping = [
		// 	{
		// 		date: "2019-08-30 13:33:24",
		// 		interval: 8,
		// 		messages: [],
		// 	},
		// ];

		// setInterval(() => {
		// 	SendPost(host, port, Ping);
		// }, 8000);
	});
