"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _lodash = _interopRequireDefault(require("lodash"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function middleware({
  node,
  nodeJson
}) {
  const {
    name
  } = nodeJson;
  const {
    effects
  } = nodeJson;

  if (!effects || effects.length === 0) {
    return node;
  }

  const effect = effects.find(({
    type,
    visible
  }) => visible && type === 'DROP_SHADOW');

  if (!effect) {
    return node;
  }

  const {
    color: {
      r,
      g,
      b,
      a
    },
    offset: {
      x,
      y
    },
    radius
  } = effect;
  return _objectSpread({}, node, {
    importComponent: _lodash.default.concat(["import Androw from 'react-native-androw';"], node.importComponent),
    renderComponent: (props, children, thisNode) => [`<Androw ${(0, _utils.rip)({
      style: {
        shadowOffset: {
          width: x,
          height: y
        },
        shadowRadius: radius,
        shadowColor: (0, _utils.color)({
          r,
          g,
          b,
          a: 1
        }),
        shadowOpacity: a
      }
    }, 0, `shadow-${props.key}`)}>`, ...node.renderComponent(props, children, thisNode), '</Androw>']
  });
}