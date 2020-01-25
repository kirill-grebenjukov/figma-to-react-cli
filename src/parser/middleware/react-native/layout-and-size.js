import get from 'lodash/get';
import { rip, clearStylePosition } from '../../../utils';

export default function middleware({ parentNode, parentJson, node, nodeJson, context }) {
  const { frameX, frameY, frameWidth, frameHeight } = context;

  const {
    type,
    absoluteBoundingBox: { x, y, width, height },
    constraints: { vertical, horizontal },
  } = nodeJson;

  if (parentNode == null || ['DOCUMENT', 'CANVAS'].indexOf(type) >= 0) {
    return {
      ...node,
      props: {
        ...node.props,
        style: {
          ...get(node, 'props.style'),
          flex: 1,
        },
      },
    };
  }

  const left = x - get(parentJson, 'absoluteBoundingBox.x', frameX);
  const top = y - get(parentJson, 'absoluteBoundingBox.y', frameY);
  const right = get(parentJson, 'absoluteBoundingBox.width', frameWidth) - width - left;
  const bottom = get(parentJson, 'absoluteBoundingBox.height', frameHeight) - height - top;

  const hProps = {};
  const vProps = {};

  // tested: LEFT, RIGHT
  switch (horizontal) {
    case 'LEFT':
      hProps.left = left;
      break;
    case 'RIGHT':
      hProps.right = right;
      break;
    default:
    // do nothing
  }

  // tested: TOP, BOTTOM
  switch (vertical) {
    case 'TOP':
      hProps.top = top;
      break;
    case 'BOTTOM':
      hProps.bottom = bottom;
      break;
    default:
    // do nothing
  }

  const style = {
    ...get(node, 'props.style'),
    position: 'absolute',
    width,
    height,
    ...hProps,
    ...vProps,
  };

  // tested: LEFT_RIGHT, TOP_BOTTOM
  if (horizontal === 'LEFT_RIGHT' || vertical === 'TOP_BOTTOM') {
    return {
      ...node,
      importCode: ["import { View } from 'react-native';", ...node.importCode],
      renderCode: (props, children) => [
        `<View ${rip({
          style: {
            position: 'absolute',
            width: horizontal === 'LEFT_RIGHT' ? '100%' : width,
            height: vertical === 'TOP_BOTTOM' ? '100%' : height,
            ...hProps,
            ...vProps,
            paddingLeft: horizontal === 'LEFT_RIGHT' ? left : undefined,
            paddingRight: horizontal === 'LEFT_RIGHT' ? right : undefined,
            paddingTop: vertical === 'TOP_BOTTOM' ? top : undefined,
            paddingBottom: vertical === 'TOP_BOTTOM' ? bottom : undefined,
            // backgroundColor: node.id === '102:30' ? 'lime' : undefined,
          },
        })}>`,
        ...node.renderCode(props, children),
        '</View>',
      ],
      props: {
        ...node.props,
        style: {
          ...style,
          ...clearStylePosition(),
          width: horizontal === 'LEFT_RIGHT' ? '100%' : width,
          height: vertical === 'TOP_BOTTOM' ? '100%' : height,
        },
      },
    };
  }

  // tested both: CENTER
  if (horizontal === 'CENTER' || vertical === 'CENTER') {
    const marginLeft = horizontal === 'CENTER' ? left - (left + right) / 2 : 0;
    const marginTop = vertical === 'CENTER' ? top - (top + bottom) / 2 : 0;

    return {
      ...node,
      importCode: ["import { View } from 'react-native';", ...node.importCode],
      renderCode: (props, children) => [
        `<View ${rip({
          style: {
            position: 'absolute',
            width: horizontal === 'CENTER' ? '100%' : width,
            height: vertical === 'CENTER' ? '100%' : height,
            ...hProps,
            ...vProps,
            justifyContent: vertical === 'CENTER' ? 'center' : 'flex-start',
            alignItems: horizontal === 'CENTER' ? 'center' : 'flex-start',
          },
        })}>`,
        ...node.renderCode(props, children),
        '</View>',
      ],
      props: {
        ...node.props,
        style: {
          ...style,
          ...clearStylePosition(),
          marginLeft,
          marginTop,
        },
      },
    };
  }

  return {
    ...node,
    props: {
      ...node.props,
      style,
    },
  };
}
