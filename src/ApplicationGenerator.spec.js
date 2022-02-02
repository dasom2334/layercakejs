const assert = require("assert");
const ApplicationGenerator = require("./ApplicationGenerator");
const appQueueTestComponent = require("./components/appQueueTestComponenet");

describe("ApplicationGenerator", function () {
  it("appGenerator", function (done) {
    
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
  
    class AppGen extends ApplicationGenerator 
    {
      constructor() {
        super();
        this.appConfig = setQueue;
        this.beforeRoutedBaseMiddlewares = [funcs[0], funcs[1], funcs[1]];
        this.afterRoutedBaseMiddlewares = [funcs[1], funcs[0]];
        this.lastBaseMiddlewares = [funcs[2]];
      }
    }
    
    const appGen = (new AppGen());
    appGen.appGenerator().then(app => {
      // console.log(app)
      Object.entries(setQueue).map(([key, value]) => {
        assert.equal(app.get(key), value);
      });
      const bmQueue = appQueueTestComponent.makeQueueByMiddleware(appGen.beforeRoutedBaseMiddlewares);
      const amQueue = appQueueTestComponent.makeQueueByMiddleware(appGen.afterRoutedBaseMiddlewares);
      const lstQueue = appQueueTestComponent.makeQueueByMiddleware(appGen.lastBaseMiddlewares);
      const stcQueue = appQueueTestComponent.makeQueueByStack(app._router.stack);

      const totalQueue = [...bmQueue, ...amQueue, ...lstQueue];
      for (let i = stcQueue.length - 1; i >= 0; i--) {
        if (!funcs.includes(stcQueue[i][1])) continue;
        last = totalQueue.pop();
        assert.deepEqual(last, stcQueue[i]);
      }
      assert.deepEqual(totalQueue, []);
      done();
    }).catch(error => {
      done(error);
    });
    return appGen;
  });
});
