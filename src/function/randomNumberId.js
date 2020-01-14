const randomID = (arg) => {
    // 0 = list; 1 = item
    if (arg) {
        return `${arg}${Math.floor(Math.random() * 100000)}`
    } else {
        return Math.floor(Math.random() * 100000)
    }
};

export default randomID;