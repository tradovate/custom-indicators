const predef = require("../tools/predef");
const meta = require("../tools/meta");
const StdDev = require("../tools/StdDev");

class bbwidth {
    init() {
        this.stdDev = StdDev(this.props.period);
    }

    map(d) {
        const stdev = this.stdDev(d.value());
        const avg = this.stdDev.avg();
        return 4 * stdev / avg * 100;
    }

    filter(d, i) {
        return i > 0 && predef.filters.isNumber(d.value);
    }
}

module.exports = {
    name: "bbwidth",
    title: "BB Width",
    description: "Bollinger Band Width",
    calculator: bbwidth,
    params: {
        period: predef.paramSpecs.period(20)
    },
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Volatility],
    schemeStyles: predef.styles.dashLine("#FF9966")
};
