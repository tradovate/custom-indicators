const CBuffer = require("./CBuffer");

function StdDevSummator(period) {
    function stdDev(value) {
        return stdDev.push(value);
    }

    stdDev.reset = () => {
        stdDev.state = {
            items: new CBuffer(period),
            sumX: 0,
            sumXX: 0
        };
    };

    stdDev.push = (value) => {
        if (stdDev.state.items.length === period) {
            const old = stdDev.state.items.shift();
            stdDev.state.sumX -= old;
            stdDev.state.sumXX -= old * old;
        }
        stdDev.state.items.push(value);
        stdDev.state.sumX += value;
        stdDev.state.sumXX += value * value;
        return stdDev.stdev();
    };

    stdDev.stdev = () => {
        const n = stdDev.state.items.length;
        return Math.sqrt((n * stdDev.state.sumXX - stdDev.state.sumX * stdDev.state.sumX) / (n * (n - 1)));
    };

    stdDev.avg = () => stdDev.state.sumX / stdDev.state.items.length;

    stdDev.reset();

    return stdDev;
}

module.exports = StdDevSummator;
