if (!PP) {
    var PP = {};
}

Math.pp_clamp = function (value, start, end) {
    let fixedStart = (start != null) ? start : Number.MIN_VALUE;
    let fixedEnd = (end != null) ? end : Number.MAX_VALUE;

    let min = Math.min(fixedStart, fixedEnd);
    let max = Math.max(fixedStart, fixedEnd);
    return Math.min(Math.max(value, min), max);
};

Math.pp_sign = function (value, zeroSign = 1) {
    let sign = Math.sign(value);
    if (sign == 0) {
        sign = Math.sign(zeroSign);
    }
    return sign;
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

// Start range value doesn't need to be lower than the end one, so you can map from [0,1] to [3,2], where 3 is greater than 2
Math.pp_mapToRange = function (value, originRangeStart, originRangeEnd, newRangeStart, newRangeEnd) {
    if (originRangeStart == originRangeEnd) {
        return newRangeStart;
    }

    let clampedValue = Math.pp_clamp(value, originRangeStart, originRangeEnd);

    if (clampedValue == originRangeStart) {
        return newRangeStart;
    } else if (clampedValue == originRangeEnd) {
        return newRangeEnd;
    }

    let newValue = newRangeStart + ((newRangeEnd - newRangeStart) / (originRangeEnd - originRangeStart)) * (clampedValue - originRangeStart);
    let clampedNewValue = Math.pp_clamp(newValue, newRangeStart, newRangeEnd);
    return clampedNewValue;
};

//Range is [start, end)
Math.pp_random = function (start = 0, end = 1) {
    return Math.random() * (end - start) + start;
};

//Range is [start, end]
Math.pp_randomInt = function (start, end) {
    let min = Math.min(start, end);
    let max = Math.max(start, end);
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

Math.pp_angleDistance = function (first, second) {
    return Math.pp_angleDistanceDegrees(first, second);
};

Math.pp_angleDistanceDegrees = function (first, second) {
    return Math.abs(Math.pp_angleDistanceSignedDegrees(first, second));
};

Math.pp_angleDistanceRadians = function (first, second) {
    return Math.abs(Math.pp_angleDistanceSignedRadians(first, second));
};

Math.pp_angleDistanceSigned = function (first, second) {
    return Math.pp_angleDistanceSignedDegrees(first, second);
};

Math.pp_angleDistanceSignedDegrees = function (first, second) {
    let clampedFirst = Math.pp_angleClampDegrees(first, true);
    let clampedSecond = Math.pp_angleClampDegrees(second, true);

    let distance = clampedSecond - clampedFirst;
    if (clampedSecond - clampedFirst > 180) {
        distance = (clampedSecond - clampedFirst) - 360;
    } else if (clampedSecond - clampedFirst < -180) {
        distance = (clampedSecond - clampedFirst) + 360;
    }

    return distance;
};

Math.pp_angleDistanceSignedRadians = function (first, second) {
    return Math.pp_toRadians(Math.pp_angleDistanceSignedDegrees(Math.pp_toDegrees(first), Math.pp_toDegrees(second)));
};

//Clamp the angle to -180/+180, so that, for example, 270 will be -90
//if usePositiveRange is true, the angle will be clamped to 0/360
Math.pp_angleClamp = function (angle, usePositiveRange = false) {
    return Math.pp_angleClampDegrees(angle, usePositiveRange);
};

//Clamp the angle to -180/+180, so that, for example, 270 will be -90
//if usePositiveRange is true, the angle will be clamped to 0/360
Math.pp_angleClampDegrees = function (angle, usePositiveRange = false) {
    let clampedAngle = angle % 360;

    if (clampedAngle < 0) {
        clampedAngle += 360;
    }

    if (!usePositiveRange) {
        if (clampedAngle > 180) {
            clampedAngle -= 360;
        }
    }

    return clampedAngle;
};

//Clamp the angle to -Pi/+Pi, so that, for example, 270 will be -90
//if usePositiveRange is true, the angle will be clamped to 0/2Pi
Math.pp_angleClampRadians = function (angle, usePositiveRange = false) {
    return Math.pp_toRadians(Math.pp_angleClampDegrees(Math.pp_toDegrees(angle), usePositiveRange));
};

//The range goes from start to end by going toward the positive direction (if useShortestAngle is false)
//[20,300] is a 280 degrees range, [300, 20] is an 80 degrees range, [-150,-170] = [210, 190] is a 240 degrees range, [0, -10] = [0, 350] is a 350 degrees range
Math.pp_isInsideAngleRange = function (angle, start, end, useShortestAngle = false) {
    return Math.pp_isInsideAngleRangeDegrees(angle, start, end, useShortestAngle);
};

Math.pp_isInsideAngleRangeDegrees = function (angle, start, end, useShortestAngle = false) {
    let isInside = false;

    let anglePositive = Math.pp_angleClampDegrees(angle, true);
    let startPositive = Math.pp_angleClampDegrees(start, true);
    let endPositive = Math.pp_angleClampDegrees(end, true);

    if (useShortestAngle) {
        if (Math.pp_angleDistanceSignedDegrees(startPositive, endPositive) < 0) {
            let temp = startPositive;
            startPositive = endPositive;
            endPositive = temp;
        }
    }

    if (startPositive < endPositive) {
        isInside = anglePositive >= startPositive && anglePositive <= endPositive;
    } else {
        isInside = anglePositive >= startPositive || anglePositive <= endPositive;
    }

    return isInside;
};

Math.pp_isInsideAngleRangeRadians = function (angle, start, end, useShortestAngle = false) {
    return Math.pp_isInsideAngleRangeDegrees(Math.pp_toDegrees(angle), Math.pp_toDegrees(start), Math.pp_toDegrees(end), useShortestAngle);
};

for (let key in Math) {
    let prefixes = ["pp_", "_pp_"];

    let found = false;
    for (let prefix of prefixes) {
        if (key.startsWith(prefix)) {
            found = true;
            break;
        }
    }

    if (found) {
        Object.defineProperty(Math, key, { enumerable: false });
    }
}