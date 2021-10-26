PP.XRUtils = {
    isDeviceEmulated: function () {
        let isEmulated = false;

        if (WL.xrSession) {
            let symbols = Object.getOwnPropertySymbols(WL.xrSession);
            isEmulated = symbols.length > 0;
        }

        return isEmulated;
    },
};