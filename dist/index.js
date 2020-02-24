"use strict";

var _defaultConfig = _interopRequireDefault(require("./default-config"));

var utils = _interopRequireWildcard(require("./utils"));

var _eslint = _interopRequireDefault(require("./plugins/eslint"));

var _prettier = _interopRequireDefault(require("./plugins/prettier"));

var _androwShadow = _interopRequireDefault(require("./plugins/androw-shadow"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  defaultConfig: _defaultConfig.default,
  utils,
  beautify: {
    eslint: _eslint.default,
    prettier: _prettier.default
  },
  plugins: {
    androwShadow: _androwShadow.default
  }
};