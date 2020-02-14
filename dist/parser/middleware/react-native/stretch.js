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
  context
}) {
  const {
    id
  } = node;
  const {
    settingsJson
  } = context;
  const {
    // we need it mostly for parent (screen) components to occupy all the available space
    fullWidth = false,
    fullHeight = false
  } = settingsJson[id] || {};

  if (!fullWidth && !fullHeight) {
    return node;
  }

  if (fullWidth && fullHeight) {
    return _objectSpread({}, node, {
      props: {
        style: _objectSpread({}, node.props.style, (0, _utils.clearStylePosition)(), (0, _utils.clearStyleSize)(), {
          flex: 1
        })
      }
    });
  }

  return _objectSpread({}, node, {
    props: {
      style: _objectSpread({}, node.props.style, fullWidth ? {
        width: '100%'
      } : {
        height: '100%'
      })
    }
  });
}