const lodash = require("lodash");
const predef = require("../tools/predef");
const meta = require("../tools/meta");
const SMA = require("../tools/SMA");
const MovingHigh = require("../tools/MovingHigh");
const MovingLow = require("../tools/MovingLow");

class priceActionSwing {
    init() {
        this.swingVolume = new SMA();
        this.highest = new MovingHigh();
        this.lowest = new MovingLow();
        this.prevPoint = undefined;
        this.softPoint = undefined;
    }

    map(d, i, history) {
        let value;
        let newPoint;
        let lastPoint;
        const percent = this.props.filter / 100;

        if (i === 0) {
            this.prevPoint = d;
        }

        const tickSize = history.contractInfo().tickSize();

        // swingVolume is treated carefully throughout setting points and holding total volume for swings
        this.swingVolume.push(d.volume());
        this.highest.push(d.high(), i);
        this.lowest.push(d.low(), i);

        if (this.softPoint) {
            // Up
            if (this.softPoint.peak) {
                const p1 = this.softPoint.high();
                const low = d.low();

                // New 'Higher' Point?
                if (d.high() >= p1) {
                    lodash.merge(this.softPoint, d, { totalVolume: this.softPoint.intialVolume + this.swingVolume.sum() });
                }// Reversed? Set 'High' point and track 'Low' candidate
                else if ((p1 - low) >= (percent * p1)) {
                    newPoint = this.softPoint;
                    const intialVolume = (this.softPoint.intialVolume + this.swingVolume.sum()) - newPoint.totalVolume;
                    this.softPoint = lodash.merge({}, d, {
                        peak: false,
                        intialVolume, // Save intialVolume before swingVolume.refresh
                        totalVolume: intialVolume
                    });
                }
            }// DOWN
            else {
                const p1 = this.softPoint.low();
                const high = d.high();

                // New 'Lower' Point?
                if (d.low() <= p1) {
                    lodash.merge(this.softPoint, d, { totalVolume: this.softPoint.intialVolume + this.swingVolume.sum() });
                }// Reversed? Set 'Low' point and track 'High' candidate
                else if ((high - p1) >= (percent * p1)) {
                    newPoint = this.softPoint;
                    const intialVolume = (this.softPoint.intialVolume + this.swingVolume.sum()) - newPoint.totalVolume;
                    this.softPoint = lodash.merge({}, d, {
                        peak: true,
                        intialVolume, // Save intialVolume before swingVolume.refresh
                        totalVolume: intialVolume
                    });
                }
            }
        }
        else { // First Point
            // UP
            if (d.high() - this.prevPoint.low() >= percent * this.prevPoint.low()) {
                this.softPoint = lodash.merge({
                    peak: true,
                    intialVolume: 0, // swingVolume will contain total volume for first swing
                    totalVolume: this.swingVolume.sum()
                }, d);
            }
            // DOWN
            else if (this.prevPoint.high() - d.low() >= percent * this.prevPoint.high()) {
                this.softPoint = lodash.merge({
                    peak: false,
                    intialVolume: 0, // swingVolume will contain total volume for first swing
                    totalVolume: this.swingVolume.sum()
                }, d);
            }
        }

        if (i === history.data.length - 1) {
            lastPoint = this.softPoint;

            // No points determined within range, so just make one
            if (!lastPoint) {
                const peak = this.highest.current() - this.prevPoint.low() > this.prevPoint.high() - this.lowest.current();
                const index = peak ? this.highest.index() : this.lowest.index();
                lastPoint = lodash.merge({
                    peak,
                    intialVolume: 0, // swingVolume will contain full volume for first swing
                    totalVolume: this.swingVolume.state.items.slice(0, index + 1).reduce((a, b) => a + b, 0)
                }, history.getItem(index));
            }
        }

        if (lastPoint || newPoint) {
            const previous = this.prevPoint;
            const current = lastPoint || newPoint;

            const priceDiff = current.peak ? (current.high() - previous.low())
                : (current.low() - previous.high());

            const coordinates = {
                text: [undefined, `${Math.round(priceDiff / tickSize)},${Math.round(current.totalVolume / 1000)}K`],
                x: [
                    previous.timestamp(),
                    current.timestamp()
                ],
                y: [
                    previous.peak === false || current.peak ? previous.low()
                        : previous.high(),
                    current.peak ? current.high() : current.low()
                ]
            };

            const upSwing = current.peak;
            const volumeUp = previous.totalVolume ? current.totalVolume > previous.totalVolume : false;

            // Last two swings
            if (lastPoint) {
                if (lastPoint.timestamp() !== d.timestamp()) {
                    const priceDiff = current.peak ? (d.low() - current.high()) :
                        (d.high() - current.low());
                    const lastVolume = (current.intialVolume + this.swingVolume.sum()) - current.totalVolume;
                    const lastData = `${Math.round(priceDiff / tickSize)},${Math.round(lastVolume / 1000)}K`;
                    coordinates.text.push(lastData);
                    const currentGreen = (upSwing && volumeUp) || (!upSwing && !volumeUp);
                    const lastGreen = (!upSwing && (lastVolume > current.totalVolume)) || (upSwing && !(lastVolume > current.totalVolume));

                    // Last swing estimated at current bar, seperate line style if needed, else add last swing to current style
                    if (currentGreen === lastGreen) {
                        coordinates.x.push(d.timestamp());
                        coordinates.y.push(current.peak ? d.low() : d.high());
                    }
                    else {
                        if (currentGreen) {
                            value = {
                                green: coordinates
                            };
                        }
                        else {
                            value = {
                                red: coordinates
                            };
                        }

                        if (lastGreen) {
                            value.green = lodash.cloneDeep(coordinates);
                            value.green.text.splice(1, 1);
                            value.green.x.shift();
                            value.green.y.shift();
                            value.green.x.push(d.timestamp());
                            value.green.y.push(current.peak ? d.low() : d.high());
                        }
                        else {
                            value.red = lodash.cloneDeep(coordinates);
                            value.red.text.splice(1, 1);
                            value.red.x.shift();
                            value.red.y.shift();
                            value.red.x.push(d.timestamp());
                            value.red.y.push(current.peak ? d.low() : d.high());
                        }
                    }
                }
            }


            if (!value && ((upSwing && volumeUp) || (!upSwing && !volumeUp))) {
                value = {
                    green: coordinates
                };
            }
            else if (!value && ((!upSwing && volumeUp) || (upSwing && !volumeUp))) {
                value = {
                    red: coordinates
                };
            }

            this.prevPoint = current;
            this.swingVolume.reset();
        }

        return value;
    }

    filter(d) {
        return !!d;
    }
}

module.exports = {
    name: "jigsaw",
    title: "Pr.Act.Swing",
    description: "Price Action Swing",
    calculator: priceActionSwing,
    params: {
        filter: predef.paramSpecs.percent(0.10, 0.02, 0.01, 100.0)
    },
    inputType: meta.InputType.BARS,
    plotter: predef.plotters.zigzag(["green", "red"]),
    plots: {
        green: { title: "Green" },
        red: { title: "Red" }
    },
    schemeStyles: {
        dark: {
            green: predef.styles.plot("#00CC66"),
            red: predef.styles.plot("#B30000")
        }
    }
};
