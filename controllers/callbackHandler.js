const product_1_selection_menu = require("./reproAccess");
const store = require("../db/store");
const { changeQuantity } = require("./cartHandler");

const callbackHandler = async (bot, query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  switch (query.data) {
    case "product_1_selection":
      await product_1_selection_menu(bot, chatId, messageId);
      // await bot.sendMessage(chatId , "Hello")
      break;
    case "ruscanpro":
      await bot.sendMessage(chatId, "RuScanPro information...");
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
    case "my_links":
      await bot.sendMessage(chatId, "Your links...");
      break;
    case "about":
      await bot.sendMessage(chatId, "About information...");
      break;
    case "contact":
      await bot.sendMessage(chatId, "Contact information...");
      break;
    case "free_bots":
      await bot.sendMessage(chatId, "Free bots information...");
      break;
    case "free_maestro":
      await bot.sendMessage(chatId, "Free Maestro Pro information...");
      break;
    case "docs":
      await bot.sendMessage(chatId, "Documentation...");
      break;
  }

  // Answer the callback query to remove the loading state
  await bot.answerCallbackQuery(query.id);
};

module.exports = callbackHandler;
