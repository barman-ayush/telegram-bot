const store = require("../db/store");
const { main } = require("./transaction");
const transactionInitiator = async (bot, chatId) => {
  const sentMessage = await bot.sendMessage(
    chatId,
    "Processing your transaction...",
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "Cancel", callback_data: "cancel_transaction" }],
        ],
      },
    }
  );
  console.log("[SENT_MESSAGE] : " , sentMessage)
  const messageId = sentMessage.message_id;
  let userData = store.getUser(chatId);
  if (!userData) {
    await bot.editMessageText("Please Login", {
      chat_id: chatId,
      message_id: messageId,
    });
    await bot.deleteMessage(chatId, messageId);
}
userData.transactionMessageId = messageId;
store.setUser(chatId , userData);
main(bot , chatId, messageId)
};

const updateTransactionState = async (bot , chatId , messageId , message) => {
    await bot.editMessageText(message, {
      chat_id: chatId,
      message_id: messageId,
    });
}

module.exports = {transactionInitiator , updateTransactionState};
