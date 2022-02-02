const assert = require("assert");
const fsComponent = require("./fsComponent");

describe("fsComponent", function () {
  it("readDirctories", function (done) {
    fsComponent
      .readDirctories("./")
      .then(() => done())
      .catch(() => expect(e));
    fsComponent
      .readDirctories("wefef")
      .then(() => done())
      .catch((e) => expect(e));
  });
  it("findFiles", function (done) {
    fsComponent
      .findFiles("./")
      .then(() => done())
      .catch(() => expect());
    fsComponent
      .findFiles("nononowe")
      .then(() => done())
      .catch(() => expect());
  });
});
