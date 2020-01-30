import Promise from 'bluebird';

import getMiddlewares from './middleware';
import parseFrame from './parse-frame';

export default async function parsePage({
  pageJson,
  imagesJson,
  settingsJson,
  context,
}) {
  const frames = pageJson.children.reduce((sum, child) => {
    const { id, type } = child;
    if (type !== 'FRAME') {
      return sum;
    }

    const settings = settingsJson[id];
    if (settings && settings.dontExport) {
      return sum;
    }

    return sum.concat([id]);
  }, []);

  if (frames.length === 0) {
    throw new Error('No frames found in the page. Nothing to parse.');
  }

  const sourceMap = {};
  const middlewares = getMiddlewares(context);

  await Promise.each(frames, frameId =>
    parseFrame({
      sourceMap,
      middlewares,
      frameId,
      pageJson,
      imagesJson,
      settingsJson,
      context,
    }),
  );

  return sourceMap;
}
