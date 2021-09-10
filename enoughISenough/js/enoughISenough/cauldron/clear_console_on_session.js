WL.registerComponent("clear-console-on-session", {
}, {
    init: function () {
    },
    start: function () {
        WL.onXRSessionStart.push(function () { console.clear(); });
    },
    update: function (dt) {
    }
});