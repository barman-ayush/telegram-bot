const KEYBOARD_BUTTONS = {
  mainMenu: [
    [{ text: "Product 1", callback_data: "product_1_selection" }],
    [{ text: "🔗 My Links", callback_data: "my_links" }],
    [
      { text: "ℹ️ About", callback_data: "about" },
      { text: "📨 Contact", callback_data: "contact" },
    ],
    [
      { text: "🎁 Free Bots", callback_data: "free_bots" },
      { text: "🎁 Free Maestro Pro", callback_data: "free_maestro" },
    ],
    [{ text: "📗 Docs", callback_data: "docs" }],
  ],
  product_1: (productName, quantity, months) => {
    const markup = [
      [
        { text: "⬅️", callback_data: "dec_bot" },
        { text: `${quantity}x ${productName}`, callback_data: "bot_info" },
        { text: "➡️", callback_data: "inc_bot" },
      ],
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

const MESSAGE_TEMPLATES = {
  mainMenu: `🛒 <b>Your selection:</b>
            └ 1x Full RuPro Access
            └ 1x Custom Bot
            └ 1x Month Access

            💰 <b>Total:</b> 0.20Ξ

            In order to proceed with your payment:
            Please send <code>0.20Ξ</code> to the address below:

            👉 <code>0x871DA0aA6a9Cc4G20F2809aEbEA818B3Ada8e92E</code>

            Once payment is detected, you will receive invite links to all channels and bots.

            ⚠️ Make sure to send Ethereum using <b>ETH</b> or <b>BASE</b> networks only.`,
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
};

module.exports = {
  MESSAGE_TEMPLATES,
  KEYBOARD_BUTTONS,
};

// 🎁 Total: ${PRODUCTS.RUPRO.price}Ξ
