const predef = require("./predef");

module.exports = (d) => {
    const high = d.high();
    const low = d.low();
    return (high + low) / 2;
};
