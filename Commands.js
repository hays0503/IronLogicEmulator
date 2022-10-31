const set_active = "set_active";
const set_door_params = "set_door_params";
const check_access = "check_access";
const del_cards = "del_cards";
const clear_cards = "clear_cards";
const add_cards = "add_cards";
const set_mode = "set_mode";
const set_timezone = "set_timezone";
const none_message = "none_message";
const events = "events";
const ping = "ping";
const power_on = "power_on";

/**
 * Простая абстракция для указания название литерала команд
 */
const CommandConstants = {
	set_active,
	set_door_params,
	check_access,
	del_cards,
	clear_cards,
	add_cards,
	set_mode,
	set_timezone,
	none_message,
	ping,
	events,
	power_on,
};

module.exports = { CommandConstants };
