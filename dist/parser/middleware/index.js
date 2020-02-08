"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getMiddlewares;

function getMiddlewares(config) {
  const {
    parser: {
      engine,
      middlewares: customMiddlewares
    }
  } = config;

  if (!engine) {
    throw new Error('No engine specified in config');
  }

  let platformMiddlewares = [];

  if (engine === 'react-native') {
    // eslint-disable-next-line global-require
    platformMiddlewares = require("./react-native/index").default;
  }

  return [...platformMiddlewares, ...customMiddlewares];
}