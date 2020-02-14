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
    name,
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
        style: _objectSpread({}, _lodash.default.get(node, 'props.style'), {
          flex: 1
        })
      })
    });
  }

  const left = x - _lodash.default.get(parentJson, 'absoluteBoundingBox.x', frameX);

  const top = y - _lodash.default.get(parentJson, 'absoluteBoundingBox.y', frameY);

  const parentWidth = _lodash.default.get(parentJson, 'absoluteBoundingBox.width', frameWidth);

  const parentHeight = _lodash.default.get(parentJson, 'absoluteBoundingBox.height', frameHeight);

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

  const position = _lodash.default.keys(hProps).length > 0 || _lodash.default.keys(vProps).length > 0 ? 'absolute' : undefined;

  const style = _objectSpread({}, _lodash.default.get(node, 'props.style'), {
    position,
    width,
    height
  }, hProps, vProps); // tested: LEFT_RIGHT, TOP_BOTTOM


  if (horizontal === 'LEFT_RIGHT' || vertical === 'TOP_BOTTOM') {
    return _objectSpread({}, node, {
      props: _objectSpread({}, node.props, {
        style: _objectSpread({}, style, (0, _utils.clearStylePosition)(), {
          width: horizontal === 'LEFT_RIGHT' ? '100%' : width,
          height: vertical === 'TOP_BOTTOM' ? '100%' : height
        })
      }),
      importDecorator: _lodash.default.concat(["import { View } from 'react-native';"], node.importDecorator || []),
      renderDecorator: (props, children, thisNode) => [`<View ${(0, _utils.rip)({
        style: _objectSpread({
          width: horizontal === 'LEFT_RIGHT' ? '100%' : width,
          height: vertical === 'TOP_BOTTOM' ? '100%' : height
        }, hProps, vProps, {
          position,
          paddingLeft: horizontal === 'LEFT_RIGHT' ? left : undefined,
          paddingRight: horizontal === 'LEFT_RIGHT' ? right : undefined,
          paddingTop: vertical === 'TOP_BOTTOM' ? top : undefined,
          paddingBottom: vertical === 'TOP_BOTTOM' ? bottom : undefined // backgroundColor: node.id === '102:30' ? 'lime' : undefined,

        })
      }, 0, `container-${props.key}`)}>`, ...(node.renderDecorator || thisNode.renderComponent)(props, children, thisNode), '</View>']
    });
  } // tested both: CENTER


  if (horizontal === 'CENTER' || vertical === 'CENTER') {
    const marginLeft = horizontal === 'CENTER' ? left - (left + parentWidth - width - left) / 2 : 0;
    const marginTop = vertical === 'CENTER' ? top - (top + bottom) / 2 : 0;
    return _objectSpread({}, node, {
      props: _objectSpread({}, node.props, {
        style: _objectSpread({}, style, (0, _utils.clearStylePosition)(), {
          marginLeft,
          marginTop
        })
      }),
      importDecorator: _lodash.default.concat(["import { View } from 'react-native';"], node.importDecorator),
      renderDecorator: (props, children, thisNode) => [`<View ${(0, _utils.rip)({
        style: _objectSpread({
          width: horizontal === 'CENTER' ? '100%' : width,
          height: vertical === 'CENTER' ? '100%' : height
        }, hProps, vProps, {
          justifyContent: vertical === 'CENTER' ? 'center' : 'flex-start',
          alignItems: horizontal === 'CENTER' ? 'center' : 'flex-start',
          // We need this to correctly position container
          // example is a button with centered text
          position: 'absolute'
        })
      }, 0, `container-${props.key}`)}>`, `<View ${(0, _utils.rip)({
        style: _objectSpread({}, (0, _utils.copyStyleSize)(props))
      }, 0, `placeholder-${props.key}`)}>`, ...(node.renderDecorator || thisNode.renderComponent)(props, children, thisNode), '</View>', '</View>']
    });
  }

  return _objectSpread({}, node, {
    props: _objectSpread({}, node.props, {
      style
    })
  });
}