const Router = require("express").Router;
const MiddlewareSetter = require("./MiddlewareSetter");

class Controller extends MiddlewareSetter 
{
  #beforeFilterMiddleware;
  #afterFilterMiddleware;
  constructor() {
    super();
    this.container = Router();
    this.beforeRoutes = {};
    this.routes = {};
    this.afterRoutes = {};
  }

  initRouter = () => {
    this.container = Router();
  };

  addRoutes = (routes) => {
    Object.entries(routes).map(([path, callbacksAll]) => {
      Object.entries(callbacksAll).forEach(([method, callbacks]) => {
        try {
          this.container[method](path, callbacks);
        } catch (error) {
          console.log(path, this.constructor.name);
          console.log(error);
          this.container[method](path, this.errorCreator(500));
        }
      });
    });
  };

  setFilters = () => {
    this.#beforeFilterMiddleware = [
        this.beforeRender,
        this.beforeFilter,
    ];
    this.#afterFilterMiddleware = [
        this.afterFilter,
        this.afterRender,
    ];
  }

  routerGenerator = () => {
    this.setFilters();
    this.useMiddlewares(this.#beforeFilterMiddleware);
    this.useMiddlewares(this.beforeRoutedMiddlewares);
    this.addRoutes(this.beforeRoutes);
    this.addRoutes(this.routes);
    this.addRoutes(this.afterRoutes);
    this.useMiddlewares(this.afterRoutedMiddlewares);
    this.useMiddlewares(this.#afterFilterMiddleware);
    const router = this.container;

    this.initRouter();
    return router;
  };

  beforeRender = (req, res, next) => {
    next();
  }
  beforeFilter = (req, res, next) => {
    next();
  }
  afterFilter = (req, res, next) => {
    next();
  }
  afterRender = (req, res, next) => {
    next();
  }
}

module.exports = Controller;
