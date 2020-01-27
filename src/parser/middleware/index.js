export default function getMiddlewares(config) {
  const {
    parser: { engine = 'react-native', middlewares: customMiddlewares },
  } = config;

  let platformMiddlewares = { head: [], tail: [] };
  if (engine === 'react-native') {
    platformMiddlewares = require('./react-native/index').default;
  }

  return {
    head: [...platformMiddlewares.head, ...customMiddlewares.head],
    tail: [...customMiddlewares.tail, ...platformMiddlewares.tail],
  };
}
