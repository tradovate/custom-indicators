const predef = require("../tools/predef");
const meta = require("../tools/meta");
const EMA = require("../tools/EMA");

class relativeStrengthIndex {
    init() {
        this.lossAverage = EMA(this.props.period);
        this.gainAverage = EMA(this.props.period);
    }

    map(d, i, history) {
        const difference = i > 0 ? d.value() - history.prior().value() : 0;
        const averageGain = this.gainAverage(Math.max(difference, 0));
        const averageLoss = Math.abs(this.lossAverage(Math.min(difference, 0)));

        let rsi = null;
        if (i >= this.props.period) {
            rsi = 100 - (100 / (1 + (averageGain / averageLoss)));
        }
        return {
            rsi,
            middle: 50,
            overbought: 70,
            oversold: 30
        };
    }

    filter(d) {
        return predef.filters.isNumber(d.rsi);
    }
}

module.exports = {
    name: "rsi",
    description: "Relative Strength Index",
    calculator: relativeStrengthIndex,
    params: {
        period: predef.paramSpecs.period(14)
    },
    plots: {
        rsi: { title: "RSI" },
        middle: { displayOnly: true },
        overbought: { displayOnly: true },
        oversold: { displayOnly: true }
    },
    tags: [predef.tags.Oscillators],
    areaChoice: meta.AreaChoice.NEW,
    schemeStyles: {
        dark: {
            rsi: predef.styles.plot("#ffe270"),
            middle: predef.styles.plot({ color: "#7E838C", lineStyle: 3 }),
            overbought: predef.styles.plot({ color: "#5DC74F", lineStyle: 3 }),
            oversold: predef.styles.plot({ color: "#E52545", lineStyle: 3 })
        }
    }
};
