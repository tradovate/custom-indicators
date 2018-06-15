const predef = require("../tools/predef");
const meta = require("../tools/meta");
const SMA = require("../tools/SMA");
const EMA = require("../tools/EMA");

class massIndex {
    init() {
        this.singleEMA = EMA(this.props.emaPeriod);
        this.doubleEMA = EMA(this.props.emaPeriod);
        this.emaSum = new SMA(this.props.sumPeriod);
    }

    map(d, i) {
        const low = d.low();
        const high = d.high();

        const single = this.singleEMA(high - low);
        const double = this.doubleEMA(single);

        let value = null;
        if (i >= this.props.emaPeriod * 2) {
            this.emaSum.push(single / double);
            if (i >= this.props.emaPeriod * 2 + this.props.sumPeriod) {
                value = this.emaSum.sum();
            }
        }
        return value;
    }
}

module.exports = {
    name: "mi",
    description: "Mass Index",
    calculator: massIndex,
    params: {
        emaPeriod: predef.paramSpecs.period(9),
        sumPeriod: predef.paramSpecs.period(25)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Volatility],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
