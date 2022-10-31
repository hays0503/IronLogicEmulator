const { on } = require("nodemon");

class ControllerStateClass {
	constructor() {
		this.type = "Z5RWEB";
		this.sn = 12345;

		this.messageID = 0;
		this.message = [];
		this.fw = "1.0.1";
		this.conn_fw = "2.0.2";
		this.active = 0;
		this.online = 0;
		this.mode = 0;
		this.controller_ip = "192.168.0.34";
		this.open_door = [false, false];
		this.zone = 0;
		this.begin = "00:00";
		this.end = "23:59";
		this.days = "11111110";
		this.open = 2;
		this.open_control = 2;
		this.close_control = 2;
		this.cards = [];
	}
	/**
	 * Активирует / деактивирует работу контроллера с сервером.
	 */
	SetActive(active, online) {
		this.active = active;
		this.online = online;
	}

	/**
	 * Вызывает срабатывание выходного
	 * каскада в заданном направлении.
	 */
	OpenDoor(direction) {
		this.open_door[direction] = true;
	}

	/**
	 * Устанавливает режим работы контроллера
	 * (Норма, Свободный проход, Блокировка,
	 * Ожидание Свободного прохода).
	 */
	SetMode(Mode) {
		this.mode = Mode;
	}

	/**
	 * Устанавливает параметры временной зоны контроллера
	 */
	SetTimezone(zone, begin, end, days) {
		this.zone = zone;
		this.begin = begin;
		this.end = end;
		this.days = days;
	}

	/**
	 * Устанавливает параметры открывания и контроля состояния двери
	 * @param {int} open время подачи сигнала открывания замка (в 1/10 секунды).
	 * @param {int} open_control время контроля открытия двери (в 1/10 секунды).
	 * @param {int} close_control  время контроля закрытия двери (в 1/10 секунды).
	 */
	SetDoorParams(open, open_control, close_control) {
		this.open = open;
		this.open_control = open_control;
		this.close_control = close_control;
	}

	/**
	 * Добавляет карты в память контроллера
	 * @param {array} cards
	 */
	AddCards(cards) {
		this.cards.concat(cards);
	}

	/**
	 * Удаляет карты из памяти контроллера.
	 * @param {array} cards массив карт для удаления, содержит номера карты в шестнадцатеричном виде
	 */
	DelCards(cards) {
		cards.map((item) => {
			this.cards = this.cards.filter((cards) => {
				return cards.card != item.card;
			});
		});
	}

	ClearCards() {
		this.cards = {};
	}

	/**
	 * Добавить новое сообщение в очередь
	 * и назначить ей идентификатор
	 */
	addNewMessage(message) {
		this.messageID++;
		this.message.push(message);
		return { messageID, message };
	}
}

module.exports = {
	ControllerStateClass,
};
