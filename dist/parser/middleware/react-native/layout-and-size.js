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
  parentJson,
  node,
  nodeJson,
  context
}) {
  const {
    frameX,
    frameY,
    frameWidth,
    frameHeight
  } = context;
  const {
    id,
    type,
    absoluteBoundingBox: {
      x,
      y,
      width,
      height
    },
    constraints: {
      vertical,
      horizontal
    }
  } = nodeJson;

  if (['DOCUMENT', 'CANVAS'].indexOf(type) >= 0) {
    return _objectSpread({}, node, {
      props: _objectSpread({}, node.props, {
        style: _objectSpread({}, (0, _get.default)(node, 'props.style'), {
          flex: 1
        })
      })
    });
  }

  const left = x - (0, _get.default)(parentJson, 'absoluteBoundingBox.x', frameX);
  const top = y - (0, _get.default)(parentJson, 'absoluteBoundingBox.y', frameY);
  const parentWidth = (0, _get.default)(parentJson, 'absoluteBoundingBox.width', frameWidth);
  const parentHeight = (0, _get.default)(parentJson, 'absoluteBoundingBox.height', frameHeight);
  const right = parentWidth - width - left;
  const bottom = parentHeight - height - top;
  const hProps = {};
  const vProps = {}; // tested: LEFT, RIGHT

  switch (horizontal) {
    case 'LEFT':
      hProps.left = left;
      break;

    case 'RIGHT':
      hProps.right = right;
      break;

    default: // do nothing

  } // tested: TOP, BOTTOM


  switch (vertical) {
    case 'TOP':
      hProps.top = top;
      break;

    case 'BOTTOM':
      hProps.bottom = bottom;
      break;

    default: // do nothing

  }

  const style = _objectSpread({}, (0, _get.default)(node, 'props.style'), {
    position: 'absolute',
    width,
    height
  }, hProps, vProps); // tested: LEFT_RIGHT, TOP_BOTTOM


  if (horizontal === 'LEFT_RIGHT' || vertical === 'TOP_BOTTOM') {
    return _objectSpread({}, node, {
      importCode: ["import { View } from 'react-native';", ...node.importCode],
      props: _objectSpread({}, node.props, {
        style: _objectSpread({}, style, (0, _utils.clearStylePosition)(), {
          width: horizontal === 'LEFT_RIGHT' ? '100%' : width,
          height: vertical === 'TOP_BOTTOM' ? '100%' : height
        })
      }),
      renderInstance: node.renderInstance || node.renderCode,
      renderCode: (props, children, thisNode) => [`<View ${(0, _utils.rip)({
        style: _objectSpread({
          position: 'absolute',
          width: horizontal === 'LEFT_RIGHT' ? '100%' : width,
          height: vertical === 'TOP_BOTTOM' ? '100%' : height
        }, hProps, vProps, {
          paddingLeft: horizontal === 'LEFT_RIGHT' ? left : undefined,
          paddingRight: horizontal === 'LEFT_RIGHT' ? right : undefined,
          paddingTop: vertical === 'TOP_BOTTOM' ? top : undefined,
          paddingBottom: vertical === 'TOP_BOTTOM' ? bottom : undefined // backgroundColor: node.id === '102:30' ? 'lime' : undefined,

        })
      }, 0, `container-${props.key}`)}>`, ...thisNode.renderInstance(props, children, thisNode), '</View>']
    });
  } // tested both: CENTER


  if (horizontal === 'CENTER' || vertical === 'CENTER') {
    const marginLeft = horizontal === 'CENTER' ? left - (left + parentWidth - width - left) / 2 : 0;
    const marginTop = vertical === 'CENTER' ? top - (top + bottom) / 2 : 0;
    return _objectSpread({}, node, {
      importCode: ["import { View } from 'react-native';", ...node.importCode],
      props: _objectSpread({}, node.props, {
        style: _objectSpread({}, style, (0, _utils.clearStylePosition)(), {
          marginLeft,
          marginTop
        })
      }),
      renderInstance: node.renderInstance || node.renderCode,
      renderCode: (props, children, thisNode) => [`<View ${(0, _utils.rip)({
        style: _objectSpread({
          position: 'absolute',
          width: horizontal === 'CENTER' ? '100%' : width,
          height: vertical === 'CENTER' ? '100%' : height
        }, hProps, vProps, {
          justifyContent: vertical === 'CENTER' ? 'center' : 'flex-start',
          alignItems: horizontal === 'CENTER' ? 'center' : 'flex-start'
        })
      }, 0, `container-${props.key}`)}>`, ...thisNode.renderInstance(props, children, thisNode), '</View>']
    });
  }

  return _objectSpread({}, node, {
    props: _objectSpread({}, node.props, {
      style
    })
  });
}