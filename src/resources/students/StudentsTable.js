const AppTable = require("../AppTable");
const StudentsEntity = require("./StudentsEntity");

class StudentsTable extends AppTable {
  constructor() {
    super();
    this.table_name = "students";
    this.entity = new StudentsEntity();
  }

  create = async (data) => {
    if (await this.checkeSameEmail(data.student_email)) {
      return false;
    }
    const checkedData = this.entity.fieldChecks(data);
    const [totalQuery, insetValues] = this.inserOneQuery(checkedData);
    return await this.excute(totalQuery, insetValues);
  };

  selectAll = async () => {
    let query =
      `SELECT * FROM ${this.table_name} WHERE student_status = 1`;
    return await this.excute(query);
  };

  selectOne = async (id_data) => {
    const id = parseInt(id_data);
    const query =
      `SELECT * FROM ${this.table_name} WHERE id = ? AND student_status = 1 `;
    return await this.excute(query, [id]);
  };

  updateOne = async (id, data, allowFields) => {
    if (await this.checkeSameEmail(data.student_email, id)) {
      return false;
    }
    const checkedData = this.entity.fieldChecks(data, allowFields);
    const [totalQuery, insetValues] = this.updateOneQuery(id, checkedData);
    return this.excute(totalQuery, insetValues);
  };

  delete = async (id) => {
    const data = {
      student_name: "",
      student_email: null,
      student_status: -1,
    };
    const result = await this.updateOne(id, data);
    const ls_results = await this.deleteManyLS(id);
    return [result, ls_results];
  };

  deleteManyLS = async (id) => {
    const query =
      `UPDATE lectures_students
      SET lecture_student_status = -1
      WHERE student_id = ?`;
    return await this.excute(query, [id]);
  };

  checkeSameEmail = async (email, id = 0) => {
    const query =
      `SELECT * FROM ${this.table_name}
      WHERE student_email =?
        AND id != ?
        AND student_status = 1
          LIMIT 1`;
    const result = await this.excute(query, [email, id]);
    return this.rowExsistsByResult(result);
  };
}

module.exports = StudentsTable;
