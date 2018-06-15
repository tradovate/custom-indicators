const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MovingHigh = require("../tools/MovingHigh");
const MovingLow = require("../tools/MovingLow");

class priceChannel {
    init() {
        this.highest = MovingHigh(this.props.period);
        this.lowest = MovingLow(this.props.period);
    }

    map(d) {
        const high = d.high();
        const low = d.low();
        const HH = this.highest(high);
        const LL = this.lowest(low);
        return { HH, LL, middle: (HH + LL) / 2 };
    }

    filter(d) {
        return predef.filters.isNumber(d.middle);
    }
}

module.exports = {
    name: "priceChannel",
    title: "Price Channel",
    description: "Price Channel",
    calculator: priceChannel,
    params: {
        period: predef.paramSpecs.period(14)
    },
    inputType: meta.InputType.BARS,
    plots: {
        HH: { title: "HH" },
        LL: { title: "LL" },
        middle: { title: "middle" }
    },
    tags: [predef.tags.Channels],
    schemeStyles: {
        dark: {
            HH: predef.styles.plot({ color: "#33CC33", lineStyle: 3 }),
            LL: predef.styles.plot({ color: "#FF5050", lineStyle: 3 }),
            middle: predef.styles.plot({ color: "#7E838C", lineStyle: 3 })
        }
    }
};
