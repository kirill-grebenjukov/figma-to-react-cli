import fs from 'fs';
import Promise from 'bluebird';
import * as Figma from 'figma-api';
import _ from 'lodash';

// eslint-disable-next-line import/no-unresolved
import config from '.figma-cli.config';

import parseFigma from './parser';
import exportFiles from './file-generator';
import { findCanvas } from './utils';

// import pageJson from './assets/tests/Responsive.json';
// import imagesJson from './assets/tests/Responsive.images.json';
import settingsJson from './assets/tests/Responsive.settings.json';

const {
  figma: { personalAccessToken, fileKey, pageName },
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
      const pageJson = pageName ? findCanvas(document, pageName) : document;
      if (!pageJson) {
        console.log('No page/canvas found');
        return;
      }

      // fs.writeFileSync(
      //   `src/assets/tests/${pageJson.name}.json`,
      //   JSON.stringify(pageJson, null, ' '),
      // );

      console.log('Parsing...');
      const context = { ...config, figmaApi };
      const sourceMap = await parseFigma({
        pageJson,
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
