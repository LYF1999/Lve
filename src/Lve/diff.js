/**
 * Created by Ezero on 2017/6/6.
 */

import Patch from './patch';
import { TextNode } from './index';


function diff(preNode, newNode) {
  const walker = { index: 0 };
  const patches = {};

  dfs(preNode, newNode, walker, patches, -1);

  return patches;
}

function dfs(preNode, newNode, walker, patches, parentIndex) {


  if (!preNode && !newNode) {
    return;
  }

  const curPatches = [];

  if (!newNode) {
    curPatches.push(new Patch(Patch.TYPE.REPLACE, null));
    patches[walker.index] = curPatches;
    return;
  }

  if (!preNode) {
    patches[parentIndex].push(new Patch(Patch.TYPE.ADD, newNode));
    return;
  }

  if (preNode.tag !== newNode.tag) {
    curPatches.push(new Patch(Patch.TYPE.REPLACE, newNode));
    patches[walker.index] = curPatches;
    return;
  }

  if (preNode instanceof TextNode) {
    if (preNode.text !== newNode.text) {
      curPatches.push(new Patch(Patch.TYPE.REPLACE, newNode));
    }
    patches[walker.index] = curPatches;
    return;
  }


  if (preNode.props) {
    const propsPatch = {};

    for (const key in preNode.props) {
      if (Object.prototype.hasOwnProperty.call(preNode.props, key)) {
        if (preNode.props[key] !== newNode.props[key]) {
          propsPatch[key] = newNode.props[key];
        }
      }
    }

    if (Object.keys(propsPatch).length) {
      curPatches.push(new Patch(Patch.TYPE.PROPS, propsPatch));
    }
  }

  const preChildrenCount = preNode.children.length;
  const nextChildrenCount = newNode.children.length;

  const maxCount = preChildrenCount >= nextChildrenCount ? preChildrenCount : nextChildrenCount;

  patches[walker.index] = curPatches;

  const parentI = walker.index;

  for (let i = 0; i < maxCount; i++) {
    walker.index++;
    dfs(preNode.children[i], newNode.children[i], walker, patches, parentI)
  }
}


export {
  diff,
}