const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MovingHigh = require("../tools/MovingHigh");
const MovingLow = require("../tools/MovingLow");
const SMA = require("../tools/SMA");

class stochastic {
    init() {
        this.highest = MovingHigh(this.props.period);
        this.lowest = MovingLow(this.props.period);
        this.sma = SMA(this.props.smoothPeriod);
    }

    map(d) {
        const high = d.high();
        const low = d.low();
        const close = d.close();
        const hh = this.highest(high);
        const ll = this.lowest(low);
        const K = (hh - ll) === 0 ? 0 : 100 * (close - ll) / (hh - ll);
        const D = this.sma(K);
        return { K, D };
    }

    filter(d) {
        return predef.filters.isNumber(d.D);
    }
}

module.exports = {
    name: "stochastic",
    title: "STO",
    description: "Stochastic Oscillator",
    calculator: stochastic,
    params: {
        period: predef.paramSpecs.period(14),
        smoothPeriod: predef.paramSpecs.period(3)
    },
    validate(obj) {
        if (obj.period < 1) {
            return meta.error("period", "Period should be a positive number");
        }
        if (obj.smoothPeriod < 2) {
            return meta.error("smoothPeriod", "Smooth period should be greater than 1");
        }
        return undefined;
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    plots: {
        K: { title: "%K" },
        D: { title: "%D" }
    },
    tags: [predef.tags.Oscillators],
    schemeStyles: {
        dark: {
            K: predef.styles.plot("#CC33FF"),
            D: predef.styles.plot("#CC6600")
        }
    }
};
