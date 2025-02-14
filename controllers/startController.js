module.exports = {
    startController : async(msg) => {
        const chatId = msg.chat.id;

    // Send photo with caption and buttons
    await bot.sendPhoto(chatId, "../image.png", {
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

    }

} 