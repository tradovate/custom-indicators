const predef = require("../tools/predef");
const meta = require("../tools/meta");
const SMA = require("../tools/SMA");

class envelopes {
    init() {
        this.sma = SMA(this.props.period);
    }

    map(d) {
        const sma = this.sma(d.value());
        const band = sma * this.props.percent / 100;
        return { upper: sma + band, SMA: sma, lower: sma - band };
    }

    filter(d) {
        return predef.filters.isNumber(d.upper);
    }
}

const m = {
    name: "envelopes",
    title: "ENV",
    description: "Envelopes",
    calculator: envelopes,
    params: {
        percent: predef.paramSpecs.percent(0.25, 0.01),
        period: predef.paramSpecs.period(20)
    },
    validate(obj) {
        if (obj.percent <= 0) {
            return meta.error("percent", "Percent should be a positive number");
        }
        return undefined;
    },
    plots: {
        upper: { title: "ENV.U" },
        SMA: { title: "ENV.SMA" },
        lower: { title: "ENV.L" }
    },
    tags: [predef.tags.Channels],
    schemeStyles: {
        dark: {
            upper: predef.styles.plot("#FF9966"),
            SMA: predef.styles.plot("#8cecff"),
            lower: predef.styles.plot("#FF9966")
        }
    }
};

module.exports = m;
