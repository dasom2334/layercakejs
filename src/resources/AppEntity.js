const Router = require("express").Router;

class AppEntity
{
  constructor() {
    this.type = {
      id: 'int',
      created: 'datetime',
      modified: 'datetime',
    }
  }
  fieldChecks = (data, allowFields = []) => {
    const allowsData = this.fieldAllowCheck(data, allowFields);
    const typeFilteredData = this.fieldTypeCheck(allowsData);
    return typeFilteredData;
  }

  fieldAllowCheck = (data, allows = []) => {
    let allowsData = {};
    // let allowFields = allows;
    let allowFields = allows;
    if (!allows.length) {
        allowFields = Object.entries(this.type).map(([key, type]) => key);
    }
    Object.entries(data).map(([key, value]) => {
        if (allowFields.includes(key)) {
            allowsData[key] = value;
        }
    });
    return allowsData;
  }

  fieldTypeCheck = (data) => {
    let checkedData = data;
    Object.entries(data).map(([key, value]) => {
      switch (this.type[key]) {
        case 'int':
          checkedData[key] = parseInt(checkedData[key]);
          break;
      }
    });
    return checkedData;
  }

}

module.exports = AppEntity;
