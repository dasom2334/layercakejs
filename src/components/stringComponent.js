const stringComponent = {
  camelToSlug: function (text) {
    return text.replace(/[A-Z]+/g, (char) => "-" + char.toLowerCase());
  },
  humanToDasher: function (text) {
    return text.replace(/^[A-Z]+/g, (char) => char.toLowerCase())
    .replace(/[A-Z]+/g, (char) => "-" + char.toLowerCase());
  },
};

module.exports = stringComponent;
// https://book.cakephp.org/4/en/core-libraries/inflector.html