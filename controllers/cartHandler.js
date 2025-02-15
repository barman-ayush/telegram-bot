const store = require("../db/store");

module.exports = {
  changeQuantity: async (bot, chatId, offset, messageId, isQuantity) => {
    // chatId ==> unique for all user === userId
    let userData = store.getUser(chatId);
    if (!userData) {
      console.log("[INC_BOT] : user not found");
      return;
    }
    if (isQuantity && userData.productSelection.quantity + offset > 0) {
      userData.productSelection.quantity += offset;
      store.setUser(chatId, userData);
    } else if (!isQuantity && userData.productSelection.months + offset > 0) {
      userData.productSelection.months += offset;
      store.setUser(chatId, userData);
    } else return;

    const { quantity, months } = userData.productSelection;

    await bot.editMessageText(`
    Product : ${userData.productSelection.product_name}
    Total Cost : ${userData.productSelection.eachCost * quantity * months}Ξ 
    `, {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "⬅️", callback_data: "dec_bot" },
            {
              text: `${quantity}x ${userData.productSelection.product_name}`,
              callback_data: "bot_info",
            },
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
  },
};
