const predef = require("../tools/predef");
const meta = require("../tools/meta");
const StdDev = require("../tools/StdDev");

class volatility {
    init() {
        this.stdDev = StdDev(this.props.period);
    }

    map(d) {
        return this.stdDev(d.value());
    }

    filter(d, i) {
        return i > 0 && predef.filters.isNumber(d.value);
    }
}

module.exports = {
    name: "volatility",
    title: "Volatility",
    description: "Volatility (Std.Dev)",
    calculator: volatility,
    params: {
        period: predef.paramSpecs.period(20)
    },
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Volatility],
    schemeStyles: predef.styles.solidLine("#FF9966")
};
