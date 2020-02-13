import _ from 'lodash';
import { rip, clearStylePosition, copyStyleSize } from '../../../utils';

export default function middleware({ parentJson, node, nodeJson, context }) {
  const { frameX, frameY, frameWidth, frameHeight } = context;

  const {
    name,
    type,
    absoluteBoundingBox: { x, y, width, height },
    constraints: { vertical, horizontal },
  } = nodeJson;

  if (['DOCUMENT', 'CANVAS'].indexOf(type) >= 0) {
    return {
      ...node,
      props: {
        ...node.props,
        style: {
          ..._.get(node, 'props.style'),
          flex: 1,
        },
      },
    };
  }

  const left = x - _.get(parentJson, 'absoluteBoundingBox.x', frameX);
  const top = y - _.get(parentJson, 'absoluteBoundingBox.y', frameY);
  const parentWidth = _.get(
    parentJson,
    'absoluteBoundingBox.width',
    frameWidth,
  );
  const parentHeight = _.get(
    parentJson,
    'absoluteBoundingBox.height',
    frameHeight,
  );
  const right = parentWidth - width - left;
  const bottom = parentHeight - height - top;

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

  const position =
    _.keys(hProps).length > 0 || _.keys(vProps).length > 0
      ? 'absolute'
      : undefined;

  const style = {
    ..._.get(node, 'props.style'),
    position,
    width,
    height,
    ...hProps,
    ...vProps,
  };

  // tested: LEFT_RIGHT, TOP_BOTTOM
  if (horizontal === 'LEFT_RIGHT' || vertical === 'TOP_BOTTOM') {
    return {
      ...node,
      props: {
        ...node.props,
        style: {
          ...style,
          ...clearStylePosition(),
          width: horizontal === 'LEFT_RIGHT' ? '100%' : width,
          height: vertical === 'TOP_BOTTOM' ? '100%' : height,
        },
      },
      importDecorator: _.concat(
        ["import { View } from 'react-native';"],
        node.importCode,
      ),
      renderDecorator2: node.renderDecorator,
      renderDecorator: (props, children, thisNode) => [
        `<View ${rip(
          {
            style: {
              width: horizontal === 'LEFT_RIGHT' ? '100%' : width,
              height: vertical === 'TOP_BOTTOM' ? '100%' : height,
              ...hProps,
              ...vProps,
              position,
              paddingLeft: horizontal === 'LEFT_RIGHT' ? left : undefined,
              paddingRight: horizontal === 'LEFT_RIGHT' ? right : undefined,
              paddingTop: vertical === 'TOP_BOTTOM' ? top : undefined,
              paddingBottom: vertical === 'TOP_BOTTOM' ? bottom : undefined,
              // backgroundColor: node.id === '102:30' ? 'lime' : undefined,
            },
          },
          0,
          `container-${props.key}`,
        )}>`,
        ...(thisNode.renderDecorator2 || thisNode.renderComponent)(
          props,
          children,
          thisNode,
        ),
        '</View>',
      ],
    };
  }

  // tested both: CENTER
  if (horizontal === 'CENTER' || vertical === 'CENTER') {
    const marginLeft =
      horizontal === 'CENTER'
        ? left - (left + parentWidth - width - left) / 2
        : 0;
    const marginTop = vertical === 'CENTER' ? top - (top + bottom) / 2 : 0;

    return {
      ...node,
      props: {
        ...node.props,
        style: {
          ...style,
          ...clearStylePosition(),
          marginLeft,
          marginTop,
        },
      },
      importDecorator: _.concat(
        ["import { View } from 'react-native';"],
        node.importDecorator,
      ),
      renderDecorator2: node.renderDecorator,
      renderDecorator: (props, children, thisNode) => [
        `<View ${rip(
          {
            style: {
              width: horizontal === 'CENTER' ? '100%' : width,
              height: vertical === 'CENTER' ? '100%' : height,
              ...hProps,
              ...vProps,
              position,
              justifyContent: vertical === 'CENTER' ? 'center' : 'flex-start',
              alignItems: horizontal === 'CENTER' ? 'center' : 'flex-start',
            },
          },
          0,
          `container-${props.key}`,
        )}>`,
        `<View ${rip(
          {
            style: {
              ...copyStyleSize(props),
            },
          },
          0,
          `placeholder-${props.key}`,
        )}>`,
        ...(thisNode.renderDecorator2 || thisNode.renderComponent)(
          props,
          children,
          thisNode,
        ),
        '</View>',
        '</View>',
      ],
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
