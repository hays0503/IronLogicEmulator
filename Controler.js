const http = require("http");
const fs = require("fs");
const { stringify } = require("querystring");
const { SendPost } = require("./Send");

const set_active = false;

const host = "192.168.0.34";
const port = 3001;
console.log(`Сервер запущен по адресу http://${host}:${port}`);

const PowerOn = {
	id: 0,
	operation: "power_on",
	fw: "1.0.1",
	conn_fw: "2.0.2",
	active: 0,
	mode: 0,
	controller_ip: "192.168.0.34",
};

const Ping = {
	id: 0,
	operation: "ping",
	active: 1,
	mode: 0,
};

let intervalObj = {};

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
					case "set_active":
						{
							console.log("set_active");
							clearInterval(intervalObj);
							const messages = [{ id: message.id, "success ": 1 }, Ping];
							SendPost(host, port, messages);
						}
						break;
					case "set_door_params":
						{
							console.log("set_door_params");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					case "del_cards":
						{
							console.log("clear_cards");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					case "del_cards":
						{
							console.log("del_cards");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					case "add_cards":
						{
							console.log("add_cards");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					case "set_mode":
						{
							console.log("set_mode");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					case "set_timezone":
						{
							console.log("set_timezone");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					case "none_message":
						console.log(
							"Пришло пустое сообщение {Не указана операция для выполнения} "
						);
						break;
					default:
						{
							console.log(
								"Пришло пустое сообщение, которое мы не смогли обработать, Что то вышло не так, вероятно {Проверь какое сообщение приходит от контролеров} "
							);
							// const AnswerPing = [
							// 	{ id: 729568616, operation: "ping", active: 1, mode: 0 },
							// ];
							// SendPost(host, port, AnswerPing);
						}
						break;
				}
			});
		}
	})
	.listen(3000, () => {
		// intervalObj = setInterval(() => {
		//     SendPost(host, port, PowerOn);
		// }, 5000);
	});
