const { PrismaClient } = require("@prisma/client");

class Database {
    constructor() {
        if (!Database.instance) {
            this.prisma = new PrismaClient();
            Database.instance = this;

            this.prisma.$connect()
                .then(() => console.log("✅ Connected to MySQL using Prisma"))
                .catch(err => console.error("❌ MySQL Connection Error:", err));
        }
        return Database.instance;
    }

    async createUser(userData){
        try{
            console.log(userData)
            const user = await this.prisma.user.create({data : userData});
            console.log("Created User ( createUser Method )" , user);
        }catch(e){
            console.log("[ CREATING_USER ] : " ,e);
        }
    }
    
    async fetchUser(chatId){
        try{
            const user = await this.prisma.user.findUnique({where : {chatId : chatId}})
            return user;
        }catch(e){
            console.log("[ FETCHING_USER ] : " ,e);
        }
    }
    
    async deleteUser(chatId){
        try{
            await this.prisma.user.delete({where : {chatId : chatId}})
        }catch(e){
            console.log("[ DELETING_USER ] : " ,e);
        }
    }

}

const database = new Database();
module.exports = database;