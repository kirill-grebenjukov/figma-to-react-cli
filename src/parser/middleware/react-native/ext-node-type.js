import get from 'lodash/get';

import {
  rip,
  rc,
  clearStylePosition,
  copyStylePosition,
  copyStyleSize,
} from '../../../utils';
import { WRAP_WITH, USE_AS_ROOT, USE_INSTEAD } from '../../../constants';

export default function middleware({ node, nodeJson, context }) {
  const { id } = nodeJson;

  const { settingsJson } = context;
  const { extends: { mode, import: extImport, component: extComponent } = {} } =
    settingsJson[id] || {};

  const res = { ...node };

  if (!mode || !extImport || !extComponent) {
    return res;
  }

  res.importCode = [...node.importCode, ...extImport.split('\n')];

  if (mode === USE_AS_ROOT) {
    res.renderCode = (props, children) => [
      `<${extComponent} ${rip(props, 0, `node-${props.key}`)}>`,
      ...rc(children),
      `</${extComponent}>`,
    ];
  } else if (mode === USE_INSTEAD) {
    res.renderCode = props => [
      `<${extComponent} ${rip(props, 0, `node-${props.key}`)} />`,
    ];
  } else if (mode === WRAP_WITH) {
    res.renderInstance = node.renderInstance || node.renderCode;
    res.renderCode = (props, children, thisNode) => [
      `<${extComponent} ${rip(
        {
          style: {
            ...copyStylePosition(props),
            ...copyStyleSize(props),
          },
        },
        0,
        `node-${props.key}`,
      )}>`,
      ...thisNode.renderInstance(
        {
          ...props,
          style: {
            ...get(props, 'style'),
            ...clearStylePosition(),
          },
        },
        children,
        thisNode,
      ),
      `</${extComponent}>`,
    ];
  }

  return res;
}
