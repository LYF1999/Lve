/**
 * Created by Ezero on 2017/6/6.
 */

import { toDom } from './index';

class Patch {

  static TYPE = {
    REPLACE: 0,
    REORDER: 1,
    PROPS: 2,
    ADD: 3,
  };

  constructor(type, options = null) {
    this.type = type;
    this.options = options;
  }

  static patch(node, patches) {
    const walker = { index: 0 };
    Patch.dfsWalk(node, walker, patches);
  }

  static dfsWalk(node, walker, patches) {
    const curPatches = patches[walker.index];

    const len = node.childNodes
      ? node.childNodes.length
      : 0;

    for (let i = 0; i < len; i++) {
      const child = node.childNodes[i];
      walker.index++;
      Patch.dfsWalk(child, walker, patches);
    }

    if (curPatches.length > 0) {
      applyPatches(node, curPatches);
    }
  }
}


function applyPatches(node, curPatches) {
  curPatches.forEach((patch) => {
    switch (patch.type) {
      case Patch.TYPE.REPLACE:
        replaceNode(node, patch);
        break;
      case Patch.TYPE.PROPS:
        changeProps(node, patch);
        break;
      case Patch.TYPE.REORDER:
        reorderNode(node, patch);
        break;
      case Patch.TYPE.ADD:
        addNode(node, patch)
    }
  })
}


function replaceNode(node, patch) {
  node.parentNode.replaceChild(toDom(patch.options), node);
}

function changeProps(node, patch) {
  for (const key in patch.options) {
    if (Object.prototype.hasOwnProperty.call(patch.options, key)) {
      node.setAttribute(key, patch.options[key])
    }
  }
}

function addNode(node, patch) {
  node.appendChild(toDom(patch.options));
}

function reorderNode() {

}


export default Patch;