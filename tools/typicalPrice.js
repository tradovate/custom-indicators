module.exports = (d) => {
    const high = d.high();
    const low = d.low();
    const close = d.close();
    return (high + low + close) / 3;
};
