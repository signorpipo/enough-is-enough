if (!PP) {
    var PP = {};
}

Math.pp_clamp = function (value, intervalStart, intervalEnd) {
    if (intervalStart < intervalEnd) {
        return Math.min(Math.max(value, intervalStart), intervalEnd);
    }
    return Math.min(Math.max(value, intervalEnd), intervalStart);
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

// Start interval value doesn't need to be lower than the end one, so you can map from [0,1] to [3,2], where 3 is greater than 2
Math.pp_mapToNewInterval = function (value, originIntervalStart, originIntervalEnd, newIntervalStart, newIntervalEnd) {
    let clampedValue = Math.pp_clamp(value, originIntervalStart, originIntervalEnd);
    let newValue = newIntervalStart + ((newIntervalEnd - newIntervalStart) / (originIntervalEnd - originIntervalStart)) * (clampedValue - originIntervalStart);
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

PP.EasingFunction = {
    linear: t => t,
    easeIn: t => t * t * t,
    easeOut: t => (t - 1) * (t - 1) * (t - 1) + 1,
    easeInOut: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};

Math.pp_interpolate = function (from, to, interpolationValue, easingFunction = PP.EasingFunction.linear) {
    let lerpValue = easingFunction(interpolationValue);
    return Math.pp_lerp(from, to, lerpValue);
};
