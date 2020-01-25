import kebabCase from 'just-kebab-case';
import _ from 'lodash';

export function findNode(json, id) {
  if (!json) {
    return null;
  }

  if (json.id === id) {
    return json;
  }

  const { children } = json;
  if (children) {
    for (let i = 0; i < children.length; i += 1) {
      const child = findNode(children[i], id);
      if (child) {
        return child;
      }
    }
  }

  return null;
}

export function getInstanceNode(node, componentName, componentPath, context) {
  const {
    exportCode: { codePrefix },
  } = context;

  if (!componentName) {
    return node;
  }

  const filePath = [codePrefix, componentPath, `${kebabCase(componentName)}.component.js`]
    .filter(t => !!t)
    .join('/');

  return {
    ...node,
    importCode: [`import { ${componentName} } from '${filePath}';`],
    renderCode: props => [`<${componentName} ${rip(props)} />`],
  };
}

export function clearStylePosition() {
  return {
    position: undefined,
    left: undefined,
    right: undefined,
    top: undefined,
    bottom: undefined,
  };
}

export function copyStylePosition(props, def = {}) {
  return {
    position: _.get(props, 'style.position', def.position),
    left: _.get(props, 'style.left', def.left),
    right: _.get(props, 'style.right', def.right),
    top: _.get(props, 'style.top', def.top),
    bottom: _.get(props, 'style.bottom', def.bottom),
  };
}

export function copyStyleSize(props, def = {}) {
  return {
    width: _.get(props, 'style.width', def.width),
    height: _.get(props, 'style.height', def.height),
  };
}

const cc = v => Math.round(v * 255);
export const color = ({ r, g, b, a }, opacity = 1) =>
  `rgba(${cc(r)}, ${cc(g)}, ${cc(b)}, ${cc(a * opacity)})`;

export const rip = (props, level = 0) => {
  if (_.isNil(props)) {
    return '';
  }

  if (_.isString(props)) {
    return `'${props}'`;
  }

  if (_.isNumber(props)) {
    return props;
  }

  if (_.isArray(props)) {
    return `[${props.map(v => rip(v)).join(', ')}]`;
  }

  if (_.isObject(props)) {
    if (level > 0) {
      return `{${_.keys(props)
        .filter(key => !_.isNil(props[key]))
        .map(key => `${key}: ${rip(props[key], level + 1)}`)
        .join(', ')}}`;
    } else {
      return `${_.keys(props)
        .map(key => {
          const value = props[key];

          if (_.isString(value)) {
            return `${key}="${value}"`;
          }

          return `${key}={${rip(props[key], level + 1)}}`;
        })
        .join(' ')}`;
    }
  }

  return String(props);
};

export const rc = children =>
  _.flatMap(children, ({ renderCode, props, children: cc }) => renderCode(props, cc));

// Aliases

export const colorComponent = cc;
export const renderInlineProps = rip;
export const renderChildren = rc;
