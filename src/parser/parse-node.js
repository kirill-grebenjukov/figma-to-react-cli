import Promise from 'bluebird';
import _ from 'lodash';

import { USE_INSTEAD } from '../constants';
import { getInstanceNode, isVector, rc } from '../utils';
import get from 'lodash/get';

export default async function parseNode({
  // parent
  parentNode,
  parentJson,
  // current
  nodeJson,
  //
  sourceMap,
  middlewares,
  context,
}) {
  const {
    parser: { defaultComponent },
    settingsJson,
  } = context;

  const { id, name, type, children: childrenJson } = nodeJson;

  const {
    // should we add `flex: 1` to the component style
    // we need it for parent (screen) components to occupy all the available space
    stretch = false,
    // don't export component completely
    dontExport = false,
    // parse component but skip its children
    skipChildren = false,
    // componentName and componentPath
    componentName,
    componentPath = '',
    exportAs,
    // hoc
    hoc,
    // extend by an existing component
    extend: { mode } = {},
  } = settingsJson[id] || {};

  if (dontExport) {
    return;
  }

  let node = null;
  // if parentNode is null then we are at the frame level or
  // all parent nodes don't have componentName that means they shouldn't be parsed
  if (componentName || parentNode) {
    node = {
      id,
      name,
      componentName,
      componentPath,
      ...defaultComponent,
      children: null,
      props: {
        key: id,
        style: stretch ? { flex: 1 } : undefined,
      },
      hoc,
    };
  }

  const noChildren =
    skipChildren ||
    !childrenJson ||
    mode === USE_INSTEAD ||
    type === 'INSTANCE' ||
    exportAs ||
    isVector(type);

  if (!noChildren) {
    const activeChildrenJson = childrenJson.filter(
      ({ visible = true }) => visible,
    );
    const activeChildren = await Promise.map(activeChildrenJson, childJson =>
      parseNode({
        // parent
        parentNode: node,
        parentJson: nodeJson,
        // current
        nodeJson: childJson,
        // tools
        sourceMap,
        middlewares,
        context,
      }),
    );

    if (node) {
      node.children = activeChildren.filter(child => !!child);
    }
  }

  if (node) {
    const skipHead = exportAs || isVector(type);
    if (!skipHead) {
      node = await Promise.reduce(
        middlewares.head,
        (newNode, middleware) =>
          middleware({
            parentNode,
            parentJson,
            node: newNode,
            nodeJson,
            sourceMap,
            context,
          }),
        node,
      );
    }

    // if sourceMap[componentName] is not null we will reuse existing component and
    // reuse logic is inside a middleware
    if (type === 'INSTANCE') {
      const { componentId } = nodeJson;
      const { componentName: className, componentPath: classPath = '' } =
        settingsJson[componentId] || {};

      node = getInstanceNode(node, className, classPath, context);
    } else if (componentName) {
      if (!sourceMap[componentName]) {
        const nodeRenderCode = node.renderCode;
        sourceMap[componentName] = node;
      }

      node = getInstanceNode(node, componentName, componentPath, context);
    }

    node = await Promise.reduce(
      middlewares.tail,
      (newNode, middleware) =>
        middleware({
          parentNode,
          parentJson,
          node: newNode,
          nodeJson,
          sourceMap,
          context,
        }),
      node,
    );
  }

  // console.log('node: ', id, name, _.get(node, 'props.key'));

  return node;
}
