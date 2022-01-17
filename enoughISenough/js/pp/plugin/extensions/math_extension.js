if (!PP) {
    var PP = {};
}

Math.pp_clamp = function (value, intervalStart, intervalEnd) {
    let fixedIntervalStart = (intervalStart != null) ? intervalStart : Number.MIN_VALUE;
    let fixedIntervalEnd = (intervalEnd != null) ? intervalEnd : Number.MAX_VALUE;

    let min = Math.min(fixedIntervalStart, fixedIntervalEnd);
    let max = Math.max(fixedIntervalStart, fixedIntervalEnd);
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

// Start interval value doesn't need to be lower than the end one, so you can map from [0,1] to [3,2], where 3 is greater than 2
Math.pp_mapToNewInterval = function (value, originIntervalStart, originIntervalEnd, newIntervalStart, newIntervalEnd) {
    if (originIntervalStart == originIntervalEnd) {
        return newIntervalStart;
    }

    let clampedValue = Math.pp_clamp(value, originIntervalStart, originIntervalEnd);

    if (clampedValue == originIntervalStart) {
        return newIntervalStart;
    } else if (clampedValue == originIntervalEnd) {
        return newIntervalEnd;
    }

    let newValue = newIntervalStart + ((newIntervalEnd - newIntervalStart) / (originIntervalEnd - originIntervalStart)) * (clampedValue - originIntervalStart);
    let clampedNewValue = Math.pp_clamp(newValue, newIntervalStart, newIntervalEnd);
    return clampedNewValue;
};

//Interval is [intervalStart, intervalEnd)
Math.pp_random = function (intervalStart = 0, intervalEnd = 1) {
    return Math.random() * (intervalEnd - intervalStart) + intervalStart;
};

//Interval is [intervalStart, intervalEnd]
Math.pp_randomInt = function (intervalStart, intervalEnd) {
    let min = Math.min(intervalStart, intervalEnd);
    let max = Math.max(intervalStart, intervalEnd);
    return Math.floor(Math.random() * (max - min + 1) + min);
};

//Return 1 or -1
Math.pp_randomSign = function () {
    return (Math.random() < 0.5) ? 1 : -1;
};

//You give it a list of parameters and returns one
Math.pp_randomPick = function (...args) {
    let random = null;

    if (args.length > 0) {
        if (args.length == 1 && args[0].length != null) {
            if (args[0].length > 0) {
                let randomIndex = Math.pp_randomInt(0, args[0].length - 1);
                random = args[0][randomIndex];
            }
        } else {
            let randomIndex = Math.pp_randomInt(0, args.length - 1);
            random = args[randomIndex];
        }
    }

    return random;
};

Math.pp_lerp = function (from, to, interpolationValue) {
    if (interpolationValue == 0) {
        return from;
    } else if (interpolationValue == 1) {
        return to;
    }

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
