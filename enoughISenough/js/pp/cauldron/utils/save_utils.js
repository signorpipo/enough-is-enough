PP.SaveUtils = {
    save: function (id, data) {
        localStorage.setItem(id, data);
    },
    load: function (id) {
        return localStorage.getItem(id);
    },
    has: function (id) {
        return localStorage.getItem(id) != null;
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
        let item = localStorage.getItem(id);

        if (item != null) {
            return Number(item);
        }

        return null;
    }
};