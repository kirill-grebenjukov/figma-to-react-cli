import kebabCase from 'just-kebab-case';
import _ from 'lodash';

export function sanitizeFileName(value) {
  return value
    .split('/')
    .join('')
    .split('  ')
    .join(' ')
    .split('.')
    .join('D')
    .split(' ')
    .join('S')
    .split(':')
    .join('C')
    .split(';')
    .join('Z');
}

export function sanitizeText(value) {
  return value
    .split('{')
    .join('')
    .split('}')
    .join('');
}

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

export function findNodeByName(json, name) {
  if (!json) {
    return null;
  }

  if (json.name === name) {
    return json;
  }

  const { children } = json;
  if (children) {
    for (let i = 0; i < children.length; i += 1) {
      const child = findNodeByName(children[i], name);
      if (child) {
        return child;
      }
    }
  }

  return null;
}

export function findCanvas(json, name) {
  if (!json) {
    return null;
  }

  if (json.type === 'CANVAS' && json.name === name) {
    return json;
  }

  const { children } = json;
  if (children) {
    for (let i = 0; i < children.length; i += 1) {
      const child = findCanvas(children[i], name);
      if (child) {
        return child;
      }
    }
  }

  return null;
}

export function isVector(type) {
  return (
    [
      'VECTOR',
      'BOOLEAN_OPERATION',
      'STAR',
      'LINE',
      'ELLIPSE',
      'REGULAR_POLYGON',
    ].indexOf(type) >= 0
  );
}

export function getCodeExtension(extension) {
  return extension
    .split('.')
    .slice(0, -1)
    .join('.');
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

export function clearStyleSize() {
  return {
    width: undefined,
    height: undefined,
  };
}

export function copyStylePosition(props, def = {}) {
  return {
    position: _.get(props, 'style.position', def.position),
    left: _.get(props, 'style.left', def.left),
    right: _.get(props, 'style.right', def.right),
    top: _.get(props, 'style.top', def.top),
    bottom: _.get(props, 'style.bottom', def.bottom),
    marginLeft: _.get(props, 'style.marginLeft', def.marginLeft),
    marginRight: _.get(props, 'style.marginRight', def.marginRight),
    marginTop: _.get(props, 'style.marginTop', def.marginTop),
    marginBottom: _.get(props, 'style.marginBottom', def.marginBottom),
  };
}

export function copyStyleSize(props, def = {}) {
  return {
    width: _.get(props, 'style.width', def.width),
    height: _.get(props, 'style.height', def.height),
  };
}

export function copyStyleSizeOrFlex1(props) {
  const width = _.get(props, 'style.width');
  const height = _.get(props, 'style.height');
  return {
    width,
    height,
    flex: !width && !height ? 1 : undefined,
  };
}

const cc = v => Math.round(v * 255);
export const color = ({ r, g, b, a }, opacity = 1) =>
  `rgba(${cc(r)}, ${cc(g)}, ${cc(b)}, ${a * opacity})`;

export const rip0 = (props, level = 0) => {
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
    return `[${props.map(v => rip0(v)).join(', ')}]`;
  }

  if (_.isObject(props)) {
    if (level > 0) {
      return `{${_.keys(props)
        .filter(key => !_.isNil(props[key]))
        .sort((a, b) => {
          if (a === 'first:prop') return -1;
          if (b === 'first:prop') return 1;

          if (a === 'last:prop') return 1;
          if (b === 'last:prop') return -1;

          return 0;
        })
        .map(key => {
          if (key === 'first:prop' || key === 'last:prop') {
            return String(props[key]);
          }

          const key0 = key.indexOf('-') >= 0 ? `'${key}'` : key;

          return `${key0}: ${rip0(props[key], level + 1)}`;
        })
        .join(', ')}}`;
    }

    return `${_.keys(props)
      .sort((a, b) => {
        if (a === 'first:prop') return -1;
        if (b === 'first:prop') return 1;

        if (a === 'last:prop') return 1;
        if (b === 'last:prop') return -1;

        return 0;
      })
      .map(key => {
        const value = props[key];

        if (key === 'first:prop' || key === 'last:prop') {
          return String(value);
        }

        if (_.isString(value)) {
          return `${key}="${value}"`;
        }

        return `${key}={${rip0(props[key], level + 1)}}`;
      })
      .join(' ')}`;
  }

  return String(props);
};

let globProps = null;
export const initGlobProps = props => {
  globProps = props;
};

export const getGlobProps = () => globProps;

export const rip = (props, level = 0, name = null) => {
  const value = rip0(props, level);

  if (level === 0 && name && globProps) {
    globProps[name] = props;

    const hasProps = value.indexOf('...props') >= 0;
    return hasProps ? `{...PROPS['${name}'](props)}` : `{...PROPS['${name}']}`;
  }

  return value;
};

export const rc = children =>
  _.flatMap(children, child => {
    const { renderDecorator, renderComponent, props, children: ch } = child;
    const renderCode = renderDecorator || renderComponent;

    if (!renderCode) {
      console.warn('renderCode is null for ', child);
      return [];
    }

    return renderCode(props, ch, child);
  });

export function getInstanceNode(
  node,
  props,
  componentName,
  componentPath,
  svgCode,
  context,
) {
  const {
    exportCode: { codePrefix: codeClassPrefix, componentExt },
    exportSvgComponents: { codePrefix: codeSvgPrefix, fileExt },
  } = context;

  if (!componentName) {
    return node;
  }

  const codePrefix = svgCode ? codeSvgPrefix : codeClassPrefix;
  const ext = svgCode ? fileExt : componentExt;

  const filePath = [
    codePrefix,
    componentPath,
    `${kebabCase(componentName)}`,
    `${kebabCase(componentName)}.${getCodeExtension(ext)}`,
  ]
    .filter(t => !!t)
    .join('/');

  return {
    ...node,
    props,
    importComponent: [`import ${componentName} from '${filePath}';`],
    // eslint-disable-next-line no-shadow
    renderComponent: props => [
      `<${componentName} ${rip(props, 0, `instance-${props.key}`)} />`,
    ],
  };
}

// Aliases

export const colorComponent = cc;
export const renderInlineProps = rip;
export const renderChildren = rc;
