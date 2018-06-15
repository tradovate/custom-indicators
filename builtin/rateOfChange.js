const predef = require("../tools/predef");
const meta = require("../tools/meta");

class momentum {
    map(d, i, history) {
        let value;
        if (i >= this.props.period) {
            const current = d.value();
            const prior = history.back(this.props.period).value();
            value = (current - prior) / prior * 100;
        }
        return value;
    }
}

module.exports = {
    name: "rateOfChange",
    title: "RoC",
    description: "Rate of Change",
    calculator: momentum,
    params: {
        period: predef.paramSpecs.period(14)
    },
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#cfa600")
};
