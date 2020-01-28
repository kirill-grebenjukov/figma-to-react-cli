import fs from 'fs';
import path from 'path';
import kebabCase from 'just-kebab-case';
import prettier from 'prettier';

export default function exportJSFile(
  template,
  component,
  { config, prettierOptions },
) {
  const {
    exportCode: { path: exportCodePath },
    exportSvgComponents: { path: exportSvgPath },
  } = config;

  const { componentName, componentPath, svgCode } = component;

  const exportPath = svgCode ? exportSvgPath : exportCodePath;

  let jsCode = template.split('{{componentName}}').join(componentName);

  if (prettierOptions) {
    jsCode = prettier.format(jsCode, prettierOptions);
  }

  const componentNameKebab = kebabCase(componentName);
  const fileDir = path.join(exportPath, componentPath, componentNameKebab);
  fs.mkdirSync(fileDir, { recursive: true });

  const filePath = path.join(fileDir, `${componentNameKebab}.story.js`);
  fs.writeFileSync(filePath, jsCode, {
    encoding: 'utf8',
  });
}
