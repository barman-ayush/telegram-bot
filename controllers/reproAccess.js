const { KEYBOARD_BUTTONS, MESSAGE_TEMPLATES } = require("../utils/constants");
const store = require("../db/store");
const path = require("path");

const product_1_selection_menu = async (bot, chatId, messageId) => {
  const userData = store.getUser(chatId);
  if (!userData) await bot.sendMessage(chatId, "Please Login First");
  console.log(userData)
  userData.productSelection.product_name = "product_1"
  userData.productSelection.eachCost = 0.002
  store.setUser(chatId , userData)
  const {quantity , months} = userData.productSelection;
  await bot.editMessageText("Product 1 edited", {
    chat_id: chatId,
    message_id: messageId,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "⬅️", callback_data: "dec_bot" },
          { text: `${quantity}x product_1`, callback_data: "bot_info" },
          { text: "➡️", callback_data: "inc_bot" },
        ],
        [
          { text: "⬅️", callback_data: "dec_month" },
          { text: `${months}x Month`, callback_data: "duration_info" },
          { text: "➡️", callback_data: "inc_month" },
        ],
        [{ text: "🛒 Pay Now", callback_data: "pay_now" }],
        [{ text: "⬅️ Back", callback_data: "back_to_main" }],
      ],
    },
  });
  // await bot.sendMessage(chatId, "RuPro Access information...");
};

module.exports = product_1_selection_menu;
