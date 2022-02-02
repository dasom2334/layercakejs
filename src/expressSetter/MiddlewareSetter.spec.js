const express = require("express");
const assert = require("assert");
const MiddlewareSetter = require("./MiddlewareSetter");
const createError = require("http-errors");

describe("MiddlewareSetter", function () {
  it("beforeRoutedMiddlewares", function () {
    const mSetter = new MiddlewareSetter();
    const queue = ["hellow", "bye"];

    mSetter.beforeRoutedMiddlewares = queue;
    const mSetterQueue1 = mSetter.beforeRoutedMiddlewares;
    assert.deepEqual(queue, mSetterQueue1);
    
    queue[1] = "hi";
    assert.notDeepEqual(queue, mSetterQueue1);
  });
  it("afterRoutedMiddlewares", function () {
    const mSetter = new MiddlewareSetter();
    const queue = ["hellow", "bye"];
    
    mSetter.afterRoutedMiddlewares = queue;
    const mSetterQueue1 = mSetter.afterRoutedMiddlewares;
    
    assert.deepEqual(queue, mSetterQueue1);
    queue[1] = "hi";
    assert.notDeepEqual(queue, mSetterQueue1);
  });
  it("errorCreator", function () {
    const mSetter = new MiddlewareSetter();
    const error_code = 400;
    const next = function (error) {
      assert.deepEqual(error, createError(error_code));
      return error;
    }
    const result = mSetter.errorCreator(error_code)(1, 1, next);
  });
  it("useMiddlewares", function () {
    const mSetter = new MiddlewareSetter();
    mSetter.container = express();
    const testFunc = function (req, res, next) {
      return req;
    }
    mSetter.useMiddlewares([testFunc]);
    const lastLayer = mSetter.container._router.stack.pop();
    assert.deepEqual(testFunc, lastLayer.handle);
  });
});


