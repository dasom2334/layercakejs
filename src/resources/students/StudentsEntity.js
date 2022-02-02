const Router = require("express").Router;
const AppEntity = require("../AppEntity");

class StudentsEntity extends AppEntity 
{
  constructor() {
    super();
    this.type = {
      id: 'int',
      student_name: 'string',
      student_email: 'string',
      student_status: 'int',
    }
  }

}

module.exports = StudentsEntity;
