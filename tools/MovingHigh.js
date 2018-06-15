const movingExtreme = require("./MovingExtreme");

module.exports = movingExtreme((oldValue, newValue) => oldValue <= newValue);
