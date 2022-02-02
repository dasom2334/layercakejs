const path = require("path");
// app.set(name, value)
// http://expressjs.com/en/api.html#app.set
module.exports = {
  // 'case sensitive routing': undefined, //Boolean
  // env: process.env.NODE_ENV,
  // etag: weak // Varied
  // 'jsonp callback name': 'callback', // String
  // 'json escape': undefined, // Boolean
  // 'json replacer': undefined, // Varied
  // 'json spaces': undefined, // Varied
  // 'query parser': "extended", //Varied
  // 'strict routing': undefined, // Boolean
  // 'subdomain offset': 2, // Number
  // 'trust proxy': false, // Varied
  views: path.join(__dirname, "..", "views"), // String or Array
  // 'view cache':false, // Boolean (true in production, otherwise undefined.)
  "view engine": "jade", // String
  // 'x-powered-by':true, // Boolean

  all_resources: true,
  resources: ["", "students", "wwf"],
};
