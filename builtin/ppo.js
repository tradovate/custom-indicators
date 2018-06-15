const predef = require("../tools/predef");
const meta = require("../tools/meta");
const EMA = require("../tools/EMA");

class percentagePriceOscillator {
    init() {
        this.signalEMA = EMA(this.props.ppoPeriod);
        this.fastEMA = EMA(this.props.period1);
        this.slowEMA = EMA(this.props.period2);
    }

    map(d, i) {
        const value = d.value();
        const fast = this.fastEMA(value);
        const slow = this.slowEMA(value);
        const ppo = (fast - slow) / slow * 100;
        const signal = this.signalEMA(ppo);
        const difference = ppo - signal;

        if (i >= Math.max(this.props.period1, this.props.period2) + this.props.ppoPeriod) {
            return {
                macd: ppo, signal, difference, zero: 0
            };
        }

        return {};
    }

    filter(d) {
        return predef.filters.isNumber(d.difference);
    }
}

module.exports = {
    name: "ppo",
    description: "Percentage Price Oscillator",
    calculator: percentagePriceOscillator,
    params: {
        period1: predef.paramSpecs.period(12),
        period2: predef.paramSpecs.period(26),
        ppoPeriod: predef.paramSpecs.period(9)
    },
    scaler: predef.scalers.multiPath(["macd", "signal", "difference"]),
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
