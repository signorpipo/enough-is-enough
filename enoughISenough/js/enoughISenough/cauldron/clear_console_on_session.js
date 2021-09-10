WL.registerComponent("clear-console-on-session", {
}, {
    init: function () {
        WL.onXRSessionStart.push(function () { console.clear(); });
    },
    start: function () {
    },
    update: function (dt) {
    }
});