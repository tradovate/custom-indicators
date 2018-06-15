const predef = require("../tools/predef");
const meta = require("../tools/meta");
const SMA = require("../tools/SMA");
const medianPrice = require("../tools/medianPrice");

class ac {
    init() {
        this.fastMA = SMA(this.props.fastPeriod);
        this.slowMA = SMA(this.props.slowPeriod);
        this.aoMA = SMA(this.props.fastPeriod);
    }

    map(d) {
        const median = medianPrice(d);
        const ao = this.fastMA(median) - this.slowMA(median);
        const value = ao - this.aoMA(ao);
        return { ao, value };
    }
}

module.exports = {
    name: "ac",
    description: "Acceleration/Deceleration",
    calculator: ac,
    params: {
        fastPeriod: predef.paramSpecs.period(5),
        slowPeriod: predef.paramSpecs.period(34)
    },
    validate(obj) {
        if (obj.slowPeriod < obj.fastPeriod) {
            return meta.error("slowPeriod", "Slow period should be larger than fast period");
        }
        return undefined;
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    plotter: predef.plotters.histogram,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#FF0066")
};
