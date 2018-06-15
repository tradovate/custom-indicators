const predef = require("../tools/predef");
const meta = require("../tools/meta");
const moneyFlowVolume = require("../tools/moneyFlowVolume");

class accumulationDistributionLine {
    init() {
        this.adl = 0;
    }

    map(d) {
        this.adl = this.adl + moneyFlowVolume(d);
        return this.adl;
    }
}

module.exports = {
    name: "adl",
    description: "Accumulation/Distribution Line",
    calculator: accumulationDistributionLine,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Volumes],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
