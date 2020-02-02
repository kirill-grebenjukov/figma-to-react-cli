"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = middleware;

var _utils = require("../../../utils");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function middleware({
  parentNode,
  node,
  nodeJson,
  sourceMap,
  context
}) {
  const {
    type
  } = nodeJson;
  const {
    componentName,
    componentPath,
    props
  } = node; // we already handle it inside export-as-image-or-svg middleware

  if ((0, _utils.isVector)(type)) {
    return node;
  }

  if (!componentName && type !== 'INSTANCE') {
    return node;
  }

  const {
    settingsJson
  } = context;

  const instanceProps = _objectSpread({}, props, {
    style: _objectSpread({}, (0, _utils.copyStylePosition)(props), (0, _utils.copyStyleSize)(props))
  });

  if (type === 'INSTANCE') {
    const {
      componentId
    } = nodeJson;
    const {
      componentName: className,
      componentPath: classPath = ''
    } = settingsJson[componentId] || {};

    if (!className) {
      return node;
    }

    return (0, _utils.getInstanceNode)(node, instanceProps, className, classPath, context);
  }

  if (componentName) {
    // We should put new ReactComponent in sourceMap and
    // return instance of this Component as the node
    // We also should split styles between ReactComponent and instance,
    // size and position should go to instance, others should go to ReactComponent
    const componentProps = _objectSpread({}, props, {
      style: _objectSpread({}, props.style, (0, _utils.clearStylePosition)(), (0, _utils.clearStyleSize)(), {
        'last:prop': '...props.style'
      }),
      'first:prop': '{...props}'
    });

    if (sourceMap[componentName]) {
      console.warn(`Component with name '${componentName}' already exists in sourceMap`);
    } // eslint-disable-next-line no-param-reassign


    node.props = componentProps; // eslint-disable-next-line no-param-reassign

    sourceMap[componentName] = node; // we should not return instance component if there is no parent
    // no parent means that this is a top level component (screen/scene)

    if (parentNode) {
      return (0, _utils.getInstanceNode)(node, instanceProps, componentName, componentPath, context);
    } // else return node;

  }

  return node;
}