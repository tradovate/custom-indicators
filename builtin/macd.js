const predef = require("../tools/predef");
const meta = require("../tools/meta");
const EMA = require("../tools/EMA");

class movingAverageConvergenceDivergence {
    init() {
        this.signalEMA = EMA(this.props.signal);
        this.fastEMA = EMA(this.props.fast);
        this.slowEMA = EMA(this.props.slow);
    }

    map(d, i) {
        const value = d.value();
        const macd = this.fastEMA(value) - this.slowEMA(value);
        let signal;
        let difference;
        if (i >= this.props.slow - 1) {
            signal = this.signalEMA(macd);
            difference = macd - signal;
        }
        return {
            macd, signal, difference, zero: 0
        };
    }

    filter(d) {
        return predef.filters.isNumber(d.difference);
    }
}

module.exports = {
    name: "macd",
    description: "Moving Average Convergence Divergence",
    calculator: movingAverageConvergenceDivergence,
    params: {
        fast: predef.paramSpecs.period(12),
        slow: predef.paramSpecs.period(26),
        signal: predef.paramSpecs.period(9)
    },
    validate(obj) {
        if (obj.slow < obj.fast) {
            return meta.error("slow", "Slow period should be larger than fast period");
        }
    },
    inputType: meta.InputType.BARS,
    plotter: predef.plotters.macd,
    plots: {
        macd: {}, signal: {}, difference: {}, zero: { displayOnly: true }
    },
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: {
        dark: {
            macd: predef.styles.plot("#ffe270"),
            signal: predef.styles.plot("#CC6600"),
            difference: predef.styles.plot("#FF3300"),
            zero: predef.styles.plot({ color: "#7E838C", lineStyle: 3 })
        }
    }
};
