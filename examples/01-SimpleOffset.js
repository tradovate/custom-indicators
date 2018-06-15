class offset {
    map(d) {
        return d.value() - 2.0;
    }
}

module.exports = {
    name: "exampleOffset",
    calculator: offset
};
