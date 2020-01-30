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
  const fileDir = path.join(exportPath, componentPath, componentNameKebab);
  fs.mkdirSync(fileDir, { recursive: true });

  const filePath = path.join(fileDir, `${componentNameKebab}.${ext}`);
  fs.writeFileSync(filePath, jsCode, {
    encoding: 'utf8',
  });
}
