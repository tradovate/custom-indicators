const predef = require("../tools/predef");
const SMA = require("../tools/SMA");

class simpleMovingAverage {
    init() {
        this.sma = SMA(this.props.period);
    }

    map(d) {
        return this.sma(d.value());
    }
}

module.exports = {
    name: "sma",
    description: "Simple Moving Average",
    calculator: simpleMovingAverage,
    params: {
        period: predef.paramSpecs.period(14)
    },
    tags: [predef.tags.MovingAverage],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
