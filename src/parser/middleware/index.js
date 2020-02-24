export default function getMiddlewares(config) {
  const {
    parser: { engine, middlewares: customMiddlewares },
  } = config;

  if (!engine) {
    throw new Error('No engine specified in config');
  }

  let platformMiddlewares = custom => custom;
  if (engine === 'react-native') {
    // eslint-disable-next-line global-require
    platformMiddlewares = require('./react-native/index').default;
  }

  return platformMiddlewares(customMiddlewares);
}
