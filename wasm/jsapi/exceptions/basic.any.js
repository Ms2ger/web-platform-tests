// META: global=jsshell
// META: script=/wasm/jsapi/wasm-module-builder.js

promise_test(async () => {
  const kWasmAnyRef = 0x6f;
  const kSig_v_r = makeSig([kWasmAnyRef], []);
  const builder = new WasmModuleBuilder();
  const except = builder.addException(kSig_v_r);
  builder.addFunction("throw_param", kSig_v_r)
    .addBody([
      kExprGetLocal, 0,
      kExprThrow, except,
    ])
    .exportFunc();
  const buffer = builder.toBuffer();
  const {instance} = await WebAssembly.instantiate(buffer, {});
  const values = [
    undefined,
    null,
    true,
    false,
    "test",
    Symbol(),
    0,
    1,
    4.2,
    NaN,
    Infinity,
    {},
    () => {},
  ];
  for (const v of values) {
    assert_throws(new WebAssembly.RuntimeError(), () => instance.exports.throw_param(v),
                  String(v));
  }
}, "Wasm function throws argument");

promise_test(async () => {
  const kWasmAnyRef = 0x6f;
  const kSig_v_r = makeSig([kWasmAnyRef], []);
  const builder = new WasmModuleBuilder();
  const except = builder.addException(kSig_v_r);
  builder.addFunction("throw_null", kSig_v_v)
    .addBody([
      kExprRefNull,
      kExprThrow, except,
    ])
    .exportFunc();
  const buffer = builder.toBuffer();
  const {instance} = await WebAssembly.instantiate(buffer, {});
  assert_throws(new WebAssembly.RuntimeError(), () => instance.exports.throw_null());
}, "Wasm function throws null");

promise_test(async () => {
  const builder = new WasmModuleBuilder();
  const except = builder.addException(kSig_v_i);
  builder.addFunction("throw_int", kSig_v_v)
    .addBody([
      ...wasmI32Const(7),
      kExprThrow, except,
    ])
    .exportFunc();
  const buffer = builder.toBuffer();
  const {instance} = await WebAssembly.instantiate(buffer, {});
  assert_throws(new WebAssembly.RuntimeError(), () => instance.exports.throw_int());
}, "Wasm function throws integer");

promise_test(async () => {
  const kWasmAnyRef = 0x6f;
  const kSig_v_r = makeSig([kWasmAnyRef], []);
  const kSig_r_v = makeSig([], [kWasmAnyRef]);
  const builder = new WasmModuleBuilder();
  const fnIndex = builder.addImport("module", "fn", kSig_v_v);
  const except = builder.addException(kSig_v_r);
  builder.addFunction("catch_exception", kSig_r_v)
    .addBody([
      kExprTry, kWasmStmt,
        kExprCallFunction, fnIndex,
      kExprCatch,
        kExprReturn,
      kExprEnd,
      kExprRefNull,
    ])
    .exportFunc();

  const buffer = builder.toBuffer();

  const error = 7;
  const fn = () => { throw error };
  const {instance} = await WebAssembly.instantiate(buffer, {
    module: { fn }
  });
  const result = instance.exports.catch_exception();
  assert_equals(result, error);
}, "Imported JS function throws");

promise_test(async () => {
  const kExprRethrow = 0x09;
  const kWasmAnyRef = 0x6f;
  const kSig_v_r = makeSig([kWasmAnyRef], []);
  const kSig_r_v = makeSig([], [kWasmAnyRef]);
  const builder = new WasmModuleBuilder();
  const fnIndex = builder.addImport("module", "fn", kSig_v_v);
  const except = builder.addException(kSig_v_r);
  builder.addFunction("catch_and_rethrow", kSig_r_v)
    .addBody([
      kExprTry, kWasmStmt,
        kExprCallFunction, fnIndex,
      kExprCatch,
        kExprRethrow,
      kExprEnd,
      kExprRefNull,
    ])
    .exportFunc();

  const buffer = builder.toBuffer();

  class MyError extends Error {};
  const error = new MyError();
  const fn = () => { throw error };
  const {instance} = await WebAssembly.instantiate(buffer, { 
    module: { fn }
  });
  assert_throws(new MyError(), () => instance.exports.catch_and_rethrow());
}, "Imported JS function throws, Wasm catches and rethrows");


promise_test(async () => {
  const kWasmAnyRef = 0x6f;
  const kSig_r_v = makeSig([], [kWasmAnyRef]);
  const builder = new WasmModuleBuilder();
  builder.addFunction("return_null", kSig_r_v)
    .addBody([
      kExprRefNull,
      kExprReturn,
    ])
    .exportFunc();
  const buffer = builder.toBuffer();
  const {instance} = await WebAssembly.instantiate(buffer, {});
  assert_equals(instance.exports.return_null(), null);
}, "Wasm function returns null");


