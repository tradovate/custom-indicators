const predef = require("../tools/predef");
const meta = require("../tools/meta");
const EMA = require("../tools/EMA");

class forceIndex {
    init() {
        this.ema = EMA(this.props.period);
    }

    map(d, i, history) {
        let value = null;
        if (i > 0) {
            const fIndex = (d.close() - history.prior().close()) * d.volume();
            value = this.ema(fIndex);
        }
        return value;
    }

    filter(_, i) {
        return i >= this.props.period;
    }
}

module.exports = {
    name: "fi",
    description: "Force Index",
    plotter: predef.plotters.histogram,
    calculator: forceIndex,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Volumes],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
