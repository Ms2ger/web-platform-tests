// META: global=window,worker
// META: script=/wasm/jsapi/wasm-constants.js
// META: script=/wasm/jsapi/wasm-module-builder.js

for (const method of ["compileStreaming", "instantiateStreaming"]) {
  promise_test(t => {
    const buffer = new WasmModuleBuilder().toBuffer();
    const argument = new Response(buffer, { headers: { "Content-Type": "application/wasm" } });
    argument.arrayBuffer();
    return promise_rejects(t, new TypeError(), WebAssembly[method](argument));
  }, `${method}`);
}
