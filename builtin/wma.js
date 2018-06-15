const predef = require("../tools/predef");
const WMA = require("../tools/WMA");

class weightedMovingAverage {
    init() {
        this.wma = WMA(this.props.period);
    }

    map(d) {
        return this.wma(d.value());
    }
}

module.exports = {
    name: "wma",
    description: "Weighted Moving Average",
    calculator: weightedMovingAverage,
    params: {
        period: predef.paramSpecs.period(14)
    },
    tags: [predef.tags.MovingAverage],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
