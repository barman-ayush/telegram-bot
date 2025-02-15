const TelegramBot = require("node-telegram-bot-api");

module.exports = {
  bot: new TelegramBot("7345638762:AAGk9sj0ZvbwRhYKbVi1EocCh3cnneTq5to", {
    polling: {
      params: {
        offset: -1,
        timeout: 30,
      },
      interval: 2000,
      autoStart: true,
    },
  }),
};
