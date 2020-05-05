// META: global=window,dedicatedworker,jsshell
// META: script=/wasm/jsapi/assertions.js
// META: script=/wasm/jsapi/memory/assertions.js

test(() => {
  assert_function_name(WebAssembly.Memory, "Memory", "WebAssembly.Memory");
}, "name");

test(() => {
  assert_function_length(WebAssembly.Memory, 1, "WebAssembly.Memory");
}, "length");

test(() => {
  assert_throws_js(TypeError, () => new WebAssembly.Memory());
}, "No arguments");

test(() => {
  const argument = { "initial": 0 };
  assert_throws_js(TypeError, () => WebAssembly.Memory(argument));
}, "Calling");

test(() => {
  const invalidArguments = [
    undefined,
    null,
    false,
    true,
    "",
    "test",
    Symbol(),
    1,
    NaN,
    {},
  ];
  for (const invalidArgument of invalidArguments) {
    assert_throws_js(TypeError,
                     () => new WebAssembly.Memory(invalidArgument),
                     `new Memory(${format_value(invalidArgument)})`);
  }
}, "Invalid descriptor argument");

test(() => {
  assert_throws_js(TypeError, () => new WebAssembly.Memory({ "initial": undefined }));
}, "Undefined initial value in descriptor");

const outOfRangeValues = [
  NaN,
  Infinity,
  -Infinity,
  -1,
  0x100000000,
  0x1000000000,
];

for (const value of outOfRangeValues) {
  test(() => {
    assert_throws_js(TypeError, () => new WebAssembly.Memory({ "initial": value }));
  }, `Out-of-range initial value in descriptor: ${format_value(value)}`);

  test(() => {
    assert_throws_js(TypeError, () => new WebAssembly.Memory({ "initial": 0, "maximum": value }));
  }, `Out-of-range maximum value in descriptor: ${format_value(value)}`);
}

test(() => {
  assert_throws_js(RangeError, () => new WebAssembly.Memory({ "initial": 10, "maximum": 9 }));
}, "Initial value exceeds maximum");

test(() => {
  assert_throws_js(TypeError, () => new WebAssembly.Memory({ "initial": 10, "shared": true }));
}, "Shared memory without maximum");

test(() => {
  const proxy = new Proxy({}, {
    has(o, x) {
      assert_unreached(`Should not call [[HasProperty]] with ${x}`);
    },
    get(o, x) {
      return 0;
    },
  });
  new WebAssembly.Memory(proxy);
}, "Proxy descriptor");

test(() => {
  const argument = { "initial": 0 };
  const memory = new WebAssembly.Memory(argument);
  assert_Memory(memory, { "size": 0 });
}, "Zero initial");

test(() => {
  const argument = { "initial": 4 };
  const memory = new WebAssembly.Memory(argument);
  assert_Memory(memory, { "size": 4 });
}, "Non-zero initial");

test(() => {
  const argument = { "initial": 0 };
  const memory = new WebAssembly.Memory(argument, {});
  assert_Memory(memory, { "size": 0 });
}, "Stray argument");

test(() => {
  const argument = { "initial": 4, "maximum": 10, shared: true };
  const memory = new WebAssembly.Memory(argument);
  assert_Memory(memory, { "size": 4, "shared": true });
}, "Shared memory");
