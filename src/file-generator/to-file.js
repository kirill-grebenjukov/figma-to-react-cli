import fs from 'fs';
import path from 'path';

export default function({
  jsCode: code,
  exportPath,
  componentPath,
  componentNameKebab,
  ext,
  context,
}) {
  const { beautify = [] } = context;
  const jsCode = beautify.reduce(
    (jsCode, fn) =>
      fn({
        jsCode,
        exportPath,
        componentPath,
        componentNameKebab,
        ext,
        context,
      }),
    code,
  );

  const fileDir = path.join(exportPath, componentPath, componentNameKebab);
  fs.mkdirSync(fileDir, { recursive: true });

  const filePath = path.join(fileDir, `${componentNameKebab}.${ext}`);
  fs.writeFileSync(filePath, jsCode, {
    encoding: 'utf8',
  });
}
