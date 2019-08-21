// META: global=jsshell
// META: script=/wasm/jsapi/wasm-module-builder.js

promise_test(async t => {
  const builder = new WasmModuleBuilder();
  builder.addImportedMemory("module", "memory", 0, 128);
  builder.exportMemoryAs("exportedmemory");
  const buffer = builder.toBuffer()

  const memory = new WebAssembly.Memory({ initial: 64, maximum: 128 });
  const {module, instance} = await WebAssembly.instantiate(buffer, {
    module: { memory }
  });
  const exported_memory = instance.exports.exportedmemory;
  assert_equals(exported_memory, memory);
}, "imports");

