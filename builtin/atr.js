const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MMA = require("../tools/MMA");
const trueRange = require("../tools/trueRange");

class averageTrueRange {
    init() {
        this.movingAverage = MMA(this.props.period);
    }

    map(d, i, history) {
        return this.movingAverage(trueRange(d, history.prior()));
    }
}

module.exports = {
    name: "atr",
    description: "Average True Range",
    calculator: averageTrueRange,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Volatility],
    schemeStyles: predef.styles.solidLine("#ffe270")
};
