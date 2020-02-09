#!/usr/bin/env node
"use strict";

var _bluebird = _interopRequireDefault(require("bluebird"));

var Figma = _interopRequireWildcard(require("figma-api"));

var _lodash = _interopRequireDefault(require("lodash"));

var _cosmiconfig = require("cosmiconfig");

var _parser = _interopRequireDefault(require("./parser"));

var _fileGenerator = _interopRequireDefault(require("./file-generator"));

var _utils = require("./utils");

var _constants = require("./constants");

var _defaultConfig = _interopRequireDefault(require("./default-config"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  config: cfg
} = (0, _cosmiconfig.cosmiconfigSync)('figma-to-react-cli').search();

const config = _lodash.default.defaultsDeep(cfg, _defaultConfig.default);

const {
  figma: {
    personalAccessToken,
    fileKey,
    pageNames
  }
} = config; // https://www.figma.com/developers/api

const figmaApi = new Figma.Api({
  personalAccessToken
});

_bluebird.default.all([figmaApi.getFile(fileKey), figmaApi.getImageFills(fileKey)]).then(async ([{
  document
}, {
  meta: {
    images: imagesJson
  }
}]) => {
  console.log('Getting data from Figma...');
  const pagesJson = pageNames && pageNames.length > 0 ? pageNames.map(nodeName => (0, _utils.findNodeByName)(document, nodeName)) : document.children;

  if (!pagesJson || pagesJson.length === 0) {
    console.log(`Can not find any page/canvas mentioned in ${pageNames}`);
    return;
  }

  const settingsJson = pagesJson.reduce((sum, pageJson) => {
    const settingsFrame = (0, _utils.findNodeByName)(pageJson, _constants.STORE_NAME);

    if (!settingsFrame) {
      console.warn(`Can not find Frame with name '${_constants.STORE_NAME}' inside page '${pageJson.name}'`);
      return sum;
    }

    const settingsTextNode = (0, _utils.findNodeByName)(settingsFrame, _constants.TEXT_STORE_NAME);

    if (!settingsTextNode) {
      console.warn(`Can not find TextNode with name '${_constants.TEXT_STORE_NAME}' inside page '${pageJson.name}'`);
      return sum;
    }

    const settingsText = settingsTextNode.characters;

    if (!settingsText) {
      console.warn(`TextNode with settings is empty inside page '${pageJson.name}'. No reason to process this page.`);
      return sum;
    }

    return _objectSpread({}, sum, JSON.parse(settingsText));
  }, {});
  console.log('Parsing...');

  const context = _objectSpread({}, config, {
    figmaApi
  });

  const sourceMap = await _bluebird.default.reduce(pagesJson, async (sum, pageJson) => {
    const map = await (0, _parser.default)({
      pageJson,
      imagesJson,
      settingsJson,
      context
    });
    return _objectSpread({}, sum, map);
  }, {});
  console.log('Exporting...');
  await (0, _fileGenerator.default)({
    sourceMap,
    context
  });
  console.log('All done!');
}).catch(console.error);