class offset {
    map(d) {
        return d.value() - this.props.offset;
    }
}

module.exports = {
    name: "exampleOffset",
    calculator: offset,
    params: {
        offset: {
                type: "number",
                def: 2.0,
                restrictions: {
                    step: 0.25,
                    min: 0.0
                }
        }
    }
};
