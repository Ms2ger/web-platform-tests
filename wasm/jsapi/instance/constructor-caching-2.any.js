// META: global=jsshell
// META: script=/wasm/jsapi/wasm-module-builder.js

function host_function(f) {
  const builder = new WasmModuleBuilder();
  const functionIndex = builder.addImport("module", "imported", kSig_v_v);
  builder.addExport("exportedFunction", functionIndex);
  const buffer = builder.toBuffer();

  const module = new WebAssembly.Module(buffer);
  const instance = new WebAssembly.Instance(module, {
    "module": {
      "imported": f,
    }
  });
  return { module, hf: instance.exports.exportedFunction };
}

test(() => {
  const f = function() {};
  const { module, hf } = host_function(f);
  assert_not_equals(hf, f);

  const instance2 = new WebAssembly.Instance(module, {
    "module": {
      "imported": hf,
    }
  });
  assert_equals(instance2.exports.exportedFunction, hf);
}, "Comparing two exported host functions");

test(() => {
  const f = function() {};
  const { hf } = host_function(f);

  const argument = { "element": "anyfunc", "initial": 1 };
  const table = new WebAssembly.Table(argument);
  assert_equals(table.get(0), null);
  assert_throws_js(TypeError, () => table.set(0, f));
  assert_equals(table.get(0), null);
  table.set(0, hf);
  assert_equals(table.get(0), hf);
}, "Putting an exported host function in a table");
