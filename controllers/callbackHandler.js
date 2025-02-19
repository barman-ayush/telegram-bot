const product_1_selection_menu = require("./reproAccess");
const { changeQuantity } = require("./cartHandler");
const {
  KEYBOARD_BUTTONS,
  MESSAGE_TEMPLATES,
  MessageTimeoutInSeconds,
} = require("../utils/constants");
const { currentUserTransactionControllerState } = require("./transaction");

const callbackHandler = async (bot, query) => {
  if (Date.now() / 1000 - query.message.date > MessageTimeoutInSeconds) {
    console.log("Old Query");
    await bot.sendMessage(
      query.message.chat.id,
      `
Please Start a new Conversation

Enter /start to start a new chat 

Enter /help for help
      `
    );
    return;
  }


  // Below are the details of the message from which inline elements where clicked 
  // That triggered this callback function
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  console.log("[ QUERY ]" , query);

  switch (query.data) {
    case "product_1_selection":
      await product_1_selection_menu(bot, chatId, messageId);
      break;
    case "dec_bot":
      await changeQuantity(bot, chatId, -1, messageId, true);
      break;
    case "inc_bot":
      await changeQuantity(bot, chatId, +1, messageId, true);
      break;
    case "dec_month":
      await changeQuantity(bot, chatId, -1, messageId, false);
      break;
    case "inc_month":
      await changeQuantity(bot, chatId, +1, messageId, false);
      break;
    case "pay_now":
      await bot.sendMessage(
        chatId,
        `
Send You Wallet Address which you will use to pay in the following format : 

/pay <sender_wallet_address>

Eg . 

/pay 0xE140E27184806217656F1e5E1f576b0885294563
      `
      );
      // await transactionInitiator(bot , chatId);
      break;
    case "back_to_main":
      await bot.editMessageText(
        MESSAGE_TEMPLATES.mainMenu(query.from.username),
        {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: KEYBOARD_BUTTONS.mainMenu,
          },
        }
      );
      break;
    case "my_links":
      await bot.sendMessage(chatId, "Your links...");
      break;
    case "about":
      await bot.sendMessage(chatId, "About information...");
      break;
    case "contact":
      await bot.sendMessage(chatId, "Contact information...");
      break;
    case "cancel_transaction":
      currentUserTransactionControllerState.destroy();
      break
  }

  // Answer the callback query to remove the loading state
  await bot.answerCallbackQuery(query.id);
};

module.exports = callbackHandler;
