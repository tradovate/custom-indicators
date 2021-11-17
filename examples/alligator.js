const predef = require("./tools/predef");
const SMA = require("./tools/SMA");

class Alligator {
    init() {
        this.jaws = SMA(this.props.jaws)
        this.lips = SMA(this.props.lips)
        this.teeth = SMA(this.props.teeth)
    }

    map(d) {
        const jaws = this.jaws(d.value())
        const lips = this.lips(d.value())
        const teeth = this.teeth(d.value())
        return {
            jaws, lips, teeth
        }
    }
}

module.exports = {
    name: "Alligator",
    description: "Alligator",
    calculator: Alligator,
    params: {
        jaws: predef.paramSpecs.period(13),
        lips: predef.paramSpecs.period(5),
        teeth: predef.paramSpecs.period(8)
    },
    plots: {
        jaws: { title: 'Jaws' },
        lips: { title: 'Lips' },
        teeth: { title: 'Teeth' }
    },
    tags: [predef.tags.MovingAverage],
    schemeStyles: {
        dark: {
            jaws: { color: 'blue' },
            lips: { color: 'green' },
            teeth: { color: 'red' }
        }
    },
    //we can use shifts to offset our bars. Negative values would be into the past.
    shifts: {
        jaws: 8,
        lips: 5,
        teeth: 3
    }
};