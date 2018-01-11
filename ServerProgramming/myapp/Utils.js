var utils = {};

utils.compareTime = (input_d, d) => {
    input_d = new Date(input_d);
    d = new Date(d);
    input_d.setMinutes(input_d.getMinutes() - 30);
    return (d - input_d) > 0 && (d - input_d) <= 1800000
}

utils.stringToTime = (t_str, t) => {
    if(t_str.length == 4){
        t.setHours(t_str.substring(0, 2));
        t.setMinutes(t_str.substring(2, 4));
        return t
    }
    else{
        console.log("Invalid Time Format");
    }
}

utils.compareTimeLength = (d, start, stop) => {
    d = new Date(d);
    start = utils.stringToTime(start, new Date("Thu Jan 11 2018"));
    stop = utils.stringToTime(stop, new Date("Thu Jan 11 2018"));
    return (d.getTime() >= start.getTime()) > 0 && (d.getTime() <= stop.getTime())
}


module.exports = utils;