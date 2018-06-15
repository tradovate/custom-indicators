const predef = require("../tools/predef");
const meta = require("../tools/meta");
const EMA = require("../tools/EMA");
const moneyFlowVolume = require("../tools/moneyFlowVolume");

class chaikinOscillator {
    init() {
        this.fastEMA = new EMA(this.props.ema1Period);
        this.slowEMA = new EMA(this.props.ema2Period);
        this.adl = 0;
    }

    map(d, i) {
        const { fastEMA, slowEMA, props } = this;

        this.adl = this.adl + moneyFlowVolume(d);

        fastEMA.push(this.adl);
        slowEMA.push(this.adl);

        let value = null;
        if (i >= Math.max(props.ema1Period, props.ema2Period)) {
            value = fastEMA.avg() - slowEMA.avg();
        }
        return value;
    }
}

module.exports = {
    name: "cho",
    description: "Chaikin Oscillator",
    calculator: chaikinOscillator,
    params: {
        ema1Period: predef.paramSpecs.period(3),
        ema2Period: predef.paramSpecs.period(10)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    tags: [predef.tags.Oscillators],
    schemeStyles: predef.styles.solidLine("#8cecff")
};
