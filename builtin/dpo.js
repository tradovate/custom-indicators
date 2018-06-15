const predef = require("../tools/predef");
const meta = require("../tools/meta");
const SMA = require("../tools/SMA");

class detrendedPriceOscillator {
    init() {
        this.sma = SMA(this.props.period);
    }

    map(d, i, history) {
        const ma = this.sma(d.value());
        let value = null;
        const half = Math.round(this.props.period / 2 + 1);
        if (i >= half) {
            value = history.back(half).value() - ma;
        }
        return value;
    }
}

module.exports = {
    name: "dpo",
    description: "Detrended Price Oscillator",
    calculator: detrendedPriceOscillator,
    params: {
        period: predef.paramSpecs.period(14)
    },
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
