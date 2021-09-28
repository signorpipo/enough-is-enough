PP.SaveUtils = {
    save: function (id, data) {
        localStorage.setItem(id, data);
    },
    has: function (id) {
        return PP.SaveUtils.loadString(id) != null;
    },
    delete: function (id) {
        return localStorage.removeItem(id);
    },
    clear: function () {
        return localStorage.clear();
    },
    loadString: function (id) {
        return localStorage.getItem(id);
    },
    loadNumber: function (id) {
        let item = PP.SaveUtils.loadString(id);

        if (item != null) {
            return Number(item);
        }

        return null;
    },
    loadBool: function (id) {
        let item = PP.SaveUtils.loadString(id);

        if (item == "true") {
            return true;
        } else if (item == "false") {
            return false;
        }

        return null;
    }
};