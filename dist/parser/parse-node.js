"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseNode;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _lodash = _interopRequireDefault(require("lodash"));

var _constants = require("../constants");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function parseNode({
  // parent node
  parentNode,
  parentJson,
  // current node
  nodeJson,
  //
  sourceMap,
  middlewares,
  context
}) {
  const {
    parser: {
      defaultComponent
    },
    settingsJson
  } = context;
  const {
    id,
    name,
    type,
    children: childrenJson
  } = nodeJson;
  const {
    // don't export component completely
    dontExport = false,
    // parse component but skip its children
    skipChildren = false,
    // componentName and componentPath
    componentName,
    componentPath = '',
    exportAs,
    // hoc
    hoc,
    // extend by an existing component
    extend
  } = settingsJson[id] || {};

  if (dontExport) {
    return null;
  }

  let node = null; // if parentNode is null then we are at the frame level or
  // all parent nodes don't have componentName that means they shouldn't be parsed

  if (componentName || parentNode) {
    node = _objectSpread({
      id,
      name,
      componentName,
      componentPath
    }, defaultComponent, {
      children: null,
      props: {
        key: id
      },
      hoc,
      extend
    });
  }

  const {
    mode
  } = extend || {};
  let noChildren = skipChildren || !childrenJson || mode === _constants.USE_INSTEAD || exportAs || (0, _utils.isVector)(type);

  if (type === 'INSTANCE') {
    const {
      docJson
    } = context;
    const {
      componentId
    } = nodeJson;
    const component = (0, _utils.findNode)(docJson, componentId);
    const {
      componentName: className
    } = settingsJson[componentId] || {};

    if (component && className) {
      noChildren = true;
    }
  }

  if (!noChildren) {
    const activeChildrenJson = childrenJson.filter(({
      visible = true
    }) => visible);
    const activeChildren = await _bluebird.default.map(activeChildrenJson, childJson => parseNode({
      // parent
      parentNode: node,
      parentJson: nodeJson,
      // current
      nodeJson: childJson,
      // tools
      sourceMap,
      middlewares,
      context
    }));

    if (node) {
      node.children = activeChildren.filter(child => !!child);
    }
  }

  if (node) {
    node = await _bluebird.default.reduce(middlewares, (newNode, middleware) => middleware({
      parentNode,
      parentJson,
      node: newNode,
      nodeJson,
      sourceMap,
      middlewares,
      context
    }), node);
  }

  return node;
}