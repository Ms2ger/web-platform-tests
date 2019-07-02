"use strict";

importScripts("/resources/testharness.js");
importScripts("/resources/WebIDLParser.js", "/resources/idlharness.js");

idl_test(
  ['dedicated-workers'],
  [],
  idlArray => {
    idlArray.add_objects({
      DedicatedWorkerGlobalScope: ['self'],
      WorkerNavigator: ['self.navigator'],
      WorkerLocation: ['self.location'],
    });
  }
);
