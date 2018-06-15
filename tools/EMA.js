function emaAlphaInit(period) {
    return 2 / (period + 1);
}

function ExponentialMovingAverage(period, alphaInit) {
    const alpha = alphaInit || emaAlphaInit(period);

    function ema(value) {
        return ema.push(value);
    }

    ema.reset = () => {
        ema.state = {
            previous: null,
            initialTotal: 0,
            initialCount: 0
        };
    };

    ema.push = (value) => {
        if (ema.state.initialCount < period) {
            ema.state.initialTotal += value;
            ++ema.state.initialCount;
            ema.state.previous = ema.state.initialTotal / ema.state.initialCount;
        }
        else {
            ema.state.previous = ema.state.previous + alpha * (value - ema.state.previous);
        }
        return ema.avg();
    };

    ema.avg = () => ema.state.previous;

    ema.reset();

    return ema;
}

module.exports = ExponentialMovingAverage;
