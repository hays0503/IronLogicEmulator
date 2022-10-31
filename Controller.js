const http = require("http");
const fs = require("fs");
const { SendPost } = require("./Send");
const { CommandConstants } = require("./Commands");
const { StatusConstants } = require("./Status");
const { ControllerStateClass } = require("./ControllerState");

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

let ControllerState = new ControllerStateClass();

//
let intervalPowerOn = {};

http
	.createServer(async (request, response) => {
		if (request.url === "/user") {
			const buffers = []; // буфер для получаемых данных

			for await (const chunk of request) {
				buffers.push(chunk); // добавляем в буфер все полученные данные
			}

			//Преобразуем в Json данные которые пришли
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
					 * {ЗАПРОС}
					 * Активирует / деактивирует работу
					 * контроллера с сервером. Не активированный
					 * контроллер не передаёт события и не принимает
					 * управляющие посылки. Также сервер сообщает
					 * контроллеру,поддерживает ли он ONLINE проверку доступа.
					 */
					case CommandConstants.set_active:
						{
							console.log("\nset_active");
							ControllerState.SetActive();
							clearInterval(intervalPowerOn);
							const messages = [{ id: message.id, "success ": 1 }, Ping];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * Устанавливает параметры открывания и контроля состояния двери
					 */
					case CommandConstants.set_door_params:
						{
							console.log("\nset_door_params");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * Посылается контроллером в режиме
					 * ONLINE проверки доступа при
					 * поднесении карты к считывателю.
					 */
					case CommandConstants.check_access:
						{
							console.log("\ncheck_access");
							const messages = [
								{
									id: message.id,
									operation: CommandConstants.check_access,
									cart: "00B5009EC1A8",
									reader: 1,
								},
							];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * Удаляет все карты из памяти контроллера.
					 */
					case CommandConstants.clear_cards:
						{
							console.log("\nclear_cards");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * Удаляет карты из памяти контроллера.
					 */
					case CommandConstants.del_cards:
						{
							console.log("\ndel_cards");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * Добавляет карты в память контроллера.
					 * Если в памяти контроллера уже имеется карта
					 * с таким же номером, для этой карты обновляются
					 * флаги и временные зоны.
					 */
					case CommandConstants.add_cards:
						{
							console.log("\nadd_cards");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * Устанавливает режим работы контроллера
					 * (Норма, Свободный проход, Блокировка,
					 * Ожидание Свободного прохода).
					 */
					case CommandConstants.set_mode:
						{
							console.log("\nset_mode");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * Устанавливает параметры временной зоны контроллера.
					 */
					case CommandConstants.set_timezone:
						{
							console.log("\nset_timezone");
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {НЕ ЗАПРОС}
					 * Это Обработчик событий в котором не было каких либо команд
					 */
					case CommandConstants.none_message:
						console.log(`\n${StatusConstants.empty_message}`);
						break;
					default:
						{
							console.log(`\n${StatusConstants.undefine_message_controller}`);
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
		intervalPowerOn = setInterval(() => {
			SendPost(host, port, PowerOn);
		}, 5000);
	});
