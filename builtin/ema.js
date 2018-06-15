const predef = require("../tools/predef");
const EMA = require("../tools/EMA");

class exponentialMovingAverage {
    init() {
        this.ema = EMA(this.props.period);
    }

    map(d) {
        return this.ema(d.value());
    }

    filter(_, i) {
        return i >= this.props.period;
    }
}

module.exports = {
    name: "ema",
    description: "Exponential Moving Average",
    calculator: exponentialMovingAverage,
    params: {
        period: predef.paramSpecs.period(14)
    },
    tags: [predef.tags.MovingAverage],
    schemeStyles: predef.styles.solidLine("#95f57a")
};
