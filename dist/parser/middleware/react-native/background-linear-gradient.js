"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _lodash = _interopRequireDefault(require("lodash"));

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
  }) => type === 'GRADIENT_LINEAR' && visible && opacity > 0);

  if (!background) {
    return node;
  }

  const {
    opacity = 1.0,
    gradientHandlePositions: [start, end],
    gradientStops
  } = background;
  const colors = gradientStops.map(({
    color: c
  }) => (0, _utils.color)(c));
  const locations = gradientStops.map(({
    position
  }) => position);
  return _objectSpread({}, node, {
    importComponent: _lodash.default.concat(["import LinearGradient from 'react-native-linear-gradient';"], node.importComponent),
    renderComponent: (props, children, thisNode) => [`<LinearGradient ${(0, _utils.rip)({
      style: _objectSpread({}, _lodash.default.get(props, 'style'), {
        opacity
      }),
      start,
      end,
      colors,
      locations
    }, 0, `gradient-background-${props.key}`)}>`, ...node.renderComponent(props, children, thisNode), '</LinearGradient>']
  });
}