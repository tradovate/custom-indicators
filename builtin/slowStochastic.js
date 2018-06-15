const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MovingHigh = require("../tools/MovingHigh");
const MovingLow = require("../tools/MovingLow");
const SMA = require("../tools/SMA");

class slowStochastic {
    init() {
        this.highest = MovingHigh(this.props.period);
        this.lowest = MovingLow(this.props.period);
        this.sma = SMA(this.props.smoothPeriod);
        this.sma2 = SMA(this.props.Slow_K_sma_period);
    }

    map(d) {
        const high = d.high();
        const low = d.low();
        const close = d.close();
        const hh = this.highest(high);
        const ll = this.lowest(low);
        const K = (hh - ll) === 0 ? 0 : this.sma2(100 * (close - ll) / (hh - ll));
        const D = this.sma(K);
        return { K, D };
    }

    filter(d) {
        return predef.filters.isNumber(d.D);
    }
}

module.exports = {
    name: "slowstochastic",
    title: "SLOSTO",
    description: "Slow Stochastic Oscillator",
    calculator: slowStochastic,
    params: {
        period: predef.paramSpecs.period(14),
        smoothPeriod: predef.paramSpecs.period(3),
        Slow_K_sma_period: predef.paramSpecs.period(3),
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
        K: { title: "Slow %K" },
        D: { title: "Slow %D" }
    },
    tags: [predef.tags.Oscillators],
    schemeStyles: {
        dark: {
            K: predef.styles.plot("#CC33FF"),
            D: predef.styles.plot("#CC6600")
        }
    }
};
