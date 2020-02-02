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
    strokes,
    strokeWeight,
    cornerRadius,
    rectangleCornerRadii
  } = nodeJson;

  const props = _objectSpread({}, node.props, {
    style: _objectSpread({}, (0, _get.default)(node, 'props.style'))
  });

  if (rectangleCornerRadii) {
    const [borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius] = rectangleCornerRadii;
    props.style = _objectSpread({}, props.style, {
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0)'
    });
  } else if (cornerRadius && cornerRadius > 0) {
    props.style = _objectSpread({}, props.style, {
      borderRadius: cornerRadius,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0)'
    });
  }

  if (strokes) {
    const stroke = strokes.find(({
      type
    }) => type === 'SOLID');

    if (stroke) {
      const {
        color: c
      } = stroke;
      props.style = _objectSpread({}, props.style, {
        borderWidth: strokeWeight,
        borderColor: (0, _utils.color)(c)
      });
    }
  }

  return _objectSpread({}, node, {
    props
  });
}