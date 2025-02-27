const { Redis } = require("ioredis");
const dotenv = require("dotenv")

dotenv.config();

class CacheStore{
    constructor(){
        this.redis = new Redis("redis://default:ewLmuNttsQEcFxETATTwvnyYMfJnzngV@metro.proxy.rlwy.net:12045")

        this.redis.on("connect", () => console.log("✅ Connected to Redis"));
        this.redis.on("error", (err) => console.error("❌ Redis Error:", err));
    }

    async cacheUser(chatId , userData){
        try{
            await this.redis.set(chatId , JSON.stringify(userData) , "EX" , process.env.CHAT_SESSION_EXP)
            console.log("User cached Successfully !!");
            return;
        }catch(e){
            console.log("[CACHING_USER] : " , e)
        }
    }
    
    async getCachedUser(chatId){
        try{
            const cachedUserData = await this.redis.get(chatId)
            console.log("User fetched Successfully !!" , cachedUserData);
            return cachedUserData ? JSON.parse(cachedUserData) : null;
        }catch(e){
            console.log("[FETCHING_CACHED_USER] : " , e)
        }
        
    }
}

const cacheStore = new CacheStore();

module.exports = cacheStore;