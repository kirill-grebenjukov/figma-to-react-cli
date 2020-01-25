import config from 'figma-cli.config';

import parseFigma from './parser';
import exportFiles from './file-generator';

import pageJson from './assets/tests/Responsive.json';
import imagesJson from './assets/tests/Responsive.images.json';
import settingsJson from './assets/tests/Responsive.settings.json';

import _ from 'lodash';

// import sourceMap from './assets/tests/source-map';
// exportFiles({ config, sourceMap });

parseFigma({ pageJson, imagesJson, settingsJson, config }).then(sourceMap => {
  console.log('sourceMap: ', sourceMap);

  exportFiles({ config, sourceMap });
});
