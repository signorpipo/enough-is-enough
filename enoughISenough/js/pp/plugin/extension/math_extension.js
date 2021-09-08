Math.pp_clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};

Math.pp_toDegrees = function (angle) {
    return angle * (180 / Math.PI);
};

Math.pp_toRadians = function (angle) {
    return glMatrix.glMatrix.toRadian(angle);
};

Math.pp_roundDecimal = function (number, decimalPlaces) {
    let factor = Math.pow(10, decimalPlaces);
    number = Math.round(number * factor) / factor;

    return number;
};

Math.pp_mapToNewInterval = function (value, originIntervalLeft, originIntervalRight, newIntervalLeft, newIntervalRight) {
    let newValue = newIntervalLeft + ((newIntervalRight - newIntervalLeft) / (originIntervalRight - originIntervalLeft)) * (value - originIntervalLeft);
    return newValue;
};

//Interval is [min, max)
Math.pp_random = function (min = 0, max = 1) {
    return Math.random() * (max - min) + min;
};

//Interval is [min, max]
Math.pp_randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

Math.pp_lerp = function (from, to, interpolationValue) {
    return interpolationValue * (to - from) + from;
};
