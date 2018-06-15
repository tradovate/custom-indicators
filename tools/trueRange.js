const predef = require("./predef");

module.exports = (d, prior) => {
    const high = d.high();
    const low = d.low();
    if (prior) {
        const previousClose = prior.close();
        return Math.max(
            high - low,
            Math.abs(high - previousClose),
            Math.abs(low - previousClose)
        );
    }
    return high - low;
};
