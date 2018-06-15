const predef = require("../tools/predef");
const meta = require("../tools/meta");
const SMA = require("../tools/SMA");

class easeOfMovement {
    init() {
        this.sma = SMA(this.props.period);
    }

    map(d, i, history) {
        const previous = history.prior();
        const prevHL = previous ? (previous.high() + previous.low()) / 2 : 0;
        const low = d.low();
        const high = d.high();
        const volume = d.volume();
        const distanceMoved = (high + low) / 2 - prevHL;
        const hl = high - low;
        const boxRatio = hl === 0 ? 0 : (volume / 100000) / hl;
        const emv = boxRatio === 0 ? 0 : distanceMoved / boxRatio;
        return i > 0 ? this.sma(emv) : null;
    }
}

module.exports = {
    name: "emv",
    description: "Ease Of Movement",
    calculator: easeOfMovement,
    params: {
        period: predef.paramSpecs.period(14)
    },
    tags: [predef.tags.Volumes],
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    schemeStyles: predef.styles.solidLine("#8cecff")
};
