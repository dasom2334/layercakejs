const express = require("express");
const path = require("path");
const fsComponent = require("../components/fsComponent");
const stringComponent = require("../components/stringComponent");
const MiddlewareSetter = require("./MiddlewareSetter");

class AppSetter extends MiddlewareSetter {
  #lastMiddlewares = [];
  #sets = {};
  constructor() {
    super();
    this.container = express();
    this.CONTROLLER_TAIL = "Controller.js";
    this.RESOURCE_PATH = path.join(__dirname, "..", "resources");
    this.directories = [];
    this.routingSetting = {
      // 'directory_name': '/'
    };
  }

  get application() {
    return (async () => {
      try {
        await this.#getherDirs();
        this.useMiddlewares(this.beforeRoutedMiddlewares);
        await this.#addControllerResources();
        this.useMiddlewares(this.afterRoutedMiddlewares);
        this.container.use(this.errorCreator(404));
      } catch (error) {
        this.container.use(this.errorCreator(500));
        console.log(error);
      } finally {
        this.useMiddlewares(this.lastMiddlewares);
        const app = this.container;
        this.#initApp();
        return app;
      }
    })();
  }

  get lastMiddlewares() {
    return this.#lastMiddlewares.slice();
  }
  set lastMiddlewares(MiddlewareQueue) {
    this.#lastMiddlewares = MiddlewareQueue.slice();
  }

  get sets() {
    return Object.assign({}, this.#sets);
  }
  set sets(setQueue) {
    const newSetQueue = {};

    Object.entries(setQueue).map(([k, v]) => {
      newSetQueue[k] = v;
    });

    this.#sets = newSetQueue;
    this.#initApp();
  }

  #initApp = () => {
    this.container = express();
    this.#addSettings();
  };

  #getherDirs = async () => {
    if (
      this.container.get("all_resources")
        ? this.container.get("all_resources")
        : true
    ) {
      await this.#allResourceDirs();
    } else {
      this.#configResourceDirs();
    }
  };

  #addSettings = () => {
    Object.entries(this.#sets).map(([k, v]) => {
      this.container.set(k, v);
    });
  };
  #allResourceDirs = async () => {
    let directories = [];
    directories = await fsComponent.readDirctories(this.RESOURCE_PATH);
    this.directories = directories.slice();
  };

  #configResourceDirs = () => {
    let directories = this.container.get("resources")
      ? this.container.get("resources")
      : [];
    this.directories = directories.slice();
  };

  #addControllerResources = async () => {
    await Promise.all(
      this.directories.map((directory) => this.#addRouteByDirectory(directory))
    );
  };

  #addRouteByDirectory = async (directory) => {
    const resource_path = this.RESOURCE_PATH + "\\" + directory;
    const controller_regex = this.CONTROLLER_TAIL + "$";
    const regex = new RegExp(controller_regex);
    try {
      const files = await fsComponent.findFiles(resource_path, regex);
      await Promise.all(
        files.map((file) => this.#addRoute(file, resource_path))
      );
    } catch (e) {
      console.log(e);
    }
  };

  #addRoute = async (file, resource_path) => {
    const route = stringComponent.humanToDasher(
      file.replace(this.CONTROLLER_TAIL, "")
    );
    const checked_route = this.#checkRoutingSetting(route);
    try {
      const resourceControllerClass = require(resource_path + "\\" + file);
      const resourceController = new resourceControllerClass();
      const router = resourceController.routerGenerator();
      console.log(checked_route);
      this.container.use("/" + checked_route, router);
    } catch (e) {
      console.log("/" + checked_route);
      console.log(e);
      this.container.use("/" + checked_route, this.errorCreator(500));
    }
  };

  #checkRoutingSetting = (route) => {
    let checked_route = route;
    if (
      Object.entries(this.routingSetting)
        .map(([k, v]) => k)
        .includes(route)
    ) {
      checked_route = this.routingSetting[route];
      if (checked_route[0] == "/") {
        checked_route = checked_route.slice(1);
      }
    }
    return checked_route;
  };
}

module.exports = AppSetter;
