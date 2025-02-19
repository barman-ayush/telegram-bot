const generalMessageController = require("./controllers/generalMessage");
const callbackHandler = require("./controllers/callbackHandler");
const { bot } = require("./exports");
const store = require("./db/store");
const { isValidWalletAddress } = require("./helpers/walletAddressValidator");
const { isSpecialText } = require("./helpers/isSpecialText");
const { ErrorHandler } = require("./helpers/ErrorHandler");
const { transactionInitiator } = require("./controllers/transactionController");

// Matches "/start [whatever]"
bot.onText(/\/pay (.+)/, async (msg, match) => {
  try{
    const resp = match[1];
    const chatId = msg.chat.id;
  
    const isValid = isValidWalletAddress(resp);
    if (!isValid) throw new ErrorHandler("Please send a valid Wallet Address" , chatId)
    
    let userData = await store.getUser(chatId);
    userData.lastTransactionWalletAddress = resp;
    await store.setUser(chatId, userData);
    transactionInitiator(bot ,chatId , resp);
    
    // await bot.sendMessage(chatId , resp)
  }catch(e){
    console.log("[ /pay HANDLER ] : " , e.message)
    await bot.sendMessage(e.chatId , e.message);
  }
});

// Handle all messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  try {
    if (!isSpecialText(msg.text)) generalMessageController(bot, msg);
  } catch (e) {
    console.log("[ GENERAL MESSAGE HANDLER ]", e.message);
    await bot.sendMessage(chatId , e.message);
  }
});

// Handle button clicks
bot.on("callback_query", async (query) => {
  try {
    callbackHandler(bot, query);
  } catch (e) {
    console.log("[ QUERY HANDLER ]", e.message);
    await bot.sendMessage(chatId , e.message);
  }
});