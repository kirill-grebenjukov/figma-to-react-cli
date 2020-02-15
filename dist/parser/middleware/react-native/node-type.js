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
    type,
    id: key
  } = nodeJson;

  const res = _objectSpread({}, node);

  switch (type) {
    case 'FRAME':
      res.importComponent = ["import { View } from 'react-native';"];

      res.renderComponent = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `frame-${key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'GROUP':
      res.importComponent = ["import { View } from 'react-native';"];

      res.renderComponent = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `group-${key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'VECTOR':
      res.importComponent = ["import { View } from 'react-native';"];

      res.renderComponent = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `vector-${key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'RECTANGLE':
      res.importComponent = ["import { View } from 'react-native';"];

      res.renderComponent = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `rectangle-${key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'TEXT':
      res.importComponent = ["import { Text } from 'react-native';"];

      res.renderComponent = props => [`<Text ${(0, _utils.rip)(props, 0, `text-${key}`)}>${(0, _utils.sanitizeText)(nodeJson.characters)}</Text>`];

      break;

    case 'COMPONENT':
      res.importComponent = ["import { View } from 'react-native';"];

      res.renderComponent = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `component-${key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    case 'INSTANCE':
      res.importComponent = ["import { View } from 'react-native';"];

      res.renderComponent = (props, children) => [`<View ${(0, _utils.rip)(props, 0, `instance-${key}`)}>`, ...(0, _utils.rc)(children), '</View>'];

      break;

    default:
      {// do nothing
      }
  }

  return res;
}