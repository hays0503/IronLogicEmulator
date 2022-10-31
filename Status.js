const undefine_message_server = `Пришло пустое сообщение,
которое мы не смогли обработать,
Что то вышло не так, вероятно
{Проверь какое сообщение приходит от контролеров}`;
const undefine_message_controller = `Пришло пустое сообщение,
которое мы не смогли обработать,
Что то вышло не так, вероятно
{Проверь какое сообщение приходит от сервера}`;
const empty_message = `Пришло пустое сообщение {Не указана операция для выполнения} `

/**
 * Простая абстракция для указания название литерала команд
 */
const StatusConstants = {
	undefine_message_server,
    undefine_message_controller,
    empty_message
};

module.exports = { StatusConstants };
