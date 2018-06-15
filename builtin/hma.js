const predef = require("../tools/predef");
const WMA = require("../tools/WMA");

class hullMovingAverage {
    init() {
        const period = this.props.period;
        this.wmaLong = WMA(period);
        this.wmaShort = WMA(period / 2);
        this.wmaSqrt = WMA(Math.sqrt(period));
    }

    map(d) {
        const value = d.value();
        const wmaLong = this.wmaLong(value);
        const wmaShort = this.wmaShort(value) * 2;
        const wmaDiff = wmaShort - wmaLong;
        return this.wmaSqrt(wmaDiff);
    }
}

module.exports = {
    name: "hma",
    description: "Hull Moving Average",
    calculator: hullMovingAverage,
    params: {
        period: predef.paramSpecs.period(14)
    },
    tags: [predef.tags.MovingAverage],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
