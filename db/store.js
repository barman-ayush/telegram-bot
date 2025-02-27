// utils/store.js
class Store {
    constructor() {
        if (Store.instance) {
            return Store.instance;
        }
        Store.instance = this;
        
        // Initialize all your maps here
        this.userSelections = new Map();
        this.messageTracker = new Map();
        this.userStates = new Map();
        this.paymentTracking = new Map();
        this.rateLimit = new Map();

        //My maps
        this.users = new Map();
    }

    // User Selections Methods
    setUser(userId, data) {
        this.users.set(userId, data);
    }

    getUser(userId) {
        return this.users.get(userId);
    }
}

// Create and export a single instance
const store = new Store();
module.exports = store;