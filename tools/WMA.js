function triangular(value) {
    return (value / 2) * (value + 1);
}

function WeightedMovingAverage(period) {
    function wma(value) {
        return wma.push(value);
    }

    wma.reset = () => {
        wma.state = {
            items: []
        };
    };

    wma.push = (value) => {
        wma.state.items.push(value);
        if (wma.state.items.length > period) {
            wma.state.items.shift();
        }
        return wma.avg();
    };

    wma.avg = () => {
        const items = wma.state.items;
        const denominator = triangular(items.length);
        function wmaAccumulator(sum, value, index) {
            return sum + (value * (index + 1) / denominator);
        }
        return items.reduce(wmaAccumulator, 0);
    };

    wma.reset();

    return wma;
}

module.exports = WeightedMovingAverage;
