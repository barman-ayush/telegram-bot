const { KEYBOARD_BUTTONS, MESSAGE_TEMPLATES } = require("../utils/constants");
const store = require("../db/store");
const path = require("path");
const cacheStore = require("../db/redis");

const product_1_selection_menu = async (bot, chatId, messageId) => {
  try{
    let userData = await cacheStore.getCachedUser(chatId);
    if (!userData) await bot.sendMessage(chatId, MESSAGE_TEMPLATES.helper);
    console.log(userData);
    // Generalise it for multipleproducts 
    userData.productId = 1;
    //Fetch the below data from database , rather than hadcoding it
    userData.productName = "CA Predictor"
    userData.cost = 0.002
    await cacheStore.cacheUser(chatId , userData);
    await bot.editMessageText(MESSAGE_TEMPLATES.product_cart(userData , 1), {
      chat_id: chatId,
      message_id: messageId,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: KEYBOARD_BUTTONS.product_1()
      },
    });
  }catch(e){
    console.log("[ PRODUCT_SELECTION ] : " , e);
  }
};

module.exports = product_1_selection_menu;
