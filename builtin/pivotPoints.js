const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MovingHigh = require("../tools/MovingHigh");
const MovingLow = require("../tools/MovingLow");

class pivotPoints {
    init() {
        this.highest = new MovingHigh();
        this.lowest = new MovingLow();
        this.started = false;
        this.pivot = undefined;
        this.resistance1 = undefined;
        this.support1 = undefined;
        this.resistance2 = undefined;
        this.support2 = undefined;
    }

    map(d, i, history) {
        // Detect period transition
        const isNewPeriod = i > 0 && history.prior().tradeDate() !== d.tradeDate();

        // When to start plotting
        this.started = (i === 0) ? false : (this.started || isNewPeriod);

        if (this.started) {
            // Update Data only on initial start and after all ends
            if (isNewPeriod) {
                const high = this.highest.current();
                const low = this.lowest.current();
                const close = history.prior().close();
                this.pivot = (high + low + close) / 3;
                this.support1 = (this.pivot * 2) - high;
                this.support2 = this.pivot - (high - low);
                this.resistance1 = (this.pivot * 2) - low;
                this.resistance2 = this.pivot + (high - low);
                this.highest.reset();
                this.lowest.reset();
            }

            this.highest.push(d.high());
            this.lowest.push(d.low());

            // Plot history
            if (this.started) {
                const result = {
                    startDate: (isNewPeriod ? d : history.prior()).timestamp(),
                    endDate: d.timestamp(),
                    pivot: this.pivot,
                    resistance1: this.resistance1,
                    support1: this.support1,
                    resistance2: this.resistance2,
                    support2: this.support2
                };
                return result;
            }
        }
        return {};
    }

    filter(d) {
        return predef.filters.isNumber(d.pivot);
    }
}

module.exports = {
    name: "pivotPoints",
    title: "PivotPoints",
    description: "Pivot Points",
    calculator: pivotPoints,
    inputType: meta.InputType.BARS,
    plotter: predef.plotters.pivotpoints(["pivot", "resistance1", "support1", "resistance2", "support2"]),
    plots: {
        pivot: { title: "Pivot" },
        support1: { title: "Sup1" },
        support2: { title: "Sup2" },
        resistance1: { title: "Res1" },
        resistance2: { title: "Res2" }
    },
    tags: [predef.tags.Channels],
    schemeStyles: {
        dark: {
            pivot: predef.styles.plot("#FF9966"),
            resistance1: predef.styles.plot({ color: "#CC6600", lineStyle: 3 }),
            support1: predef.styles.plot({ color: "#CC6600", lineStyle: 3 }),
            resistance2: predef.styles.plot({ color: "#CC6600", lineStyle: 3 }),
            support2: predef.styles.plot({ color: "#CC6600", lineStyle: 3 }),
        }
    }
};
