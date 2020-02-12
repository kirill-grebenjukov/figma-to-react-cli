import fs from 'fs';
import path from 'path';

export default function({
  jsCode,
  exportPath,
  componentPath,
  componentNameKebab,
  ext,
  context,
}) {
  const { beautify = [] } = context;
  const code = beautify.reduce(
    (newCode, fn) =>
      fn({
        jsCode: newCode,
        exportPath,
        componentPath,
        componentNameKebab,
        ext,
        context,
      }),
    jsCode,
  );

  const fileDir = path.join(exportPath, componentPath, componentNameKebab);
  fs.mkdirSync(fileDir, { recursive: true });

  const filePath = path.join(fileDir, `${componentNameKebab}.${ext}`);

  console.log(`  => ${filePath}`);

  fs.writeFileSync(filePath, code, {
    encoding: 'utf8',
  });
}
