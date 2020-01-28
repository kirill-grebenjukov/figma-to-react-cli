export default function getMiddlewares(config) {
  const {
    parser: { engine = 'react-native', middlewares: customMiddlewares },
  } = config;

  let platformMiddlewares = [];
  if (engine === 'react-native') {
    platformMiddlewares = require('./react-native/index').default;
  }

  return [...platformMiddlewares, ...customMiddlewares];
}
