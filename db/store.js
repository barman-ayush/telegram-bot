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

    // Message Tracking Methods
    setMessageTracker(chatId, data) {
        this.messageTracker.set(chatId, data);
    }

    getMessageTracker(chatId) {
        return this.messageTracker.get(chatId);
    }

    // User States Methods
    setUserState(userId, state) {
        this.userStates.set(userId, state);
    }

    getUserState(userId) {
        return this.userStates.get(userId);
    }

    // Payment Tracking Methods
    setPaymentTrack(userId, data) {
        this.paymentTracking.set(userId, data);
    }

    getPaymentTrack(userId) {
        return this.paymentTracking.get(userId);
    }

    // Rate Limiting Methods
    setRateLimit(userId, timestamp) {
        this.rateLimit.set(userId, timestamp);
    }

    getRateLimit(userId) {
        return this.rateLimit.get(userId);
    }

    // Cleanup Methods
    clearUserData(userId) {
        this.userSelections.delete(userId);
        this.userStates.delete(userId);
        this.paymentTracking.delete(userId);
        this.rateLimit.delete(userId);
    }

    // Utility Methods
    getAllUserSelections() {
        return Array.from(this.userSelections.entries());
    }

    hasActiveSelection(userId) {
        return this.userSelections.has(userId);
    }
}

// Create and export a single instance
const store = new Store();
module.exports = store;