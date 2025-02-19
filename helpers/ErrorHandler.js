class ErrorHandler extends Error {
    constructor(message, chatId) {
        super(message);
        this.chatId = chatId;
        this.name = 'TelegramError';
    }
}

module.exports = {ErrorHandler}