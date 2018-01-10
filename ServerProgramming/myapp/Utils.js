var utils = {};

utils.compareTime = (input_d, d) => {
    input_d = new Date(input_d);
    d = new Date(d);
    input_d.setMinutes(input_d.getMinutes() - 30);
    return (d - input_d) > 0 && (d - input_d) <= 1800000
}

module.exports = utils;