import Promise from 'bluebird';
import _ from 'lodash';

import { USE_INSTEAD } from '../constants';
import {
  findNode,
  isVector,
  clearStylePosition,
  clearStyleSize,
} from '../utils';

export default async function parseNode({
  // parent node
  parentNode,
  parentJson,
  // current node
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
    extend,
  } = settingsJson[id] || {};

  if (dontExport) {
    return null;
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
      props: { key: id },
      hoc,
      extend,
    };
  }

  const { mode } = extend || {};

  let noChildren =
    skipChildren ||
    !childrenJson ||
    mode === USE_INSTEAD ||
    exportAs ||
    isVector(type);

  if (type === 'INSTANCE') {
    const { docJson } = context;
    const { componentId } = nodeJson;

    const component = findNode(docJson, componentId);
    const { componentName: className } = settingsJson[componentId] || {};
    if (component && className) {
      noChildren = true;
    }
  }

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
    node = await Promise.reduce(
      middlewares,
      (newNode, middleware) =>
        middleware({
          parentNode,
          parentJson,
          node: newNode,
          nodeJson,
          sourceMap,
          middlewares,
          context,
        }),
      node,
    );
  }

  return node;
}
