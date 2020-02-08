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

const textDecorationMap = {
  STRIKETHROUGH: 'line-through',
  UNDERLINE: 'underline'
};
const alignHorMap = {
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
  JUSTIFIED: 'justify'
};
const alignVertMap = {
  TOP: 'top',
  CENTER: 'center',
  BOTTOM: 'bottom'
};

function middleware({
  node,
  nodeJson,
  context
}) {
  const {
    type
  } = nodeJson;

  if (type !== 'TEXT') {
    return node;
  }

  const {
    parser: {
      getFontName
    }
  } = context;
  const {
    style: {
      fontFamily,
      fontPostScriptName,
      fontWeight,
      fontSize,
      italic,
      textAlignHorizontal,
      textAlignVertical,
      letterSpacing,
      lineHeightPx,
      textDecoration
    },
    fills
  } = nodeJson;
  const colorFill = fills.find(({
    type: fillType,
    visible = true,
    opacity = 1.0
  }) => fillType === 'SOLID' && visible && opacity > 0);
  const {
    opacity = 1.0,
    color: textColor
  } = colorFill || {
    color: {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    }
  };
  return _objectSpread({}, node, {
    props: _objectSpread({}, node.props, {
      style: _objectSpread({}, (0, _get.default)(node, 'props.style'), {
        color: (0, _utils.color)(textColor, opacity),
        fontFamily: getFontName(fontFamily, fontPostScriptName),
        fontSize,
        fontWeight: `${fontWeight}`,
        fontStyle: italic ? 'italic' : 'normal',
        lineHeight: lineHeightPx,
        textAlign: alignHorMap[textAlignHorizontal],
        textAlignVertical: alignVertMap[textAlignVertical],
        letterSpacing,
        textDecorationLine: textDecorationMap[textDecoration]
      })
    })
  });
}