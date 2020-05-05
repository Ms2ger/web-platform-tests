// META: global=window,dedicatedworker,jsshell
// META: script=/wasm/jsapi/assertions.js
// META: script=/wasm/jsapi/memory/assertions.js

test(() => {
  const order = [];

  new WebAssembly.Memory({
    get maximum() {
      order.push("maximum");
      return {
        valueOf() {
          order.push("maximum valueOf");
          return 1;
        },
      };
    },

    get initial() {
      order.push("initial");
      return {
        valueOf() {
          order.push("initial valueOf");
          return 1;
        },
      };
    },
  });

  assert_array_equals(order, [
    "initial",
    "initial valueOf",
    "maximum",
    "maximum valueOf",
  ]);
}, "Order of evaluation for descriptor");

test(t => {
  const order = [];

  new WebAssembly.Memory({
    get maximum() {
      order.push("maximum");
      return {
        valueOf() {
          order.push("maximum valueOf");
          return 1;
        },
      };
    },

    get initial() {
      order.push("initial");
      return {
        valueOf() {
          order.push("initial valueOf");
          return 1;
        },
      };
    },

    get shared() {
      order.push("shared");
      return {
        valueOf: t.unreached_func("should not call shared valueOf"),
      };
    },
  });

  assert_array_equals(order, [
    "initial",
    "initial valueOf",
    "maximum",
    "maximum valueOf",
    "shared",
  ]);
}, "Order of evaluation for descriptor (with shared)");

test(() => {
  const order = [];

  new WebAssembly.Memory({
    get maximum() {
      order.push("maximum");
      return {
        valueOf() {
          order.push("maximum valueOf");
          return 1;
        },
      };
    },

    get initial() {
      order.push("initial");
      return {
        valueOf() {
          order.push("initial valueOf");
          return 1;
        },
      };
    },

    get minimum() {
      order.push("minimum");
      return undefined;
    },
  });

  assert_array_equals(order, [
    "initial",
    "initial valueOf",
    "maximum",
    "maximum valueOf",
    "minimum",
  ]);
}, "Order of evaluation for descriptor (with minimum, minimum=undefined)");

test(() => {
  const order = [];

  new WebAssembly.Memory({
    get maximum() {
      order.push("maximum");
      return {
        valueOf() {
          order.push("maximum valueOf");
          return 1;
        },
      };
    },

    get initial() {
      order.push("initial");
      return undefined;
    },

    get minimum() {
      order.push("minimum");
      return {
        valueOf() {
          order.push("minimum valueOf");
          return 1;
        },
      };
    },
  });

  assert_array_equals(order, [
    "initial",
    "maximum",
    "maximum valueOf",
    "minimum",
    "minimum valueOf",
  ]);
}, "Order of evaluation for descriptor (with minimum, initial=undefined)");
