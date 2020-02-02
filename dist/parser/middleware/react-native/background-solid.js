"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _get = _interopRequireDefault(require("lodash/get"));

var _utils = require("../../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function middleware({
  node,
  nodeJson
}) {
  const {
    fills
  } = nodeJson;

  if (!fills) {
    return node;
  }

  const background = fills.find(({
    type,
    visible = true,
    opacity = 1.0
  }) => type === 'SOLID' && visible && opacity > 0);

  if (!background) {
    return node;
  }

  const {
    type
  } = nodeJson;

  if (type === 'TEXT') {
    // fills for TEXT isn't background, it's color of the text
    // we will handle it inside text-style.js
    return node;
  }

  const {
    opacity = 1.0,
    color: backgroundColor
  } = background;
  return _objectSpread({}, node, {
    props: _objectSpread({}, node.props, {
      style: _objectSpread({}, (0, _get.default)(node, 'props.style'), {
        backgroundColor: (0, _utils.color)(backgroundColor, opacity)
      })
    })
  });
}