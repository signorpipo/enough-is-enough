PP.XRUtils = {
    isDeviceEmulated: function () {
        let isEmulated = ('CustomWebXRPolyfill' in window);
        return isEmulated;
    },
    isXRSessionActive: function () {
        return WL.xrSession != null;
    },
    openLink(url, newTab = true, exitXRSession = true, onSuccessCallback = null, onFailureCallback = null) {
        if (exitXRSession) {
            if (WL.xrSession) {
                WL.xrSession.end();
            }
        }

        let element = document.createElement("a");

        element.style.display = "none";

        document.body.appendChild(element);

        element.addEventListener("click", function () {
            let targetPage = undefined;
            if (newTab) {
                targetPage = "_blank";
            }

            let result = window.open(url, targetPage);

            if (result != null) {
                if (onSuccessCallback != null) {
                    onSuccessCallback();
                }
            } else {
                if (onFailureCallback != null) {
                    onFailureCallback();
                }
            }
        });

        element.click();

        document.body.removeChild(element);
    },
    openLinkPersistent(url, newTab = true, exitXRSession = true, timeOutSeconds = null, onSuccessCallback = null, onFailureCallback = null) {
        let totalSeconds = 0;
        let secondsTillNextAttempt = 0.5;
        let onPersistentFailureCallback = function (...args) {
            if (timeOutSeconds != null && totalSeconds >= timeOutSeconds) {
                if (onFailureCallback != null) {
                    onFailureCallback(...args);
                }
            } else {
                totalSeconds += secondsTillNextAttempt;
                setTimeout(function () {
                    PP.XRUtils.openLink(url, newTab, exitXRSession, onSuccessCallback, onPersistentFailureCallback);
                }, secondsTillNextAttempt * 1000);
            }
        };

        PP.XRUtils.openLink(url, newTab, exitXRSession, onSuccessCallback, onPersistentFailureCallback);
    }
};