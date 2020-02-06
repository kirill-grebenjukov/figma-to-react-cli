"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _utils = require("../../../utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function middleware({
  node,
  nodeJson
}) {
  const {
    type
  } = nodeJson;

  const res = _objectSpread({}, node);

  switch (type) {
    case 'FRAME':
      // res.props = { ...node.props, style: { flex: 1 } };
      res.importCode = ["import { View } from 'react-native';"];

      res.renderCode = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `frame-${props.key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'GROUP':
      res.importCode = ["import { View } from 'react-native';"];

      res.renderCode = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `group-${props.key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'VECTOR':
      res.importCode = ["import { View } from 'react-native';"];

      res.renderCode = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `vector-${props.key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'RECTANGLE':
      res.importCode = ["import { View } from 'react-native';"];

      res.renderCode = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `rectangle-${props.key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'TEXT':
      res.importCode = ["import { Text } from 'react-native';"];

      res.renderCode = props => [`<Text ${(0, _utils.rip)(props, 0, `text-${props.key}`)}>${(0, _utils.sanitizeText)(nodeJson.characters)}</Text>`];

      break;

    case 'COMPONENT':
      res.importCode = ["import { View } from 'react-native';"];

      res.renderCode = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `component-${props.key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'INSTANCE':
      res.importCode = ["import { View } from 'react-native';"];

      res.renderCode = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `instance-${props.key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    default:
      {// do nothing
      }
  }

  return res;
}