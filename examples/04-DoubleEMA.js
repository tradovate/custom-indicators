const predef = require("./tools/predef");
const EMA = require("./tools/EMA");
const p = require("./tools/plotting");

class doubleEma {
    init() {
        this.slowEma = EMA(this.props.slowPeriod);
        this.fastEma = EMA(this.props.fastPeriod);
    }

    map(d) {
        const value = d.value();
        return {
            slow: this.slowEma(value),
            fast: this.fastEma(value)
        };
    }
}

function dnaLikePlotter(canvas, indicatorInstance, history) {
    for(let i=0; i<history.data.length; ++i) {
        const item = history.get(i);
        if (item.slow !== undefined && item.fast !== undefined) {
            const x = p.x.get(item);
            canvas.drawLine(
                p.offset(x, item.fast),
                p.offset(x, item.slow),
                {
                    color: item.fast > item.slow ? "green" : "red",
                    relativeWidth: 0.5,
                    opacity: 0.5
                });
        }
    }
}

module.exports = {
    name: "doubleEma",
    description: "Double EMA",
    calculator: doubleEma,
    params: {
        slowPeriod: predef.paramSpecs.period(21),
        fastPeriod: predef.paramSpecs.period(10)
    },
    tags: ["My Indicators"],
    plots: {
        fast: { title: "FastEMA" },
        slow: { title: "SlowEMA" },
    },
    plotter: [
        predef.plotters.dots("slow"),
        predef.plotters.singleline("fast"),
        predef.plotters.custom(dnaLikePlotter)
    ],
    schemeStyles: {
        dark: {
            fast: {color: "red"},
            slow: {color: "lightblue"}
        }
    }
};
