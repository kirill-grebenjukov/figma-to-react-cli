"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default({
  jsCode,
  exportPath,
  componentPath,
  componentNameKebab,
  ext,
  context
}) {
  const {
    beautify = []
  } = context;
  const code = beautify.reduce((newCode, fn) => fn({
    jsCode: newCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext,
    context
  }), jsCode);

  const fileDir = _path.default.join(exportPath, componentPath, componentNameKebab);

  _fs.default.mkdirSync(fileDir, {
    recursive: true
  });

  const filePath = _path.default.join(fileDir, `${componentNameKebab}.${ext}`);

  _fs.default.writeFileSync(filePath, code, {
    encoding: 'utf8'
  });
}