const predef = require("./tools/predef");
const EMA = require("./tools/EMA");

class ema {
    init() {
        this.emaAlgo = EMA(this.props.period);
    }

    map(d) {
        return this.emaAlgo(d.value());
    }
}

module.exports = {
    name: "exampleEma",
    description: "My EMA",
    calculator: ema,
    params: {
        period: predef.paramSpecs.period(10)
    },
    tags: ["My Indicators", predef.tags.MovingAverage],
    schemeStyles: predef.styles.solidLine("red")
};
