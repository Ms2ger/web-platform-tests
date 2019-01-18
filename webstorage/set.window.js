["localStorage", "sessionStorage"].forEach(function(name) {
    [9, "x"].forEach(function(key) {
        test(function() {
            var value = "value";

            var storage = window[name];
            storage.clear();

            assert_equals(storage[key], undefined);
            assert_equals(storage.getItem(key), null);
            assert_equals(storage[key] = value, value);
            assert_equals(storage[key], "value");
            assert_equals(storage.getItem(key), "value");
        }, "Setting property for key " + key + " on " + name);

        test(function() {
            var value = {
                toString: function() { return "value"; }
            };

            var storage = window[name];
            storage.clear();

            assert_equals(storage[key], undefined);
            assert_equals(storage.getItem(key), null);
            assert_equals(storage[key] = value, value);
            assert_equals(storage[key], "value");
            assert_equals(storage.getItem(key), "value");
        }, "Setting property with toString for key " + key + " on " + name);
    });
});
