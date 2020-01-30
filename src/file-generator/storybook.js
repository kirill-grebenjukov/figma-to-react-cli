import kebabCase from 'just-kebab-case';
import prettier from 'prettier';

import toFile from './to-file';

export default function exportJSFile(
  template,
  component,
  { context, prettierOptions },
) {
  const {
    exportCode: { path: exportCodePath },
    exportSvgComponents: { path: exportSvgPath },
    storybook: {
      codeSection = 'Components',
      svgSection = 'SVG',
      fileExt: ext = 'story.js',
    },
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

  toFile({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext,
    context,
  });
}
