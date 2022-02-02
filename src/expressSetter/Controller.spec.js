// const assert = require('assert');

const assert = require("assert");
const Controller = require("./Controller");
const appQueueTestComponent = require("../components/appQueueTestComponenet");
const Router = require("express").Router;

describe("Controller", function () {
  // only tested all, get, post, patch, put, delete.
  it("initRouter", function () {
    const ctrl = new Controller();
    const foo = 'hellow';
    ctrl.container = foo;
    ctrl.initRouter();
    assert.deepEqual(ctrl.container.stack, []);
  });
  it("addRoutes", function () {
    const ctrl = new Controller();
    const a = () => {};
    const b = () => {};

    const routes = {
      "/": {
        all: a,
        get: [a, b],
      },
      "/:param1": {
        all: [b, a, a, a],
        get: b,
      },
    }
    ctrl.addRoutes(routes);

    const rQueue = appQueueTestComponent.makeQueueByRoutes(routes);
    const sQueue = appQueueTestComponent.makeQueueByStack(ctrl.container.stack);
    assert.deepEqual(rQueue, sQueue);
  });
  it("routerGenerator", function () {
    const ctrl = new Controller();
    const funcs = [
      function a() {
        console.log("hi");
      },
      function b() {
        console.log("hellow");
      },
      function c() {
        console.log("what's up");
      },
    ];
    ctrl.beforeRoutedMiddlewares = [funcs[0], funcs[1], funcs[2]];
    ctrl.afterRoutedMiddlewares = [funcs[1], funcs[2]];
    ctrl.beforeRoutes = {
      "/": {
        all: [funcs[1], funcs[0], funcs[0], funcs[2]],
        get: [funcs[0], funcs[2]],
      },
      "/:param1": {
        all: funcs[0],
        get: funcs[1],
      },
    }
    ctrl.afterRoutes = {
      "/": {
        all: funcs[0],
        get: [funcs[0], funcs[2]],
      },
      "/:param1": {
        all: [funcs[1], funcs[0], funcs[0], funcs[2]],
        get: funcs[1],
      },
    }
    ctrl.routes = {
      "/": {
        all: funcs[0],
        get: [funcs[1], funcs[0], funcs[2]],
      },
      "/:param1": {
        all: [funcs[1], funcs[1], funcs[1], funcs[2]],
        get: funcs[1],
      },
    }
    const router = ctrl.routerGenerator();

    const bmQueue = appQueueTestComponent.makeQueueByMiddleware(ctrl.beforeRoutedMiddlewares);
    const bQueue = appQueueTestComponent.makeQueueByRoutes(ctrl.beforeRoutes);
    const rQueue = appQueueTestComponent.makeQueueByRoutes(ctrl.routes);
    const aQueue = appQueueTestComponent.makeQueueByRoutes(ctrl.afterRoutes);
    const amQueue = appQueueTestComponent.makeQueueByMiddleware(ctrl.afterRoutedMiddlewares);

    const queue = [...bmQueue, ...bQueue, ...rQueue, ...aQueue, ...amQueue];
    const sQueue = appQueueTestComponent.makeQueueByStack(router.stack);
    for (let i = sQueue.length - 1; i >= 0; i--) {
      if (!funcs.includes(sQueue[i][1])) continue;
      last = queue.pop();
      assert.deepEqual(last, sQueue[i]);
    }
    assert.deepEqual(queue, []);
  });
});