const isValidWalletAddress = (walletAddress) => {
    if(walletAddress != "" || !walletAddress) return true
    // add other checks here too
    return false;

}

module.exports = {isValidWalletAddress};