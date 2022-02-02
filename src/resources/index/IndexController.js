const AppController = require("../AppController");
// var router = require("express").Router();

class IndexController extends AppController 
{
  constructor () {
    super();
    this.routes = {
      "/": {
        get: [this.index],
      },
    };
  }

  index = (req, res, next)  => {
    // res.locals.message = 'heelo';
    res.render("./index");
  }
}
module.exports = IndexController;
