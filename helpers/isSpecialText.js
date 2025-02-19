const isSpecialText = (text) => {
    const specialText = ["/pay"];
    let flag = false;
    specialText.forEach((e) => {
        const doesContainText = text.startsWith(e);
        if(doesContainText) flag = true;
    })
    return flag;
}

module.exports = {isSpecialText}