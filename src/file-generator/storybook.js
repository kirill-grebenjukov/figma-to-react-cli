import fs from 'fs';
import path from 'path';
import kebabCase from 'just-kebab-case';
import prettier from 'prettier';

export default function exportJSFile(
  template,
  component,
  { context, prettierOptions },
) {
  const {
    exportCode: { path: exportCodePath },
    exportSvgComponents: { path: exportSvgPath },
    storybook: { codeSection = 'Components', svgSection = 'SVG' },
  } = context;

  const { componentName, componentPath, svgCode } = component;

  const exportPath = svgCode ? exportSvgPath : exportCodePath;
  const storiesSection = svgCode ? svgSection : codeSection;
  const componentNameKebab = kebabCase(componentName);

  let jsCode = template
    .replace('{{componentPath}}', componentNameKebab)
    .replace('{{storiesOf}}', storiesSection)
    .split('{{componentName}}')
    .join(componentName);

  if (prettierOptions) {
    jsCode = prettier.format(jsCode, prettierOptions);
  }

  const fileDir = path.join(exportPath, componentPath, componentNameKebab);
  fs.mkdirSync(fileDir, { recursive: true });

  const filePath = path.join(fileDir, `${componentNameKebab}.story.js`);
  fs.writeFileSync(filePath, jsCode, {
    encoding: 'utf8',
  });
}
