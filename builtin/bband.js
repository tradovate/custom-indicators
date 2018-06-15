const predef = require("../tools/predef");
const meta = require("../tools/meta");
const StdDev = require("../tools/StdDev");

class bband {
    init() {
        this.stdDev = StdDev(this.props.period);
    }

    map(d) {
        const stdev = this.stdDev(d.value());
        const avg = this.stdDev.avg();
        const halfWidth = stdev * 2;
        const lowerBand = avg - halfWidth;
        return { upper: avg + halfWidth, middle: avg, lower: lowerBand };
    }

    filter(d, i) {
        return i > 0 && predef.filters.isNumber(d.upper);
    }
}

module.exports = {
    name: "bband",
    description: "Bollinger Bands",
    calculator: bband,
    params: {
        period: predef.paramSpecs.period(20)
    },
    plots: {
        upper: { title: "BBand.U" },
        lower: { title: "BBand.L" }
    },
    tags: [predef.tags.Channels],
    schemeStyles: {
        dark: {
            upper: predef.styles.plot({ color: "#FF9966", lineStyle: 3 }),
            lower: predef.styles.plot({ color: "#FF9966", lineStyle: 3 })
        }
    }
};
