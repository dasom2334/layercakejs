const Router = require("express").Router;
const Controller = require("../expressSetter/Controller");
const AppTable = require("./AppTable");

class AppController extends Controller 
{
  constructor() {
    super();
    this.container = Router();
    this.beforeRoutes = {
      "*": {
        get: [this.menus],
      },
    };
    this.routes = {};
    this.afterRoutes = {};
    this.beforeRoutedMiddlewares = [];
    this.afterRoutedMiddlewares = [];
    this.resource = new AppTable();
  }

  menus = (req, res, next)  => {
    const menus = [
      {
        name: '수강생',
        link: '/students',
        icon: 'users',
      },
    ];
    res.locals.menus = menus;
    next();
  }


  all = async (req, res, next)  => {
    const result = await this.resource.selectAll();
    res.locals[this.resource.table_name] = result;
    next();
  }

  beforeRender = (req, res, next) => {
    if (req.query.flash) {
      res.locals.flash = req.query.flash;
    } else {
      res.locals.flash = '';
    }
    next();
  }
  beforeFilter = (req, res, next) => {
    next();
  }
  afterFilter = (req, res, next) => {
    next();
  }
  afterRender = (req, res, next) => {
    if (res.locals.render) {
      res.render(res.locals.render);
      delete res.locals.render;
    } else {
      next();
    }
  }
}

module.exports = AppController;
