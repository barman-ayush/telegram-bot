// src/index.js
const { config } = require("./config");
const { TransactionMonitor } = require("./TransactionMonitor");
const { ethers } = require("ethers");


// Centralised transaction class 
// This will be made for a single user 
// main() will run for every transaction


class TransactionController{
    constructor(chatId){
        this.bot = null;   
        this.chatId = null;    
        this.TransactionMonitorInstance = null; 
    }
    
    setInstanceParameters(bot , chatId){
        this.bot = bot;
        this.chatId = chatId;    
    }

    async destroy(){
        this.TransactionMonitorInstance.destroy();
    }

    async main(senderAddress ,messageId) {
        // await bot.editMessageText("🔄 Starting payment verification system...", {
        //     chat_id: chatId,
        //     message_id: messageId,
        // });

        // Not storing message Id here 
        // Message Id will change for a current user 
        // storing it will update old messages rather than new ones
        const {bot, chatId} = this;
    
        const monitor = new TransactionMonitor(config.rpcUrl, bot, chatId, messageId);
        this.TransactionMonitorInstance = monitor;
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
    
        // const senderAddress =  "0xFdBA275E47e3B56A5B5b0dC6765CAdB2D178e21e";
        if (!senderAddress || !ethers.isAddress(senderAddress)) {
            await bot.editMessageText(
                "❌ Invalid sender address provided\n", {
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
}


const currentUserTransactionControllerState = new TransactionController()


module.exports = { currentUserTransactionControllerState };