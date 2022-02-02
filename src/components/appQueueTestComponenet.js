const appQueueTestComponent = {
  makeQueueByRoutes: function (routes) {
    let queue = [];
    Object.entries(routes).map(([path, obj]) => {
      Object.entries(obj).map(([method, callbacks]) => {
        if (Array.isArray(callbacks)) {
          callbacks.map((callback) => {
            queue.push([method, callback]);
          });
        } else {
          queue.push([method, callbacks]);
        }
      });
    });
    return queue;
  },
  makeQueueByMiddleware: function (mddw) {
    return mddw.map((q) => [undefined, q]);
  },
  makeQueueByStack: function (stack) {
    let queue = [];
    stack.map((layer) => {
      if (layer.route) {
        layer.route.stack.map((l) => {
          const method = l.method ? l.method : "all";
          const q = [method, l.handle];
          queue.push(q);
        });
      } else {
        queue.push([undefined, layer.handle]);
      }
    });
    return queue;
  },
};

module.exports = appQueueTestComponent;
