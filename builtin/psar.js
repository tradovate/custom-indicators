const predef = require("../tools/predef");
const meta = require("../tools/meta");
const MovingHigh = require("../tools/MovingHigh");
const MovingLow = require("../tools/MovingLow");

class parabolicSAR {
    init() {
        this.highest = new MovingHigh();
        this.lowest = new MovingLow();
        this.uptrend = true;
        this.risingSAR = null;
        this.fallingSAR = null;
        const step = this.props.step;
        this.risingAF = step;
        this.fallingAF = step;
    }

    map(d, i, history) {
        let value = null;
        const step = this.props.step;
        const maxStep = this.props.maxStep;
        const prevUptrend = this.uptrend;
        const high = d.high();
        const low = d.low();

        const getRisingSAR = (prevRisingSAR) => {
            if (prevRisingSAR === null) {
                prevRisingSAR = d.low();
            }
            // Current SAR = Prior SAR + Prior AF(Prior EP - Prior SAR)
            this.risingSAR = prevRisingSAR + this.risingAF * (this.highest.current() - prevRisingSAR);
            // Ensure risingSAR is below the previous 2 lows
            this.risingSAR = this.risingSAR > history.prior().low() || this.risingSAR > history.back(2).low() ? Math.min(history.prior().low(), history.back(2).low()) : this.risingSAR;
            this.risingAF = d.high() > this.highest.current() ? Math.min(this.risingAF + step, maxStep) : this.risingAF;
            return this.risingSAR;
        };

        const getFallingSAR = (prevFallingSAR) => {
            if (prevFallingSAR === null) {
                prevFallingSAR = d.high();
            }
            // Current SAR = Prior SAR - Prior AF(Prior SAR - Prior EP)
            this.fallingSAR = prevFallingSAR - this.fallingAF * (prevFallingSAR - this.lowest.current());
            // Ensure fallingSAR is above previous 2 highs
            this.fallingSAR = this.fallingSAR < history.prior().high() || this.fallingSAR < history.back(2).high()
                ? Math.max(history.prior().high(), history.back(2).high())
                : this.fallingSAR;
            this.fallingAF = d.low() < this.lowest.current() ? Math.min(this.fallingAF + step, maxStep) : this.fallingAF;
            return this.fallingSAR;
        };

        // Must be at least 2 prior periods
        if (i > 1) {
            if (this.uptrend) { // Rising SAR
                const prevRisingSAR = this.risingSAR === null ? d.low() : this.risingSAR;
                value = getRisingSAR(prevRisingSAR);

                // Stop And Reverse Trend
                if (value < prevRisingSAR) {
                    this.uptrend = false;
                    this.risingSAR = null;
                    this.fallingAF = step;
                    this.highest.reset();
                    this.lowest.reset();
                    this.highest.push(high);
                    this.lowest.push(low);
                    value = getFallingSAR(null);
                }
            }
            else { // Falling SAR
                const prevFallingSAR = this.fallingSAR === null ? d.high() : this.fallingSAR;
                value = getFallingSAR(prevFallingSAR);

                // Stop And Reverse Trend
                if (value > prevFallingSAR) {
                    this.uptrend = true;
                    this.fallingSAR = null;
                    this.risingAF = step;
                    this.highest.reset();
                    this.lowest.reset();
                    this.highest.push(high);
                    this.lowest.push(low);
                    value = getRisingSAR(null);
                }
            }

            // Track High and Low
            if (prevUptrend === this.uptrend) {
                this.highest.push(high);
                this.lowest.push(low);
            }
        }
        else {
            this.highest.push(high);
            this.lowest.push(low);
        }

        return value;
    }
}

module.exports = {
    name: "psar",
    description: "Parabolic SAR",
    calculator: parabolicSAR,
    params: {
        step: predef.paramSpecs.number(0.02, 0.02, 0.02),
        maxStep: predef.paramSpecs.number(0.20, 0.02, 0.02)
    },
    inputType: meta.InputType.BARS,
    plotter: predef.plotters.scatter,
    schemeStyles: predef.styles.solidLine("#8cecff")
};
