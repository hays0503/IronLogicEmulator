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

let intervalPing = {};

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
				ControllerState.addNewMessage(message);

				const operation = message?.operation
					? message.operation
					: "none_message";

				let data = new Date();
				console.log(`\n--------${data.toUTCString()}--------`);
				console.log("\nСообщение которое прислали", message);
				console.log(`\n[${ControllerState.messageID}] Операция`, operation);

				switch (operation) {
					/**
					 * {ЗАПРОС}
					 * 2.1 SET_ACTIVE
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
					 * 2.2 OPEN_DOOR
					 * Вызывает срабатывание выходного каскада в заданном направлении.
					 */
					case CommandConstants.open_door:
						{
							console.log("\nopen_door");
							ControllerState.OpenDoor(message.direction);
							console.log(
								"ControllerState.open_door: ",
								ControllerState.open_door
							);
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * 2.3 SET_MODE
					 * Устанавливает режим работы контроллера
					 * (Норма, Свободный проход, Блокировка,
					 * Ожидание Свободного прохода).
					 */
					case CommandConstants.set_mode:
						{
							console.log("\nset_mode");
							ControllerState.set_mode(message.mode);
							console.log("ControllerState.set_mode: ", ControllerState.mode);
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * 2.4 SET_TIMEZONE
					 * Устанавливает параметры временной зоны контроллера.
					 */
					case CommandConstants.set_timezone:
						{
							console.log("\nset_timezone");
							ControllerState.SetTimezone(
								message.zone,
								message.begin,
								message.end,
								message.days
							);
							console.log(
								"ControllerState.set_timezone: ",
								ControllerState.zone,
								ControllerState.begin,
								ControllerState.end,
								ControllerState.days
							);
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * 2.5 SET_DOOR_PARAMS
					 * Устанавливает параметры открывания и контроля состояния двери
					 */
					case CommandConstants.set_door_params:
						{
							console.log("\nset_door_params");
							ControllerState.SetDoorParams(
								message.open,
								message.open_control,
								message.close_control
							);
							console.log(
								"ControllerState.set_door_params: ",
								ControllerState.open,
								ControllerState.open_control,
								ControllerState.close_control
							);
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * 2.6 ADD_CARDS
					 * Добавляет карты в память контроллера.
					 * Если в памяти контроллера уже имеется карта
					 * с таким же номером, для этой карты обновляются
					 * флаги и временные зоны.
					 */
					case CommandConstants.add_cards:
						{
							console.log("\nadd_cards");
							ControllerState.AddCards(message.carts);
							console.log("ControllerState.add_cards: ", ControllerState.cards);
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * 2.7 DEL_CARDS
					 * Удаляет карты из памяти контроллера.
					 */
					case CommandConstants.del_cards:
						{
							console.log("\ndel_cards");
							ControllerState.DelCards(message.carts);
							console.log("ControllerState.del_cards: ", ControllerState.cards);
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
					/**
					 * {ЗАПРОС}
					 * 2.8 CLEAR_CARDS
					 * Удаляет все карты из памяти контроллера.
					 */
					case CommandConstants.clear_cards:
						{
							console.log("\nclear_cards");
							ControllerState.ClearCards();
							console.log(
								"ControllerState.clear_cards: ",
								ControllerState.cards
							);
							const messages = [{ id: message.id, "success ": 1 }];
							SendPost(host, port, messages);
						}
						break;
//////////////////////////////////////////////////////////////////////////////////////////////////
					/**
					 * {ЗАПРОС}
					 * Посылается контроллером в режиме
					 * ONLINE проверки доступа при
					 * поднесении карты к считывателю.
					 */
					case CommandConstants.check_access:
						{
							console.log("\ncheck_access");
							ControllerState.check_access();
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
					 * {НЕ ЗАПРОС}
					 * Это Обработчик событий в котором не было каких либо команд
					 */
					case CommandConstants.none_message:
						console.log(`\n${StatusConstants.empty_message}`);
						break;
					default:
						{
							console.log(`\n${StatusConstants.undefine_message_controller}`);
						}
						break;
				}
			});
		}
	})
	.listen(3000, () => {
		intervalPowerOn = setInterval(() => {
			SendPost(host, port, [PowerOn]);
		}, 5000);

		intervalPing = setInterval(() => {
			SendPost(host, port, [Ping]);
		}, 5000);
	});
