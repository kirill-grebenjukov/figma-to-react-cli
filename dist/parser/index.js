"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parsePage;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _middleware = _interopRequireDefault(require("./middleware"));

var _parseFrame = _interopRequireDefault(require("./parse-frame"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function parsePage({
  pageJson,
  imagesJson,
  settingsJson,
  context
}) {
  const nodes = pageJson.children.reduce((sum, child) => {
    const {
      id
    } = child;
    const settings = settingsJson[id];

    if (settings && settings.dontExport) {
      return sum;
    }

    return sum.concat([id]);
  }, []);

  if (nodes.length === 0) {
    console.warn(`No nodes found in the page '${pageJson.name}'. Nothing to parse.`);
    return {};
  }

  const sourceMap = {};
  const middlewares = (0, _middleware.default)(context);
  await _bluebird.default.each(nodes, frameId => (0, _parseFrame.default)({
    sourceMap,
    middlewares,
    frameId,
    pageJson,
    imagesJson,
    settingsJson,
    context
  }));
  return sourceMap;
}