const KEYBOARD_BUTTONS = {
  mainMenu: [
    [{ text: "Product 1", callback_data: "product_1_selection" }],
    [{ text: "🔗 My Links", callback_data: "my_links" }],
    [
      { text: "ℹ️ About", callback_data: "about" },
      { text: "📨 Contact", callback_data: "contact" },
    ],
    // [
    //   { text: "🎁 Free Bots", callback_data: "free_bots" },
    //   { text: "🎁 Free Maestro Pro", callback_data: "free_maestro" },
    // ],
    // [{ text: "📗 Docs", callback_data: "docs" }],
  ],
  cancel_markup: {
    inline_keyboard: [
      [{ text: "Cancel", callback_data: "cancel_transaction" }],
    ],
  },
  product_1: (months = 1) => {
    const markup = [
      // [
      //   { text: "⬅️", callback_data: "dec_bot" },
      //   { text: `${quantity}x ${productName}`, callback_data: "bot_info" },
      //   { text: "➡️", callback_data: "inc_bot" },
      // ],
      [
        { text: "⬅️", callback_data: "dec_month" },
        { text: `${months}x Month`, callback_data: "duration_info" },
        { text: "➡️", callback_data: "inc_month" },
      ],
      [{ text: "🛒 Pay Now", callback_data: "pay_now" }],
      [{ text: "⬅️ Back", callback_data: "back_to_main" }],
    ];
    return markup;
  },
};

const MessageTimeoutInSeconds = 10;

const MESSAGE_TEMPLATES = {
  mainMenu: (userName) => {
    const mainMenuText = `
    🌟 *Welcome to JinoLabs* 🌟
    ━━━━━━━━━━━━━━━━

    👋 Hello ${userName}!

    🤖 *Research Bots Available*
    Find the best plays with our advanced analysis tools!

    📊 *Current Access Status*
    ⚠️ No active pass detected

    ━━━━━━━━━━━━━━━━
    _Use /help to see available commands_
        `.trim();

    return mainMenuText;
  },
  product_1: `💎 Your current active products:
            No Passes or Products ⛔

            🟢 ⇒ Full RuPro Access (with 1 custom bot - 0.20Ξ for 30 Days)
            ⚪ ⇒ Single Custom Bot (0.07Ξ for 30 Days)
            ⚪ ⇒ Additional Custom Bots (0.05Ξ for 30 Days)

            🛒 Your selection:
            └ 1x Full RuPro Access
            └ 1x Custom Bot
            └ 1x Month Access

            
            Use the buttons below 👇 to make your selections:`,
  product_cart: (userData, months = 1) => {
    const totalCost = (
      userData.cost *
      months
    ).toFixed(4);

    return `
━━━━ 🛒 Order Details ━━━━

🏷️ <b>Product:</b> ${userData.productName}

⏳ <b>Duration:</b> ${months} month${months > 1 ? "s" : ""}
💰 <b>Total Cost:</b> ${totalCost}Ξ

━━━━━━━━━━━━━━━━━━━
<i>Please verify your order details</i>
`.trim();
  },
  helper : 
  `
  ✨ Welcome! ✨  
  
  🔹 Enter **/start** to begin a new chat.  
  🔹 Enter **/help** for assistance.  
  
  We're here to help—let's get started! 🚀  
  `,
  payment : 
  `
  💰 **Payment Instruction** 💰  

Please send your wallet address in the following format:  

📌 **Format:**  
/pay <your_wallet_address  

📌 **Example:**  
/pay 0xE140E27184806217656F1e5E1f576b0885294563 

Make sure to enter the correct wallet address to avoid any issues. 🚀  

  `
};

module.exports = {
  MESSAGE_TEMPLATES,
  KEYBOARD_BUTTONS,
  MessageTimeoutInSeconds,
};
