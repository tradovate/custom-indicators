const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MovingHigh = require("../tools/MovingHigh");
const MovingLow = require("../tools/MovingLow");

class williamR {
    init() {
        this.highest = MovingHigh(this.props.period);
        this.lowest = MovingLow(this.props.period);
    }

    map(d) {
        const high = d.high();
        const low = d.low();
        const close = d.close();
        const hh = this.highest(high);
        const ll = this.lowest(low);
        return -100 * (hh - close) / (hh - ll);
    }
}

module.exports = {
    name: "williamR",
    title: "Wm%R",
    description: "Williams %R",
    calculator: williamR,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#0066FF")
};
