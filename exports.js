const TelegramBot = require("node-telegram-bot-api");
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  bot: new TelegramBot("7345638762:AAGk9sj0ZvbwRhYKbVi1EocCh3cnneTq5to", {
    polling: {
      params: {
        offset: -1,
        timeout: process.env.CHAT_SESSION_EXP,
      },
      interval: 2000,
      autoStart: true,
    },
  }),
};
