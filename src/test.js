// import fs from 'fs';
import Promise from 'bluebird';
import * as Figma from 'figma-api';
import _ from 'lodash';

import { cosmiconfigSync } from 'cosmiconfig';

import parseFigma from './parser';
import exportFiles from './file-generator';
import { findNodeByName } from './utils';

// import pageJson from '../tests/Responsive.json';
// import imagesJson from '../tests/Responsive.images.json';
import settingsJson from '../tests/Responsive.settings.json';

const { config } = cosmiconfigSync('figma-to-react-cli').search();

const {
  figma: { personalAccessToken, fileKey, pageNames },
} = config;

// https://www.figma.com/developers/api
const figmaApi = new Figma.Api({ personalAccessToken });

Promise.all([figmaApi.getFile(fileKey), figmaApi.getImageFills(fileKey)])
  .then(
    async ([
      { document },
      {
        meta: { images: imagesJson },
      },
    ]) => {
      console.log('Getting data from Figma...');

      const pagesJson =
        pageNames && pageNames.length > 0
          ? pageNames.map(nodeName => findNodeByName(document, nodeName))
          : document.children;

      // fs.writeFileSync(
      //   `src/assets/tests/${pageJson.name}.json`,
      //   JSON.stringify(pageJson, null, ' '),
      // );

      console.log('Parsing...');
      const context = { ...config, figmaApi };
      const sourceMap = await parseFigma({
        pagesJson: pagesJson[0],
        imagesJson,
        settingsJson,
        context,
      });

      console.log('Exporting...');
      await exportFiles({ sourceMap, context });

      console.log('All done!');
    },
  )
  .catch(console.error);
