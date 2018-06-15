const predef = require("../tools/predef");
const meta = require("../tools/meta");
const StdDev = require("../tools/StdDev");

class percentB {
    init() {
        this.stdDev = StdDev(this.props.period);
    }

    map(d) {
        const current = d.value();
        const stdev = this.stdDev(current);
        const avg = this.stdDev.avg();
        const band = 4 * stdev;
        const lowerBand = avg - 2 * stdev;
        return (current - lowerBand) / band;
    }

    filter(d, i) {
        return i > 0 && predef.filters.isNumber(d.value);
    }
}

module.exports = {
    name: "percentB",
    title: "%B",
    description: "%B",
    calculator: percentB,
    params: {
        period: predef.paramSpecs.period(20)
    },
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#FF0066")
};
