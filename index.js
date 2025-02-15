const rupro_access = require("./controllers/reproAccess");
const generalMessageController = require("./controllers/generalMessage");
const callbackHandler = require("./controllers/callbackHandler");
const {bot} = require("./exports")

// Handle all messages
bot.on("message", async(msg) => {
  try{
    generalMessageController(bot , msg)
    // await bot.sendMessage(msg.chat.id , "hello")
  }catch(e){
    console.log("error handled" , e.body)
  }
});


// Handle button clicks
bot.on("callback_query", async (query) => {
  try{
    callbackHandler(bot , query)
  }catch(e){
    console.log("Error handler")
  }
});
