const predef = require("./tools/predef");
const meta = require("./tools/meta");
const MMA = require("./tools/MMA");
const trueRange = require("./tools/trueRange");

class averageTrueRange {
    init() {
        this.movingAverage = MMA(this.props.period);
    }

    map(d, i, history) {
        const atr = this.movingAverage(trueRange(d, history.prior()));
        const tickSize = this.contractInfo.tickSize;
        const atrInTicks = atr / tickSize;
        let overrideStyle;
        if (atrInTicks > this.props.threshold) {
            overrideStyle = {
                color: d.open() > d.close() ? "salmon" : "lightgreen"
            };
        }
        return {
            value: atr,
            candlestick: overrideStyle,
            style: {
                value: overrideStyle
            }
        };
    }
}

module.exports = {
    name: "exampleATR",
    description: "Average True Range",
    calculator: averageTrueRange,
    params: {
        period: predef.paramSpecs.period(14),
        threshold: predef.paramSpecs.number(10, 1, 0)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: ["My Indicators"],
    plotter: predef.plotters.columns("value"),
    schemeStyles: predef.styles.solidLine("#ffe270")
};
