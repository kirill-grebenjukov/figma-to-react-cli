import fs from 'fs';

import getConfig from './get-config';
import exportJSFile from './component';
import exportStoryFile from './storybook';

export default async function exportTree({ context, sourceMap }) {
  const {
    storybook: storybookCfg = {},
    component: componentCfg = {},
    prettierrc,
  } = context;

  const {
    template: componentTemplatePath = './src/assets/templates/component.jst',
  } = componentCfg;
  const componentTemplate = fs.readFileSync(componentTemplatePath, {
    encoding: 'utf8',
  });

  const {
    template: storybookTemplatePath = './src/assets/templates/story.jst',
  } = storybookCfg;
  const storybookTemplate = storybookCfg
    ? fs.readFileSync(storybookTemplatePath, { encoding: 'utf8' })
    : null;

  const prettierOptions = getConfig(prettierrc);

  Object.keys(sourceMap).forEach(key => {
    exportJSFile(componentTemplate, sourceMap[key], {
      config: context,
      prettierOptions,
    });

    if (storybookCfg) {
      exportStoryFile(storybookTemplate, sourceMap[key], {
        config: context,
        prettierOptions,
      });
    }
  });
}
