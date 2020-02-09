"use strict";

var _bluebird = _interopRequireDefault(require("bluebird"));

var Figma = _interopRequireWildcard(require("figma-api"));

var _lodash = _interopRequireDefault(require("lodash"));

var _cosmiconfig = require("cosmiconfig");

var _parser = _interopRequireDefault(require("./parser"));

var _fileGenerator = _interopRequireDefault(require("./file-generator"));

var _utils = require("./utils");

var _ResponsiveSettings = _interopRequireDefault(require("../tests/Responsive.settings.json"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const {
  config
} = (0, _cosmiconfig.cosmiconfigSync)('figma-to-react-cli').search();
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
  const pagesJson = pageNames && pageNames.length > 0 ? pageNames.map(nodeName => (0, _utils.findNodeByName)(document, nodeName)) : document.children; // fs.writeFileSync(
  //   `src/assets/tests/${pageJson.name}.json`,
  //   JSON.stringify(pageJson, null, ' '),
  // );

  console.log('Parsing...');

  const context = _objectSpread({}, config, {
    figmaApi
  });

  const sourceMap = await (0, _parser.default)({
    pagesJson: pagesJson[0],
    imagesJson,
    settingsJson: _ResponsiveSettings.default,
    context
  });
  console.log('Exporting...');
  await (0, _fileGenerator.default)({
    sourceMap,
    context
  });
  console.log('All done!');
}).catch(console.error);