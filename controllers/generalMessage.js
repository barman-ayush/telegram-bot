const { KEYBOARD_BUTTONS, MESSAGE_TEMPLATES } = require("../utils/constants");
const store = require("../db/store");

const generalMessageController = async (bot, msg) => {
  if (Date.now() / 1000 - msg.date > 1) {
    console.log("Old message");
    return;
  }
  const chatId = msg.chat.id;
  let isUserActive = store.getUser(chatId);
  console.log("General Message " , isUserActive)
  if (!isUserActive) {
    console.log("Creating User ...");
    isUserActive = {
      lastMessage: msg.message_id,
      productSelection: {quantity : 1 , product_name : "" , months : 1 , eachCost : 0},
      activeProducts: [],
    };
    store.setUser(chatId, isUserActive);
  }

  await bot.sendMessage(chatId, MESSAGE_TEMPLATES.mainMenu, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: KEYBOARD_BUTTONS.mainMenu
    }
  });

  // await bot.sendPhoto(chatId, "./image.png", {
  //   caption: MESSAGE_TEMPLATES.mainMenu,
  //   parse_mode: "HTML",
  //   reply_markup: {
  //     inline_keyboard: KEYBOARD_BUTTONS.mainMenu
  //   },
  // });
};

module.exports = generalMessageController;
