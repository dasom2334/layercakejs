const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const AppSetter = require("./expressSetter/AppSetter");
const appConfig = require("../configs/appConfig");

class ApplicationGenerator 
{
  constructor() {
    this.appConfig = appConfig;
    this.beforeRoutedBaseMiddlewares = [
      logger("dev"),
      express.json(),
      express.urlencoded({ extended: false }),
      cookieParser(),
      express.static(path.join(__dirname, "..", "public")),
    ];
    this.afterRoutedBaseMiddlewares = [];
    this.lastBaseMiddlewares = [this.#errorCatcher];
    this.appSetter = new AppSetter();
    this.appSetter.routingSetting = {
      index: '/'
    };
  }

  appGenerator = async () => {
    this.appSetter.sets = this.appConfig;
    this.appSetter.beforeRoutedMiddlewares = this.beforeRoutedBaseMiddlewares;
    this.appSetter.afterRoutedMiddlewares = this.afterRoutedBaseMiddlewares;
    this.appSetter.lastMiddlewares = this.lastBaseMiddlewares;
    const app = await this.appSetter.application;
    return app;
  }

  #errorCatcher = (err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {}
    res.status(err.status || 500);
    res.render("error");
  }
}

module.exports = ApplicationGenerator;
