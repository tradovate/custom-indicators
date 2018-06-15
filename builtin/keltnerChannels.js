const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MMA = require("../tools/MMA");
const EMA = require("../tools/EMA");
const trueRange = require("../tools/trueRange");

class keltnerChannels {
    init() {
        this.atr = MMA(this.props.atrPeriod);
        this.ema = EMA(this.props.emaPeriod);
    }

    map(d, i, history) {
        const close = d.close();
        const middle = this.ema(close);
        const atr = this.props.atrMultiplier * this.atr(trueRange(d, history.prior()));
        return { upper: middle + atr, middle, lower: middle - atr };
    }

    filter(d, i) {
        return i > Math.max(this.props.emaPeriod, this.props.atrPeriod);
    }
}

module.exports = {
    name: "kc",
    description: "Keltner Channels",
    calculator: keltnerChannels,
    params: {
        emaPeriod: predef.paramSpecs.period(20),
        atrPeriod: predef.paramSpecs.period(10),
        atrMultiplier: predef.paramSpecs.number(2)
    },
    inputType: meta.InputType.BARS,
    plots: {
        middle: { title: "Middle" },
        upper: { title: "Upper" },
        lower: { title: "Lower" }
    },
    tags: [predef.tags.Channels],
    schemeStyles: {
        dark: {
            upper: predef.styles.plot("#8cecff"),
            middle: predef.styles.plot("#FF9966"),
            lower: predef.styles.plot("#8cecff")
        }
    }
};
