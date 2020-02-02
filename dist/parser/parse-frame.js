"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseFrame;

var _utils = require("../utils");

var _parseNode = _interopRequireDefault(require("./parse-node"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function parseFrame({
  sourceMap,
  middlewares,
  frameId,
  pageJson,
  imagesJson,
  settingsJson,
  context
}) {
  const frame = (0, _utils.findNode)(pageJson, frameId);

  if (!frame) {
    console.warn(`Node ${frameId} not found in the tree`);
    return null;
  }

  const {
    absoluteBoundingBox: {
      x,
      y,
      width,
      height
    }
  } = frame;

  const context2 = _objectSpread({}, context, {
    // jsons
    docJson: pageJson,
    imagesJson,
    settingsJson,
    // frame info
    frameId,
    frameX: x,
    frameY: y,
    frameWidth: width,
    frameHeight: height
  });

  return (0, _parseNode.default)({
    // parent node
    parentNode: null,
    parentJson: null,
    // current node
    nodeJson: frame,
    // tools
    sourceMap,
    middlewares,
    context: context2
  });
}