const TelegramBot = require("node-telegram-bot-api");
const nodemailer = require("nodemailer");
const rupro_access = require("./controllers/reproAccess");
// Controller Imports

// Telegram token
const token = "7345638762:AAGk9sj0ZvbwRhYKbVi1EocCh3cnneTq5to";

// Local Data Store for temporary data

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/start [whatever]"
// bot.onText(/\/start (.+)/, async (msg, match) => {
//   const chatId = msg.chat.id;
//   userData[chatId] = 0;
//   startController();
//   // await bot.sendMessage(chatId);
// });

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, async (msg, match) => {
//   const resp = match[1];
//   const chatId = msg.chat.id;

//   // Send message back to Telegram
//   await bot.sendMessage(chatId, resp);
// });

// Handle all messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  console.log("Hit here ");

  // Send photo with caption and buttons
  await bot.sendPhoto(chatId, "./image.png", {
    caption: `🛒 <b>Your selection:</b>
      └ 1x Full RuPro Access
      └ 1x Custom Bot
      └ 1x Month Access
  
      💰 <b>Total:</b> 0.20Ξ
  
      In order to proceed with your payment:
      Please send <code>0.20Ξ</code> to the address below:
  
      👉 <code>0x871DA0aA6a9Cc4G20F2809aEbEA818B3Ada8e92E</code>
  
      Once payment is detected, you will receive invite links to all channels and bots.
  
      ⚠️ Make sure to send Ethereum using <b>ETH</b> or <b>BASE</b> networks only.`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        // First row
        [
          {
            text: "🔑 RuPro Access",
            callback_data: "rupro_access",
          },
          {
            text: "🔑 RuScanPro",
            callback_data: "ruscanpro",
          },
        ],
        // Second row
        [
          {
            text: "🔗 My Links",
            callback_data: "my_links",
          },
        ],
        // Third row
        [
          {
            text: "ℹ️ About",
            callback_data: "about",
          },
          {
            text: "📨 Contact",
            callback_data: "contact",
          },
        ],
        // Fourth row
        [
          {
            text: "🎁 Free Bots",
            callback_data: "free_bots",
          },
          {
            text: "🎁 Free Maestro Pro",
            callback_data: "free_maestro",
          },
        ],
        // Fifth row
        [
          {
            text: "📗 Docs",
            callback_data: "docs",
          },
        ],
      ],
    },
  });
});

// Handle button clicks
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;

  switch (query.data) {
    case "rupro_access":
      await rupro_access(bot , chatId)
      break;
    case "ruscanpro":
      await bot.sendMessage(chatId, "RuScanPro information...");
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
});
