const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MovingHigh = require("../tools/MovingHigh");
const MovingLow = require("../tools/MovingLow");

class aroon {
    init() {
        this.highest = new MovingHigh(this.props.period);
        this.lowest = new MovingLow(this.props.period);
    }

    map(d) {
        const period = this.props.period;
        const high = d.high();
        const low = d.low();
        this.highest.push(high);
        this.lowest.push(low);
        const daysSinceHigh = this.highest.sinceExtreme();
        const daysSinceLow = this.lowest.sinceExtreme();
        return {
            up: (period - daysSinceHigh) / period * 100,
            down: (period - daysSinceLow) / period * 100
        };
    }

    filter(d) {
        return predef.filters.isNumber(d.up);
    }
}

module.exports = {
    name: "aroon",
    title: "Aroon",
    description: "Aroon",
    calculator: aroon,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    areaChoice: meta.AreaChoice.NEW,
    plots: {
        up: { title: "AROON.U" },
        down: { title: "AROON.D" }
    },
    tags: [predef.tags.Channels],
    schemeStyles: {
        dark: {
            up: predef.styles.plot("#8cecff"),
            down: predef.styles.plot("#FF9966")
        }
    }
};
