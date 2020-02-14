import _ from 'lodash';

import {
  rip,
  rc,
  clearStylePosition,
  copyStylePosition,
  copyStyleSize,
} from '../../../utils';
import { WRAP_WITH, USE_AS_ROOT, USE_INSTEAD } from '../../../constants';

export default function middleware({ node }) {
  const {
    extend: { mode, import: extImport, component: extComponent } = {},
  } = node;

  const res = { ...node };

  if (!mode || !extImport || !extComponent) {
    return res;
  }

  const extImports = extImport.split('\n');

  if (mode === USE_AS_ROOT) {
    res.importComponent = _.concat(extImports, node.importComponent || []);
    res.renderComponent = (props, children) => [
      `<${extComponent} ${rip(props, 0, `node-${props.key}`)}>`,
      ...rc(children),
      `</${extComponent}>`,
    ];
  } else if (mode === USE_INSTEAD) {
    res.importComponent = extImports;
    res.renderComponent = props => [
      `<${extComponent} ${rip(props, 0, `node-${props.key}`)} />`,
    ];
  } else if (mode === WRAP_WITH) {
    res.importDecorator = _.concat(extImports, node.importDecorator || []);
    res.renderDecorator = (props, children, thisNode) => [
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
      ...(node.renderDecorator || thisNode.renderComponent)(
        {
          ...props,
          style: {
            ..._.get(props, 'style'),
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
