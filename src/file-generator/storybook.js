import kebabCase from 'just-kebab-case';

import toFile from './to-file';

export default function exportJSFile(template, component, { context }) {
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

  const jsCode = template
    .replace('{{componentPath}}', componentNameKebab)
    .replace('{{storiesOf}}', storiesSection)
    .split('{{componentName}}')
    .join(componentName);

  toFile({
    jsCode,
    exportPath,
    componentPath,
    componentNameKebab,
    ext,
    context,
  });
}
