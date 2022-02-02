const Router = require("express").Router;
const dbConfig = require("../../configs/dbConfig");
const mysql = require('mysql2/promise');
const AppEntity = require("./AppEntity");


// simple query
class AppTable // extends Table 
{
  constructor() {
    this.connection = mysql.createPool(dbConfig.default);
    // this.connection = mysql.createConnection(dbConfig.default);
    this.table_name = '';
    this.entity = new AppEntity();
  }

  
  selectAll = async () => {
    let query = 'SELECT * FROM `'+this.table_name+'`';
    const result = await this.excute(query);
    return result
  }

  connection = async () => {
    return await mysql.createConnection(dbConfig.default);
  }

  excute = async (totalQuery, values = []) => {
    const connection = await this.connection.getConnection();
    let result = false;
    console.log('hi')
    try {
      result = await connection.query(totalQuery, values);
    } catch (error) {
      console.log(error);
    } finally {
      connection.release();
      return result;
    }
    // console.log(result);
    // console.log(values);
  }


  inserByUniqueNameQuery = (data, field_name) => {
    const totalQuery = 
    `INSERT INTO ${this.table_name}
      (${Object.entries(data).map(e => e[0])})
      SELECT ${Object.entries(data).map(e => '?')} 
      FROM dual  WHERE NOT EXISTS \
      (SELECT ${field_name} FROM ${this.table_name} WHERE ${field_name} = ?)`;
    const values = [...Object.entries(data).map(e => e[1]), data[field_name]];
    return [totalQuery, values];
  }

  inserOneQuery = (data) => {
    const totalQuery = 
    `INSERT INTO ${this.table_name}
      (${Object.entries(data).map(e => e[0])})
      VALUES (${Object.entries(data).map(e => '?')})`;
    const values = Object.entries(data).map(e => e[1]);
    return [totalQuery, values];
  }

  updateOneQuery = (id, data) => {
    const totalQuery = 
    `UPDATE ${this.table_name}
      SET ${Object.entries(data).map(e => e[0]+' =?')}
      WHERE id =?`;
    const values = [...Object.entries(data).map(e => e[1]), id];
    return [totalQuery, values];
  }

  rowExsistsByResult = (result) => {
    return(result && result[0].length > 0);
  }

  getOnlyOneFieldRecordsByResult = (result, field_name) => {
    return (result) ? result[0].map((e) => e[field_name]) : result;
  }

  

  checkeExistsById = async (id, addWhere = '') => {
    const query =
      `SELECT id FROM ${this.table_name} 
        WHERE id = ?  ${addWhere} 
        LIMIT 1`;
    const result = await this.excute(query, [id]);

    return this.rowExsistsByResult(result);
  };
}

module.exports = AppTable;
