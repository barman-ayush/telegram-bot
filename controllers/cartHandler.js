const store = require("../db/store");
const {KEYBOARD_BUTTONS , MESSAGE_TEMPLATES} = require("../utils/constants")

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

    await bot.editMessageText(
      MESSAGE_TEMPLATES.product_cart(userData , quantity , months)
    // `
    // Product : ${userData.productSelection.product_name}
    // Total Cost : ${userData.productSelection.eachCost * quantity * months}Ξ 
    // `
    , {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard : KEYBOARD_BUTTONS.product_1(months)
      },
    });
  },
};
