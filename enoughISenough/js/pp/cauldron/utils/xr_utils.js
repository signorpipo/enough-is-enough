PP.XRUtils = {
    isDeviceEmulated: function () {
        let isEmulated = window.CustomWebXRPolyfill != null;
        return isEmulated;
    },
    isXRSessionActive: function () {
        return WL.xrSession != null;
    },
    openLink(url, newTab = true, exitXRSessionBeforeOpen = true, exitXRSessionOnSuccess = true, tryOpenLinkOnClickOnFailure = false, onSuccessCallback = null, onFailureCallback = null) {
        if (Global.myElementToClick != null) return;

        let element = document.createElement("a");

        element.style.display = "none";

        document.body.appendChild(element);

        element.addEventListener("click", function () {
            let targetPage = undefined;
            if (newTab) {
                targetPage = "_blank";
            } else {
                targetPage = "_top";
            }

            let result = window.open(url, targetPage);

            if (result != null) {
                if (!exitXRSessionBeforeOpen && exitXRSessionOnSuccess) {
                    if (WL.xrSession) {
                        try {
                            WL.xrSession.end();
                            Global.myXRSessionActiveOpenLinkExtraCheck = false;
                        } catch (error) {
                            // Do nothing
                        }
                    }
                }

                if (onSuccessCallback != null) {
                    onSuccessCallback();
                }
            } else {
                if (tryOpenLinkOnClickOnFailure) {
                    setTimeout(function () {
                        PP.XRUtils.openLinkOnClick(url, newTab, exitXRSessionOnSuccess, onSuccessCallback, onFailureCallback);
                    }, 100);
                } else if (onFailureCallback != null) {
                    onFailureCallback();
                }
            }
        });

        if (exitXRSessionBeforeOpen) {
            if (WL.xrSession) {
                try {
                    WL.xrSession.end();
                    Global.myXRSessionActiveOpenLinkExtraCheck = false;
                } catch (error) {
                    // Do nothing
                }
            }
        }

        Global.myElementToClick = element;
        Global.myElementToClickCounter = 3;
    },
    openLinkOnClick(url, newTab = true, exitXRSessionOnSuccess = true, onSuccessCallback = null, onFailureCallback = null) {
        document.addEventListener("click", function () {
            let targetPage = undefined;
            if (newTab) {
                targetPage = "_blank";
            } else {
                targetPage = "_top";
            }

            let result = window.open(url, targetPage);

            if (result != null) {
                if (exitXRSessionOnSuccess) {
                    if (WL.xrSession) {
                        try {
                            WL.xrSession.end();
                            Global.myXRSessionActiveOpenLinkExtraCheck = false;
                        } catch (error) {
                            // Do nothing
                        }
                    }
                }

                if (onSuccessCallback != null) {
                    onSuccessCallback();
                }
            } else {
                if (onFailureCallback != null) {
                    onFailureCallback();
                }
            }
        }, { once: true });
    }
};