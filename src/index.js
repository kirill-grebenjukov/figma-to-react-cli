import config from 'figma-cli.config';

import exportFiles from './file-generator';

import sourceMap from './assets/tests/source-map';

// console.log('config: ', config, sourceMap);

exportFiles({ config, sourceMap });
