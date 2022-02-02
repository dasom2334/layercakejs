const assert = require("assert");
const AppSetter = require("./AppSetter");
const appQueueTestComponent = require("../components/appQueueTestComponenet");


describe("AppSetter", function () {
  it("lastRoutedMiddlewares", function () {
    const appStter = new AppSetter();
    const queue = ["hellow", "bye"];

    appStter.lastMiddlewares = queue;
    const appStterQueue = appStter.lastMiddlewares;
    assert.deepEqual(queue, appStterQueue);

    queue[1] = "hi";
    assert.notDeepEqual(queue, appStterQueue);
  });
  it("sets", function () {
    const appStter = new AppSetter();
    const queue = {
      greeting: ["hellow", "bye"],
    };

    appStter.sets = queue;
    const appStterQueue = appStter.sets;
    assert.deepEqual(queue, appStterQueue);
  });
  it.skip("sets avoid shell copy", function () {
    const appStter = new AppSetter();
    const queue = {
      greeting: ["hellow", "bye"],
    };

    appStter.sets = queue;
    const appStterQueue = appStter.sets;
    queue.greetingp[0] = "hi";
    assert.notDeepEqual(queue, appStterQueue);
  });
  it("get application", function (done) {
    const appSetter = new AppSetter();
    const setQueue = {
      greeting: ["hellow", "bye"],
    };
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

    appSetter.sets = setQueue;
    appSetter.beforeRoutedMiddlewares = [funcs[0], funcs[1], funcs[1]];
    appSetter.afterRoutedMiddlewares = [funcs[1], funcs[0]];
    appSetter.lastMiddlewares = [funcs[2]];
    appSetter.application.then((app) => {
      Object.entries(setQueue).map(([key, value]) => {
        assert.equal(app.get(key), value);
      });
      
      const bmQueue = appQueueTestComponent.makeQueueByMiddleware(appSetter.beforeRoutedMiddlewares);
      const amQueue = appQueueTestComponent.makeQueueByMiddleware(appSetter.afterRoutedMiddlewares);
      const lstQueue = appQueueTestComponent.makeQueueByMiddleware(appSetter.lastMiddlewares);
      const stcQueue = appQueueTestComponent.makeQueueByStack(app._router.stack);

      const totalQueue = [...bmQueue, ...amQueue, ...lstQueue];
      for (let i = stcQueue.length - 1; i >= 0; i--) {
        if (!funcs.includes(stcQueue[i][1])) continue;
        last = totalQueue.pop();
        assert.deepEqual(last, stcQueue[i]);
      }
      assert.deepEqual(totalQueue, []);
      done();
    }).catch((error) => {
      done(error);
    });
  });
  it.skip("checkRoutingSetting", function (done) {
  });
});

