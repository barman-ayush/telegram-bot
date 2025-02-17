const { KEYBOARD_BUTTONS, MESSAGE_TEMPLATES } = require("../utils/constants");
const store = require("../db/store");
const path = require("path");

const product_1_selection_menu = async (bot, chatId, messageId) => {
  const userData = store.getUser(chatId);
  if (!userData) await bot.sendMessage(chatId, "Please Login First");
  console.log(userData)
  userData.productSelection.product_name = "CA Predictor"
  userData.productSelection.eachCost = 0.002
  store.setUser(chatId , userData)
  const {quantity , months} = userData.productSelection;
  await bot.editMessageText(MESSAGE_TEMPLATES.product_cart(userData , 1 , 1), {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: KEYBOARD_BUTTONS.product_1()
    },
  });
};

module.exports = product_1_selection_menu;
