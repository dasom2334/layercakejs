const createError = require("http-errors");

class MiddlewareSetter 
{
  #beforeRoutedMiddlewares = [];
  #afterRoutedMiddlewares = [];
  container = null;

  constructor() {}

  get beforeRoutedMiddlewares() {
    return this.#beforeRoutedMiddlewares.slice();
  }
  set beforeRoutedMiddlewares(MiddlewareQueue) {
    this.#beforeRoutedMiddlewares = MiddlewareQueue.slice();
  }

  get afterRoutedMiddlewares() {
    return this.#afterRoutedMiddlewares.slice();
  }
  set afterRoutedMiddlewares(MiddlewareQueue) {
    this.#afterRoutedMiddlewares = MiddlewareQueue.slice();
  }

  errorCreator = (error_code) => (req, res, next) => {
    next(createError(error_code));
  }

  useMiddlewares = (middlewareQueue) => {
    middlewareQueue.map((middleware) => this.container.use(middleware));
  };
}

module.exports = MiddlewareSetter;
