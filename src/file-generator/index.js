import fs from 'fs';

import exportJSFile from './component';
import exportStoryFile from './storybook';

export default async function exportTree({ config, sourceMap }) {
  const { storybook: storybookCfg = {}, component: componentCfg = {}, prettierrc } = config;

  const { template: componentTemplatePath = './src/assets/templates/component.jst' } = componentCfg;
  const componentTemplate = fs.readFileSync(componentTemplatePath, { encoding: 'utf8' });

  const { template: storybookTemplatePath = './src/assets/templates/story.jst' } = storybookCfg;
  const storybookTemplate = storybookCfg
    ? fs.readFileSync(storybookTemplatePath, { encoding: 'utf8' })
    : null;

  const prettierOptions = prettierrc
    ? JSON.parse(fs.readFileSync(prettierrc, { encoding: 'utf8' }))
    : null;

  Object.keys(sourceMap).map(key => {
    exportJSFile(componentTemplate, sourceMap[key], { config, prettierOptions });

    if (storybookCfg) {
      exportStoryFile(storybookTemplate, sourceMap[key], { config, prettierOptions });
    }
  });
}
