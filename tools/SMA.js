function MovingAverage(period) {
    function sma(value) {
        return sma.push(value);
    }

    sma.reset = () => {
        sma.state = {
            items: [],
            sumX: 0
        };
    };

    sma.push = (value) => {
        sma.state.items.push(value);
        sma.state.sumX += value;

        if (sma.state.items.length > period) {
            sma.state.sumX -= sma.state.items.shift();
        }
        return sma.avg();
    };

    sma.sum = () => sma.state.sumX;

    sma.avg = () => sma.state.sumX / sma.state.items.length;

    sma.meanDeviation = () => {
        const avg = sma.state.sumX / sma.state.items.length;
        let sum = 0;

        for (let i = 0; i < sma.state.items.length; i++) {
            sum += Math.abs(sma.state.items[i] - avg);
        }

        return sum / sma.state.items.length;
    };

    sma.reset();

    return sma;
}

module.exports = MovingAverage;
