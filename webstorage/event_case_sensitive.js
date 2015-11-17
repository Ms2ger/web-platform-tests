iframe = document.createElement("IFRAME");
document.body.appendChild(iframe);

iframe.contentWindow.addEventListener("storage", function(e) {
    console.log(e)
    window.dispatchEvent(new CustomEvent("test-storage", {detail: e}));
});

function run_sequentially(tests) {
    var tests = tests.map(function(t) {
        return {
            test: async_test(t[0]),
            step: t[1],
        }
    });
    var step = function() {
        console.log("step", tests);
        var t = tests.shift();
        if (t === undefined) {
            return;
        }
        t.test.add_cleanup(() => { setTimeout(step, 0) });
        t.test.step(t.step);
    }
    step();
}

function run_storages(get_tests) {
    var tests = get_tests("sessionStorage").concat(get_tests("localStorage"));
    run_sequentially(tests);
}

run_storages(function(storageString) {
    return [
    [storageString + " storage events when the value doesn't change.", function() {
        assert_true(storageString in window, storageString + " exist");
        var storage = window[storageString];
        this.add_cleanup(function() { storage.clear() });

        storage.clear();
        assert_equals(storage.length, 0, "storage.length");
        storage.foo = "test";

        setTimeout(this.step_func(function() {
            window.addEventListener("test-storage", this.unreached_func("Storage event should not be fired for no-op changes"));
            storage.foo = "test";
            setTimeout(this.step_func_done(), 0);
        }), 0);
    }],
    [storageString + " storage events when only the case of the value changes.", function() {
        assert_true(storageString in window, storageString + " exist");
        var storage = window[storageString];
        this.add_cleanup(function() { storage.clear() });

        storage.clear();
        assert_equals(storage.length, 0, "storage.length");
        storage.foo = "test";

        setTimeout(this.step_func(function() {
            console.log("st")
            window.addEventListener("test-storage", this.step_func_done());
            storage.foo = "TEST";
        }), 0);
    }]
    ]
});
