import { findNode } from '../utils';
import parseNode from './parse-node';

export default async function parseFrame({
  sourceMap,
  middlewares,
  frameId,
  pageJson,
  imagesJson,
  settingsJson,
  context,
}) {
  const frame = findNode(pageJson, frameId);

  if (!frame) {
    console.warn(`Node ${frameId} not found in the tree`);
    return null;
  }

  const {
    absoluteBoundingBox: { x, y, width, height },
  } = frame;

  const context2 = {
    ...context,
    // jsons
    docJson: pageJson,
    imagesJson,
    settingsJson,
    // frame info
    frameId,
    frameX: x,
    frameY: y,
    frameWidth: width,
    frameHeight: height,
  };

  return parseNode({
    // parent node
    parentNode: null,
    parentJson: null,
    // current node
    nodeJson: frame,
    // tools
    sourceMap,
    middlewares,
    context: context2,
  });
}
