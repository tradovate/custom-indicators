const predef = require("../tools/predef");
const meta = require("../tools/meta");

class momentum {
    map(d, i, history) {
        let value;
        if (i >= this.props.period) {
            const prior = history.back(this.props.period).value();
            if (prior !== 0) {
                value = d.value() / prior * 100.0;
            }
        }
        return value;
    }
}

module.exports = {
    name: "momentum",
    description: "Momentum",
    calculator: momentum,
    params: {
        period: predef.paramSpecs.period(14)
    },
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#8cecff")

};
