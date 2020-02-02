"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getMiddlewares;

function getMiddlewares(config) {
  const {
    parser: {
      engine = 'react-native',
      middlewares: customMiddlewares
    }
  } = config;
  let platformMiddlewares = [];

  if (engine === 'react-native') {
    // eslint-disable-next-line global-require
    platformMiddlewares = require("./react-native/index").default;
  }

  return [...platformMiddlewares, ...customMiddlewares];
}