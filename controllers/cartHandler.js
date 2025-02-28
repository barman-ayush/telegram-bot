const cacheStore = require("../db/redis");
const store = require("../db/store");
const {KEYBOARD_BUTTONS , MESSAGE_TEMPLATES} = require("../utils/constants")

module.exports = {
  changeQuantity: async (bot, chatId, offset, messageId) => {
    try{
      // chatId ==> unique for all user === userId
      let userData = await cacheStore.getCachedUser(chatId);
      if (!userData) {
        console.log("[INC_BOT] : user not found");
        return;
      }
      const old = userData.months;
      if (userData.months + offset > 0) {
        userData.months += offset;
        await cacheStore.cacheUser(chatId, userData);
      } else return;
  
      const { months } = userData;

  
      await bot.editMessageText(
        MESSAGE_TEMPLATES.product_cart(userData , months)
      , {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard : KEYBOARD_BUTTONS.product_1(months)
        },
      });
    }catch(e){
      console.log("[ CHANGE_QUANTITY ]" , e);
    }
  },
};
