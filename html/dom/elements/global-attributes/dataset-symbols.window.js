test(function() {
  var key = Symbol();
  var d = document.createElement("div");
  var ds = d.dataset;

  ds[key] = "test";
  assert_equals(ds[key], "test");
  assert_equals(d.attributes.length, 0);
}, "plain set + get (loose)");

test(function() {
  "use strict";
  var key = Symbol();
  var d = document.createElement("div");
  var ds = d.dataset;

  ds[key] = "test";
  assert_equals(ds[key], "test");
}, "plain set + get (strict)");

test(function() {
  var key = Symbol();
  var d = document.createElement("div");
  var ds = d.dataset;

  Object.defineProperty(ds, key, { "value": "test" });
  assert_equals(ds[key], "test");
}, "defineProperty + get");

test(function() {
  var key = Symbol();
  var d = document.createElement("div");
  var ds = d.dataset;

  Object.defineProperty(ds, key, { "value": "test", "configurable": false });
  assert_equals(ds[key], "test");
  var desc = Object.getOwnPropertyDescriptor(ds, key);
  assert_true(desc.configurable, "configurable");

  assert_true(delete ds[key]);
  assert_equals(ds[key], undefined);
}, "defineProperty not configurable");

test(function() {
  var key = Symbol();
  var d = document.createElement("div");
  var ds = d.dataset;

  DOMStringMap.prototype[key] = "test";
  this.add_cleanup(function() { delete DOMStringMap.prototype[key]; });

  assert_equals(ds[key], "test");
  var desc = Object.getOwnPropertyDescriptor(ds, key);
  assert_equals(desc, undefined);
}, "get with symbol on prototype");
