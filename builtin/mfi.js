const predef = require("../tools/predef");
const meta = require("../tools/meta");
const SMA = require("../tools/SMA");
const typicalPrice = require("../tools/typicalPrice");

class moneyFlowIndex {
    init() {
        this.positiveMA = new SMA(this.props.period);
        this.negativeMA = new SMA(this.props.period);
    }

    map(d, i, history) {
        let value = null;

        if (i > 0) {
            const multiplier = typicalPrice(d) - typicalPrice(history.prior()) > 0 ? 1 : -1; // Up or Down
            const moneyFlow = multiplier * typicalPrice(d) * d.volume();
            this.positiveMA.push(Math.max(moneyFlow, 0));
            this.negativeMA.push(Math.min(moneyFlow, 0));
            value = 100 - 100 / (1 + Math.abs(this.positiveMA.sum() / this.negativeMA.sum()));
        }

        return value;
    }
}

module.exports = {
    name: "mfi",
    description: "Money Flow Index",
    calculator: moneyFlowIndex,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Volumes],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
