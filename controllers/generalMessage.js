const { KEYBOARD_BUTTONS, MESSAGE_TEMPLATES , MessageTimeoutInSeconds } = require("../utils/constants");
const store = require("../db/store");

const generalMessageController = async (bot, msg) => {
  if (Date.now() / 1000 - msg.date > MessageTimeoutInSeconds) {
    console.log("Old message");
    await bot.sendMessage(msg.chat.id , 
      `
Please Start a new Conversation

Enter /start to start a new chat 

Enter /help for help
      `
    )
    return;
  }
  const chatId = msg.chat.id;
  let isUserActive = store.getUser(chatId);
  console.log("General Message ", isUserActive);
  if (!isUserActive) {
    console.log("Creating User ...");
    isUserActive = {
      chatId,
      lastTransactionWalletAddress : "",
      lastMessage: msg.message_id,
      productSelection: {
        quantity: 1,
        product_name: "",
        months: 1,
        eachCost: 0,
      },
      activeProducts: [],
      transactionMessageId: 0,
      username: msg.from.username || msg.from.first_name,
    };
    store.setUser(chatId, isUserActive);
  }

  await bot.sendMessage(
    chatId,
    MESSAGE_TEMPLATES.mainMenu(isUserActive.username),
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: KEYBOARD_BUTTONS.mainMenu,
      },
    }
  );
};

module.exports = generalMessageController;
