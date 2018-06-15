const predef = require("../tools/predef");
const meta = require("../tools/meta");
const EMA = require("../tools/EMA");

class trix {
    init() {
        this.singleEMA = EMA(this.props.period);
        this.doubleEMA = EMA(this.props.period);
        this.tripleEMA = EMA(this.props.period);
        this.previousTriple = undefined;
    }

    map(d, i) {
        const input = d.value();
        const triple = this.tripleEMA(this.doubleEMA(this.singleEMA(input)));
        let value = null;
        if (i >= this.props.period * 3) {
            value = (triple / this.previousTriple - 1) * 100;
        }
        this.previousTriple = triple;
        return value;
    }
}

module.exports = {
    name: "trix",
    description: "TRIX",
    calculator: trix,
    params: {
        period: predef.paramSpecs.period(14)
    },
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
