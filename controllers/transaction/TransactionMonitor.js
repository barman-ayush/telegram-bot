// src/TransactionMonitor.js
const { ethers } = require("ethers");
const { config } = require("./config");
const { KEYBOARD_BUTTONS } = require("../../utils/constants");

const TransactionState = {
  WAITING: "WAITING",
  FOUND_INCORRECT_AMOUNT: "FOUND_INCORRECT_AMOUNT",
  FOUND_CORRECT_AMOUNT: "FOUND_CORRECT_AMOUNT",
  TIMEOUT: "TIMEOUT",
};

class TransactionMonitor {
  constructor(rpcUrl, bot, chatId, messageId) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.startBlockNumber = 0;
    this.blocksChecked = 0;
    this.isDestroyed = false;
    this.foundTransactions = [];
    this.bot = bot;
    this.chatId = chatId;
    this.messageId = messageId;
    this.realTimeMessageId = null;
  }

  async monitorTransaction(senderAddress) {
    await this.bot.editMessageText(
      "🚀 Initializing Transaction Monitor...\n📝 Validating inputs...",
      {
        chat_id: this.chatId,
        message_id: this.messageId,
        parse_mode: "HTML",
        reply_markup: KEYBOARD_BUTTONS.cancel_markup,
      }
    );

    if (!ethers.isAddress(senderAddress)) {
      throw new Error("Invalid sender address format");
    }

    const criteria = {
      recipientAddress: config.recipientAddress,
      senderAddress: senderAddress,
      expectedAmount: config.expectedAmount,
      maxBlocksToWait: config.maxBlocksToWait,
    };

    const expectedAmountWei = ethers.parseEther(criteria.expectedAmount);
    const network = await this.provider.getNetwork();
    this.startBlockNumber = await this.provider.getBlockNumber();

    await this.bot.editMessageText(
      `💰 Expected amount: ${criteria.expectedAmount} ETH\n\n` +
        `🌐 Network: ${network.name}\n` +
        `🔗 Chain ID: ${network.chainId}\n\n` +
        `🔍 Transaction Details:\n` +
        `   From: ${criteria.senderAddress}\n` +
        `   To: ${criteria.recipientAddress}\n` +
        `   Monitoring for ${criteria.maxBlocksToWait} blocks\n\n` +
        `⏳ Waiting for transaction...`,
      {
        chat_id: this.chatId,
        message_id: this.messageId,
      }
    );

    return new Promise((resolve, reject) => {
      let isResolved = false;

      const blockHandler = async (blockNumber) => {
        if (this.isDestroyed || isResolved) return;

        try {
          const block = await this.provider.getBlock(blockNumber);
          if (!block) return;

          this.blocksChecked++;
          if (!this.realTimeMessageId) {
            // If the data is sent for the first time or first block is being checked
            const sentMessage = await this.bot.sendMessage(
              this.chatId,
              `🔍 Monitoring Transactions...\n` +
                `📦 Block ${blockNumber} (${this.blocksChecked}/${criteria.maxBlocksToWait})\n` +
                `⏳ Please wait...`,
              {
                parse_mode: "HTML",
                reply_markup: KEYBOARD_BUTTONS.cancel_markup,
              }
            );
            // set the RealTimeMessage Id
            this.realTimeMessageId = sentMessage.message_id;
          } else {
            await this.bot.editMessageText(
              `🔍 Monitoring Transactions...\n` +
                `📦 Block ${blockNumber} (${this.blocksChecked}/${criteria.maxBlocksToWait})\n` +
                `⏳ Please wait...`,
              {
                chat_id: this.chatId,
                message_id: this.realTimeMessageId,
                parse_mode: "HTML",
                reply_markup: KEYBOARD_BUTTONS.cancel_markup,
              }
            );
          }


          // If we have checked blocks equal to the max blocks that could have been checked !!!

          if (this.blocksChecked > criteria.maxBlocksToWait) {
            if (this.foundTransactions.length > 0) {
              const txMessages = this.foundTransactions
                .map((tx) => `   Hash: ${tx.hash}\n   Amount: ${tx.amount} ETH`)
                .join("\n\n");

              await this.bot.editMessageText(
                `⚠️ Time Limit Reached!\n\n` +
                  `Found transactions with incorrect amounts:\n${txMessages}\n\n` +
                  `Expected: ${criteria.expectedAmount} ETH`,
                {
                  chat_id: this.chatId,
                  message_id: this.realTimeMessageId,
                }
              );
              cleanup();
              resolve(TransactionState.FOUND_INCORRECT_AMOUNT);
            } else {
              await this.bot.editMessageText(
                "❌ Time Limit Reached!\n" +
                  "No transactions found from your address.\n" +
                  "Please try again or contact support.",
                {
                  chat_id: this.chatId,
                  message_id: this.realTimeMessageId,
                }
              );
              cleanup();
              resolve(TransactionState.TIMEOUT);
            }
            return;
          }

          if (block.transactions) {
            for (const txHash of block.transactions) {
              if (this.isDestroyed || isResolved) return;

              try {
                const tx = await this.provider.getTransaction(txHash);
                if (!tx) continue;

                if (
                  tx.from.toLowerCase() ===
                    criteria.senderAddress.toLowerCase() &&
                  tx.to?.toLowerCase() ===
                    criteria.recipientAddress.toLowerCase()
                ) {
                  const amountInEth = ethers.formatEther(tx.value);
                  await this.bot.editMessageText(
                    `🔎 Transaction Detected!\n` +
                      `   Hash: ${tx.hash}\n` +
                      `   Amount: ${amountInEth} ETH`,
                    {
                      chat_id: this.chatId,
                      message_id: this.realTimeMessageId,
                    }
                  );

                  if (tx.value < expectedAmountWei) {
                    await this.bot.editMessageText(
                      "⚠️ Amount is less than expected!\n" +
                        `Expected: ${criteria.expectedAmount} ETH\n` +
                        `Received: ${amountInEth} ETH`,
                      {
                        chat_id: this.chatId,
                        message_id: this.realTimeMessageId,
                      }
                    );
                    this.foundTransactions.push({
                      hash: tx.hash,
                      amount: amountInEth,
                    });
                    continue;
                  }

                  if (tx.value >= expectedAmountWei) {
                    await this.bot.editMessageText(
                      "✨ Transaction amount matches!\n" +
                        "Waiting for confirmation...",
                      {
                        chat_id: this.chatId,
                        message_id: this.realTimeMessageId,
                      }
                    );
                    try {
                      const receipt = await tx.wait(config.confirmations);
                      if (receipt) {
                        await this.bot.editMessageText(
                          `✅ Transaction Confirmed!\n\n` +
                            `💰 Expected amount: ${criteria.expectedAmount} ETH\n\n` +
                            `🌐 Network: ${network.name}\n` +
                            `🔗 Chain ID: ${network.chainId}\n\n` +
                            `🔍 Transaction Details:\n` +
                            `From: ${criteria.senderAddress}\n` +
                            `To: ${criteria.recipientAddress}\n` +
                            `Amount: ${amountInEth} ETH\n` +
                            `Block: ${receipt.blockNumber}\n` +
                            `Gas Used: ${receipt.gasUsed.toString()}\n` +
                            `Hash: ${tx.hash}`,
                          {
                            chat_id: this.chatId,
                            message_id: this.messageId,
                          }
                        );
                        cleanup();
                        isResolved = true;
                        resolve(TransactionState.FOUND_CORRECT_AMOUNT);
                        return;
                      }
                    } catch (waitError) {
                      await this.bot.editMessageText(
                        `⚠️ Confirmation Error: ${waitError.message}`,
                        {
                          chat_id: this.chatId,
                          message_id: this.messageId,
                        }
                      );
                      await this.bot.deleteMessage(
                        this.chatId,
                        this.realTimeMessageId
                      );
                    }
                  }
                }
              } catch (txError) {
                if (!this.isDestroyed) {
                  await this.bot.editMessageText(
                    `⚠️ Transaction Error: ${txError.message}`,
                    {
                      chat_id: this.chatId,
                      message_id: this.messageId,
                    }
                  );
                  await this.bot.deleteMessage(
                    this.chatId,
                    this.realTimeMessageId
                  );
                }
              }
            }
          }
        } catch (error) {
          if (!this.isDestroyed) {
            await this.bot.editMessageText(`❌ Error: ${error.message}`, {
              chat_id: this.chatId,
              message_id: this.messageId,
            });
            await this.bot.deleteMessage(this.chatId, this.realTimeMessageId);
            cleanup();
            reject(error);
          }
        }
      };

      const cleanup = () => {
        if (!this.isDestroyed) {
          this.provider.removeListener("block", blockHandler);
        }
      };

      this.provider.on("block", blockHandler);

      const timeout = criteria.maxBlocksToWait * 15 * 1000;
      setTimeout(() => {
        if (!isResolved) {
          this.bot.editMessageText(
            "⏰ Monitoring Timeout!\n" +
              "No matching transaction found.\n" +
              "Please try again or contact support.",
            {
              chat_id: this.chatId,
              message_id: this.messageId,
            }
          );
          cleanup();
          resolve(TransactionState.TIMEOUT);
        }
      }, timeout);
    });
  }


  async stopTransaction(){
    this.destroy();
  }


  async destroy() {
    console.log("Destroying Instance ")
    await this.bot.editMessageText("🧹 Cleaning up...", {
      chat_id: this.chatId,
      message_id: this.messageId,
    });
    if(!this.isDestroyed){
        await this.bot.deleteMessage(this.chatId, this.realTimeMessageId);
        await this.bot.deleteMessage(this.chatId, this.messageId);
    }
    this.isDestroyed = true;
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.provider.removeAllListeners();
    if (typeof this.provider.destroy === "function") {
      await this.provider.destroy();
    }
  }
}

module.exports = { TransactionMonitor, TransactionState };
