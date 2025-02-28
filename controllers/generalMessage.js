const { KEYBOARD_BUTTONS, MESSAGE_TEMPLATES , MessageTimeoutInSeconds } = require("../utils/constants");
const store = require("../db/store");
const cacheStore = require("../db/redis");
const db = require("../db/database")

const generalMessageController = async (bot, msg) => {
  if (Date.now() / 1000 - msg.date > MessageTimeoutInSeconds) {
    console.log("Old message");
    await bot.sendMessage(msg.chat.id , MESSAGE_TEMPLATES.helper)
    return;
  }
  const chatId = msg.chat.id;

  let isUserRegistered = await db.fetchUser(chatId);
  if(!isUserRegistered){
    isUserRegistered = {chatId , username : msg.from.username || msg.from.first_name}
    await db.createUser(isUserRegistered);
    console.log("New User Registered !!" , isUserRegistered);
  }
  const isCached = await cacheStore.getCachedUser(chatId);
  if(!isCached){
    await cacheStore.cacheUser(chatId , {msgId : msg.message_id , productName : "" , productId : 1 , months : 1 , cost : 0 , createdAt : Date.now()});
  }

  await bot.sendMessage(
    chatId,
    MESSAGE_TEMPLATES.mainMenu(),
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: KEYBOARD_BUTTONS.mainMenu,
      },
    }
  );
};

module.exports = generalMessageController;
