const predef = require("../tools/predef");
const SMA = require("../tools/SMA");

class triangularMovingAverage {
    init() {
        const period = Math.ceil((this.props.period + 1) / 2);
        this.sma = SMA(period);
        this.smoothSMA = SMA(period);
    }

    map(d) {
        return this.smoothSMA(this.sma(d.value()));
    }
}

module.exports = {
    name: "tma",
    description: "Triangular Moving Average",
    calculator: triangularMovingAverage,
    params: {
        period: predef.paramSpecs.period(14)
    },
    tags: [predef.tags.MovingAverage],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
