const http = require("http");
const ws = require("ws");
const fs = require("fs");
const { SendPost } = require("./Send");
const { CommandConstants } = require("./Commands");
const { StatusConstants } = require("./Status");

const ping = false;

const host = "192.168.0.34";
const port = 3000;

const wss = new ws.Server({ noServer: true });

function accept(req, res) {
	// все входящие запросы должны использовать websockets
	if (
		!req.headers.upgrade ||
		req.headers.upgrade.toLowerCase() != "websocket"
	) {
		res.end();
		return;
	}

	// может быть заголовок Connection: keep-alive, Upgrade
	if (!req.headers.connection.match(/\bupgrade\b/i)) {
		res.end();
		return;
	}

	wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

function onConnect(ws) {
	ws.on("message", function (message) {
		message = message.toString()
		let name =
			message.match(/([\p{Alpha}\p{M}\p{Nd}\p{Pc}\p{Join_C}]+)$/gu) || "Гость";
		ws.send(`Привет с сервера, ${name}!`);

		setTimeout(() => ws.close(1000, "Пока!"), 5000);
	});
}

if (!module.parent) {
	http.createServer(accept).listen(3331);
} else {
	exports.accept = accept;
}

http
	.createServer(async (request, response) => {
		if (request.url === "/user") {
			const buffers = []; // буфер для получаемых данных

			for await (const chunk of request) {
				buffers.push(chunk); // добавляем в буфер все полученные данные
			}

			const body = JSON.parse(Buffer.concat(buffers).toString());

			body.messages.map((message) => {
				const operation = message?.operation
					? message.operation
					: "none_message";

				let data = new Date();
				console.log(`\n--------${data.toUTCString()}--------`);
				console.log("\nСообщение которое прислали", message);
				console.log("\nОперация", operation);

				switch (operation) {
					/**
					 * {ОТВЕТ}
					 * 1.1 POWER_ON
					 * Активирует / деактивирует работу
					 * контроллера с сервером. Не активированный
					 * контроллер не передаёт события и не принимает
					 * управляющие посылки. Также сервер сообщает
					 * контроллеру,поддерживает ли он ONLINE проверку доступа.
					 */
					case CommandConstants.power_on:
						{
							console.log(`\n${StatusConstants.power_on}`);
							const set_active = [
								{ id: 0, operation: "set_active", active: 1, online: 0 },
							];
							SendPost(host, port, set_active);
						}
						break;
					/**
					 * {ОТВЕТ}
					 * 1.2 CHECK_ACCESS
					 * Посылается контроллером в режиме
					 * ONLINE проверки доступа при
					 * поднесении карты к считывателю.
					 */
					case CommandConstants.check_access:
						{
							console.log(`\n${StatusConstants.check_access}`);
							const messages = [
								{
									id: message.id,
									operation: CommandConstants.check_access,
									granted: 1,
								},
							];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ОТВЕТ}
					 * 1.3 PING
					 * Посылается периодически при отсутствии событий.
					 */
					case CommandConstants.ping:
						console.log(`Контролер ${message.id}  пингует сервер`);
						const ping_answer = [
							{ date: "2019-08-30 13:33:24", interval: 8, messages: [] },
						];
						SendPost(host, port, ping_answer);
						break;

					/**
					 * {ОТВЕТ}
					 * 1.4 EVENTS
					 * Посылается при появлениях новых событий в контроллере.
					 * При ответе “success” = N, N событий считаются обработанными.
					 * При ответе “success” = 0 или отсутствии ответа, повторяется отправка.
					 */
					case CommandConstants.events:
						{
							console.log(`\n${StatusConstants.events}`);
							const messages = [
								{
									id: message.id,
									operation: CommandConstants.events,
									events_success: 1,
								},
							];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {НЕ ОТВЕТ}
					 * Это Обработчик событий в котором не было каких либо команд
					 */
					case CommandConstants.none_message:
						console.log(`\n${StatusConstants.empty_message}`);
						break;
					default:
						{
							console.log(`\n${StatusConstants.undefine_message_server}`);
							response.end(StatusConstants.undefine_message_server);
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
