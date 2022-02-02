const fs = require("fs");
const fsComponent = {
  findFiles: function (path, regex = ".*") {
    return new Promise(function (resolve, reject) {
      fs.readdir(path, { withFileTypes: true }, (error, files) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            files
              .filter((file) => file.isFile() && file.name.match(regex))
              .map((file) => file.name)
          );
        }
      });
    });
  },
  readDirctories: function (path) {
    return new Promise(function (resolve, reject) {
      fs.readdir(path, { withFileTypes: true }, (error, directories) => {
        if (error) {
          reject(error);
        } else {
          resolve(
            directories
              .filter((directory) => directory.isDirectory())
              .map((directory) => directory.name)
          );
        }
      });
    });
  },
};

module.exports = fsComponent;
