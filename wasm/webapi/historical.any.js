// META: global=window,worker
// META: script=../resources/load_wasm.js

promise_test(async t => {
  const db_name = "WebAssembly";
  const obj_store = "store";
  const module_key = "module";

  await new Promise((resolve, reject) => {
    var delete_request = indexedDB.deleteDatabase(db_name);
    delete_request.onsuccess = resolve;
  });

  const db = await new Promise((resolve, reject) => {
    const open_request = indexedDB.open(db_name);
    open_request.onupgradeneeded = function() {
      open_request.result.createObjectStore(obj_store);
    };
    open_request.onsuccess = function() {
      resolve(open_request.result);
    };
  });

  const mod = await WebAssembly.compileStreaming(fetch('../incrementer.wasm'));
  var tx = db.transaction(obj_store, 'readwrite');
  var store = tx.objectStore(obj_store);
  assert_throws("DataCloneError", () => store.put(mod, module_key));
});
