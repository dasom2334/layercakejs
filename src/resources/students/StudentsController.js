const AppController = require("../AppController");
const StudentsTable = require("./StudentsTable");
const url = require('url');    

class StudentsController extends AppController 
{
  constructor () {
    super();
    this.resource = new StudentsTable();
    this.routes = {
      "*": {
        get: this.title
      },
      "/": {
        get: [this.all, this.index],
        post: [this.create],
      },
      "/:id": {
        post: [this.delete],
        put: [this.delete],
        patch: [this.delete],
        delete: [this.delete],
      },
      "/form": {
        get: [this.fields],
      },
    };
  }

  title = async(req, res, next)  => {
    res.locals.title = '학생';
    next();
  }

  fields = async(req, res, next)  => {
    res.locals.render = './students/form';
    next();
  }

  index = async(req, res, next)  => {
    if (req.query.id) {
      res.redirect(url.format({
        pathname:"/students/"+req.query.id,
      }));
    }
    res.locals.render = './students/index';
    next();
  }

  

  create = async (req, res, next)  => {
    // const data = req.body;
    const data = req.body;
    const result = await this.resource.create(data);
    if (result[0]) {
      res.redirect(url.format({
        pathname:"/students",
        query: {
           "flash":"저장되었습니다."
         }
      }));
    } else {
      res.redirect(url.format({
        pathname:"/students/form",
        query: {
           "flash":"저장되지 않았습니다. 동일한 이메일의 수강생이 있을 수 있습니다."
         }
      }));
    }
  }
  
  
  view = async(req, res, next)  => {
    const {id} = req.params;
    const result = await this.resource.selectOne(id);
    if (result.length > 0) {
      res.locals.student = result;
    } else {
      res.locals.student = null;
    }
    next();
  }


  delete = async(req, res, next)  => {
    if (req.method.toLowerCase() == 'delete' || req.body._method.toLowerCase() == 'delete') {
      const {id} = req.params;
      const result = await this.resource.delete(id);
      if (result) {
        res.redirect(url.format({
          pathname:"/students",
          query: {
            "flash":"삭제되었습니다."
          }
        }));
      } else {
        res.redirect(url.format({
          pathname:"/students",
          query: {
           "flash":"삭제되지 않았습니다."
          }
        }));
      }
    } else {
      next();
    }
  }
}
module.exports = StudentsController;
