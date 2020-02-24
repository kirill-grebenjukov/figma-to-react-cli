"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linesToMap = linesToMap;
exports.mapToLines = mapToLines;
exports.default = normalizeImports;

var _uniq = _interopRequireDefault(require("lodash/uniq"));

var _keys = _interopRequireDefault(require("lodash/keys"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const regexp = /import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*$/;

function linesToMap(imports) {
  const map = {};
  imports.forEach(line => {
    if (!line) {
      return;
    }

    const m = line.match(regexp);

    if (!m || m.length < 2) {
      return;
    }

    let classes = m[1];

    if (classes.endsWith(' ')) {
      classes = classes.substr(0, classes.length - 1);
    }

    const lib = m[2];
    const old = map[lib] || {};

    if (classes.startsWith('* as ')) {
      map[lib] = _objectSpread({}, old, {
        glob: classes
      });
      return;
    }

    const openIndex = classes.indexOf('{');

    if (openIndex >= 0) {
      const tokens = classes.split('{');
      const glob = tokens[0].replace(',', '').split(' ').join('');
      const nonGlob = tokens[1].replace('}', '').split(' ').join('').split(',');
      map[lib] = {
        glob: glob || old.glob,
        nonGlob: (0, _uniq.default)([...(old.nonGlob || []), ...nonGlob])
      };
    } else {
      map[lib] = _objectSpread({}, old, {
        glob: classes
      });
    }
  });
  return map;
}

function mapToLines(map, eol) {
  return (0, _keys.default)(map).map(key => {
    const {
      glob,
      nonGlob
    } = map[key];
    const ng = nonGlob ? `{ ${nonGlob.join(', ')} }` : '';
    const g = glob ? `${glob}${ng ? ', ' : ''}` : '';
    return `import ${g}${ng} from '${key}';`;
  }).join(eol);
}

function normalizeImports(lines, eol) {
  return mapToLines(linesToMap(lines), eol);
}