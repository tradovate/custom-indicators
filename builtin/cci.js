const predef = require("../tools/predef");
const meta = require("../tools/meta");
const SMA = require("../tools/SMA");
const typicalPrice = require("../tools/typicalPrice");

class commodityChannelIndex {
    init() {
        this.sma = new SMA(this.props.period);
    }

    map(d, i) {
        const tp = typicalPrice(d);
        this.sma.push(tp);
        let value;
        if (i >= this.props.period) {
            value = (tp - this.sma.avg()) / (0.015 * this.sma.meanDeviation());
        }
        return value;
    }
}

module.exports = {
    name: "cci",
    description: "Commodity Channel Index",
    calculator: commodityChannelIndex,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
