const predef = require("../tools/predef");
const meta = require("../tools/meta");
const SMA = require("../tools/SMA");
const moneyFlowVolume = require("../tools/moneyFlowVolume");

class chaikinMoneyFlow {
    init() {
        this.mfvSummator = new SMA(this.props.period);
        this.vSummator = new SMA(this.props.period);
    }

    map(d) {
        this.mfvSummator.push(moneyFlowVolume(d));
        this.vSummator.push(d.volume());
        return this.mfvSummator.sum() / this.vSummator.sum();
    }
}

module.exports = {
    name: "cmf",
    description: "Chaikin Money Flow",
    calculator: chaikinMoneyFlow,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    plotter: predef.plotters.histogram,
    tags: [predef.tags.Volumes],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
