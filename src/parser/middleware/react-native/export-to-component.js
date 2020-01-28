import {
  getInstanceNode,
  isVector,
  copyStylePosition,
  copyStyleSize,
  clearStylePosition,
  clearStyleSize,
} from '../../../utils';

export default async function middleware({
  parentNode,
  node,
  nodeJson,
  sourceMap,
  context,
}) {
  const { type } = nodeJson;
  const { componentName, componentPath, props } = node;

  // we already handle it inside export-as-image-or-svg middleware
  if (isVector(type)) {
    return node;
  }

  if (!componentName && type !== 'INSTANCE') {
    return node;
  }

  const { settingsJson } = context;

  const instanceProps = {
    ...props,
    style: {
      ...copyStylePosition(props),
      ...copyStyleSize(props),
    },
  };

  if (type === 'INSTANCE') {
    const { componentId } = nodeJson;
    const { componentName: className, componentPath: classPath = '' } =
      settingsJson[componentId] || {};

    if (!className) {
      return node;
    }

    return getInstanceNode(node, instanceProps, className, classPath, context);
  }

  if (componentName) {
    // We should put new ReactComponent in sourceMap and
    // return instance of this Component as the node
    // We also should split styles between ReactComponent and instance,
    // size and position should go to instance, others should go to ReactComponent

    const componentProps = {
      ...props,
      style: {
        ...props.style,
        ...clearStylePosition(),
        ...clearStyleSize(),
        'last:prop': '...props.style',
      },
      'first:prop': '{...props}',
    };

    if (sourceMap[componentName]) {
      console.warn(
        `Component with name '${componentName}' already exists in sourceMap`,
      );
    }

    node.props = componentProps;
    sourceMap[componentName] = node;

    // we should not return instance component if there is no parent
    // no parent means that this is a top level component (screen/scene)
    if (parentNode) {
      return getInstanceNode(
        node,
        instanceProps,
        componentName,
        componentPath,
        context,
      );
    }
    // else return node;
  }

  return node;
}
