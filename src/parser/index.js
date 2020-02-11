import Promise from 'bluebird';

import getMiddlewares from './middleware';
import parseFrame from './parse-frame';

export default async function parsePage({
  pageJson,
  imagesJson,
  settingsJson,
  context,
}) {
  const nodes = pageJson.children.reduce((sum, child) => {
    const { id } = child;

    const settings = settingsJson[id];
    if (settings && settings.dontExport) {
      return sum;
    }

    return sum.concat([id]);
  }, []);

  if (nodes.length === 0) {
    console.warn(
      `No nodes found in the page '${pageJson.name}'. Nothing to parse.`,
    );
    return {};
  }

  const sourceMap = {};
  const middlewares = getMiddlewares(context);

  await Promise.each(nodes, frameId =>
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
