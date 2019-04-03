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

        test(function() {
            Storage.prototype[key] = "proto";
            this.add_cleanup(function() { delete Storage.prototype[key]; });

            var value = "value";

            var storage = window[name];
            storage.clear();

            assert_equals(storage[key], "proto");
            assert_equals(storage.getItem(key), null);
            assert_equals(storage[key] = value, value);
            // Hidden because no [OverrideBuiltins].
            assert_equals(storage[key], "proto");
            assert_equals(Object.getOwnPropertyDescriptor(storage, key), undefined);
            assert_equals(storage.getItem(key), "value");
        }, "Setting property for key " + key + " on " + name + " with data property on prototype");

        test(function() {
            Storage.prototype[key] = "proto";
            this.add_cleanup(function() { delete Storage.prototype[key]; });

            var value = "value";

            var storage = window[name];
            storage.clear();

            storage.setItem(key, "existing");

            // Hidden because no [OverrideBuiltins].
            assert_equals(storage[key], "proto");
            assert_equals(Object.getOwnPropertyDescriptor(storage, key), undefined);
            assert_equals(storage.getItem(key), "existing");
            assert_equals(storage[key] = value, value);
            assert_equals(storage[key], "proto");
            assert_equals(Object.getOwnPropertyDescriptor(storage, key), undefined);
            assert_equals(storage.getItem(key), "value");
        }, "Setting property for key " + key + " on " + name + " with data property on prototype and existing item");

        test(function() {
            var calledSetter = [];
            Object.defineProperty(Storage.prototype, key, {
                "get": function() { return "proto getter"; },
                "set": function(v) { calledSetter.push(v); },
                configurable: true,
            });
            this.add_cleanup(function() { delete Storage.prototype[key]; });

            var value = "value";

            var storage = window[name];
            storage.clear();

            assert_equals(storage[key], "proto getter");
            assert_equals(storage.getItem(key), null);
            assert_equals(storage[key] = value, value);
            // Property is hidden because no [OverrideBuiltins].
            if (typeof key === "number") {
                // P is an array index: call through to OrdinarySetWithOwnDescriptor()
                assert_array_equals(calledSetter, [value]);
                assert_equals(storage[key], "proto getter");
                assert_equals(storage.getItem(key), null);
            } else {
                // P is not an array index: early return in [[Set]] step 2.
                // https://github.com/heycam/webidl/issues/630
                assert_equals(storage[key], "proto getter");
                assert_equals(Object.getOwnPropertyDescriptor(storage, key), undefined);
                assert_equals(storage.getItem(key), "value");
            }
        }, "Setting property for key " + key + " on " + name + " with accessor property on prototype");

        test(function() {
            var value = "value";

            var storage = window[name];
            storage.clear();

            var originalPrototype = Object.getPrototypeOf(sessionStorage);
            var calledSetter = 0;
            var proxyPrototype = new Proxy(originalPrototype, {
                set(target, p, v, receiver) {
                
                    ++calledSetter;
                    assert_equals(target, originalPrototype);
                    assert_equals(p, key);
                    assert_equals(v, value);
                    assert_equals(receiver, storage);
                    return false;
                },
            });
            Object.setPrototypeOf(sessionStorage, proxyPrototype);
            this.add_cleanup(function() { Object.setPrototypeOf(sessionStorage, originalPrototype); });
            assert_equals(storage[key] = value, value);
            assert_equals(storage[key], undefined);
            assert_equals(storage.getItem(key), null);
            assert_equals(calledSetter, 1);
        }, "Setting property for key " + key + " on " + name + " with proxy on prototype");

        test(function() {
            var value = "value";

            var storage = window[name];
            storage.clear();

            var originalPrototype = Object.getPrototypeOf(storage);
            var calledSetter = 0;
            var proxyPrototype = new Proxy(originalPrototype, {
                set(target, p, v, receiver) {
                
                    ++calledSetter;
                    assert_equals(target, originalPrototype);
                    assert_equals(p, key);
                    assert_equals(v, value);
                    assert_equals(receiver, storage);
                    return false;
                },
            });
            Object.setPrototypeOf(storage, proxyPrototype);
            this.add_cleanup(function() { Object.setPrototypeOf(storage, originalPrototype); });

            var object = Object.create(storage);
            assert_equals(object[key] = value, value);
//            assert_equals(storage[key], undefined);
            assert_equals(storage.getItem(key), null);
            assert_equals(calledSetter, 1);
        }, "Setting property for key " + key + " with " + name + " as prototype with proxy on prototype");
    });
});
