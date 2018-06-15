const predef = require("./predef");

module.exports = (d) => {
    const low = d.low(0);
    const high = d.high();
    const close = d.close();
    const volume = d.volume();
    const multiplier = high === low ? 0 : ((close - low) - (high - close)) / (high - low);
    return multiplier * volume;
};
