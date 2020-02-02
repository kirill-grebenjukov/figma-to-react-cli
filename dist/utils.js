"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeFileName = sanitizeFileName;
exports.sanitizeText = sanitizeText;
exports.findNode = findNode;
exports.findCanvas = findCanvas;
exports.isVector = isVector;
exports.clearStylePosition = clearStylePosition;
exports.clearStyleSize = clearStyleSize;
exports.copyStylePosition = copyStylePosition;
exports.copyStyleSize = copyStyleSize;
exports.copyStyleSizeOrFlex1 = copyStyleSizeOrFlex1;
exports.getInstanceNode = getInstanceNode;
exports.renderChildren = exports.renderInlineProps = exports.colorComponent = exports.rc = exports.rip = exports.getGlobProps = exports.initGlobProps = exports.rip0 = exports.color = void 0;

var _justKebabCase = _interopRequireDefault(require("just-kebab-case"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function sanitizeFileName(value) {
  return value.split('.').join('D').split(' ').join('S').split(':').join('C').split(';').join('Z');
}

function sanitizeText(value) {
  return value.split('{').join('').split('}').join('');
}

function findNode(json, id) {
  if (!json) {
    return null;
  }

  if (json.id === id) {
    return json;
  }

  const {
    children
  } = json;

  if (children) {
    for (let i = 0; i < children.length; i += 1) {
      const child = findNode(children[i], id);

      if (child) {
        return child;
      }
    }
  }

  return null;
}

function findCanvas(json, name) {
  if (!json) {
    return null;
  }

  if (json.type === 'CANVAS' && json.name === name) {
    return json;
  }

  const {
    children
  } = json;

  if (children) {
    for (let i = 0; i < children.length; i += 1) {
      const child = findCanvas(children[i], name);

      if (child) {
        return child;
      }
    }
  }

  return null;
}

function isVector(type) {
  return ['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'ELLIPSE', 'REGULAR_POLYGON'].indexOf(type) >= 0;
}

function clearStylePosition() {
  return {
    position: undefined,
    left: undefined,
    right: undefined,
    top: undefined,
    bottom: undefined
  };
}

function clearStyleSize() {
  return {
    width: undefined,
    height: undefined
  };
}

function copyStylePosition(props, def = {}) {
  return {
    position: _lodash.default.get(props, 'style.position', def.position),
    left: _lodash.default.get(props, 'style.left', def.left),
    right: _lodash.default.get(props, 'style.right', def.right),
    top: _lodash.default.get(props, 'style.top', def.top),
    bottom: _lodash.default.get(props, 'style.bottom', def.bottom)
  };
}

function copyStyleSize(props, def = {}) {
  return {
    width: _lodash.default.get(props, 'style.width', def.width),
    height: _lodash.default.get(props, 'style.height', def.height)
  };
}

function copyStyleSizeOrFlex1(props) {
  const width = _lodash.default.get(props, 'style.width');

  const height = _lodash.default.get(props, 'style.height');

  return {
    width,
    height,
    flex: !width && !height ? 1 : undefined
  };
}

const cc = v => Math.round(v * 255);

const color = ({
  r,
  g,
  b,
  a
}, opacity = 1) => `rgba(${cc(r)}, ${cc(g)}, ${cc(b)}, ${cc(a * opacity)})`;

exports.color = color;

const rip0 = (props, level = 0) => {
  if (_lodash.default.isNil(props)) {
    return '';
  }

  if (_lodash.default.isString(props)) {
    return `'${props}'`;
  }

  if (_lodash.default.isNumber(props)) {
    return props;
  }

  if (_lodash.default.isArray(props)) {
    return `[${props.map(v => rip0(v)).join(', ')}]`;
  }

  if (_lodash.default.isObject(props)) {
    if (level > 0) {
      return `{${_lodash.default.keys(props).filter(key => !_lodash.default.isNil(props[key])).sort((a, b) => {
        if (a === 'first:prop') return -1;
        if (a === 'last:prop') return 1;
        return a.localeCompare(b);
      }).map(key => {
        if (key === 'first:prop' || key === 'last:prop') {
          return String(props[key]);
        }

        const key0 = key.indexOf('-') >= 0 ? `'${key}'` : key;
        return `${key0}: ${rip0(props[key], level + 1)}`;
      }).join(', ')}}`;
    }

    return `${_lodash.default.keys(props).sort((a, b) => {
      if (a === 'first:prop') return -1;
      if (a === 'last:prop') return 1;
      return a.localeCompare(b);
    }).map(key => {
      const value = props[key];

      if (key === 'first:prop' || key === 'last:prop') {
        return String(value);
      }

      if (_lodash.default.isString(value)) {
        return `${key}="${value}"`;
      }

      return `${key}={${rip0(props[key], level + 1)}}`;
    }).join(' ')}`;
  }

  return String(props);
};

exports.rip0 = rip0;
let globProps = null;

const initGlobProps = props => {
  globProps = props;
};

exports.initGlobProps = initGlobProps;

const getGlobProps = () => globProps;

exports.getGlobProps = getGlobProps;

const rip = (props, level = 0, name = null) => {
  if (level === 0 && name && globProps) {
    globProps[name] = props;
    return `{...PROPS['${name}'](props)}`;
  }

  return rip0(props, level);
};

exports.rip = rip;

const rc = children => _lodash.default.flatMap(children, ({
  renderCode,
  props,
  children: ch
}) => renderCode(props, ch));

exports.rc = rc;

function getInstanceNode(node, props, componentName, componentPath, context) {
  const {
    exportCode: {
      codePrefix
    }
  } = context;

  if (!componentName) {
    return node;
  }

  const filePath = [codePrefix, componentPath, `${(0, _justKebabCase.default)(componentName)}`, `${(0, _justKebabCase.default)(componentName)}.component`].filter(t => !!t).join('/');
  return _objectSpread({}, node, {
    props,
    importCode: [`import ${componentName} from '${filePath}';`],
    // eslint-disable-next-line no-shadow
    renderCode: props => [`<${componentName} ${rip(props, 0, `instance-${props.key}`)} />`]
  });
} // Aliases


const colorComponent = cc;
exports.colorComponent = colorComponent;
const renderInlineProps = rip;
exports.renderInlineProps = renderInlineProps;
const renderChildren = rc;
exports.renderChildren = renderChildren;