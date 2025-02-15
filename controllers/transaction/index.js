// src/index.js
const { config } = require("./config");
const { TransactionMonitor } = require("./TransactionMonitor");
const { ethers } = require("ethers");

async function main(bot, chatId, messageId) {
    await bot.editMessageText("🔄 Starting payment verification system...", {
        chat_id: chatId,
        message_id: messageId,
    });

    const monitor = new TransactionMonitor(config.rpcUrl, bot, chatId, messageId);
    let cleanupCalled = false;

    const cleanup = async () => {
        if (!cleanupCalled) {
            cleanupCalled = true;
            await monitor.destroy();
        }
    };

    process.on("SIGINT", async () => {
        await bot.editMessageText("🛑 Received termination signal", {
            chat_id: chatId,
            message_id: messageId,
        });
        await cleanup();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        await bot.editMessageText("🛑 Received system termination signal", {
            chat_id: chatId,
            message_id: messageId,
        });
        await cleanup();
        process.exit(0);
    });

    const senderAddress = "0x31f98d2b763fef754233a10ccb404120e8b91abf";
    if (!senderAddress || !ethers.isAddress(senderAddress)) {
        await bot.editMessageText(
            "❌ Invalid sender address provided\nUsage: node src/index.js <sender-address>", {
                chat_id: chatId,
                message_id: messageId,
            }
        );
        process.exit(1);
    }

    try {
        const result = await monitor.monitorTransaction(senderAddress);

        switch (result) {
            case "FOUND_CORRECT_AMOUNT":
                await bot.editMessageText(
                    "📊 Final Result:\n" +
                    "✅ Thank you! Payment has been confirmed successfully.\n" +
                    `   Expected amount of ${config.expectedAmount} ETH or more has been received.`, {
                        chat_id: chatId,
                        message_id: messageId,
                    }
                );
                break;

            case "FOUND_INCORRECT_AMOUNT":
                await bot.editMessageText(
                    "📊 Final Result:\n" +
                    "⚠️ Payment(s) detected but with incorrect amount!\n" +
                    `   Expected: ${config.expectedAmount} ETH\n` +
                    "   Please check the transaction details above.", {
                        chat_id: chatId,
                        message_id: messageId,
                    }
                );
                break;

            case "TIMEOUT":
                await bot.editMessageText(
                    "📊 Final Result:\n" +
                    "⏰ Session timeout!\n" +
                    "   No matching transaction was found within the monitoring period.\n" +
                    "   Please retry the payment or contact support if you believe this is an error.", {
                        chat_id: chatId,
                        message_id: messageId,
                    }
                );
                break;

            default:
                await bot.editMessageText(
                    "📊 Final Result:\n" + "❓ Unexpected monitoring result", {
                        chat_id: chatId,
                        message_id: messageId,
                    }
                );
                break;
        }
    } catch (error) {
        await bot.editMessageText(
            `❌ Fatal error while monitoring transaction: ${error}`, {
                chat_id: chatId,
                message_id: messageId,
            }
        );
    } finally {
        await cleanup();
    }
}

module.exports = { main };