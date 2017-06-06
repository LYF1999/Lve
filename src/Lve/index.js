/**
 * Created by Ezero on 2017/6/5.
 */

import { diff } from './diff';
import Patch from './patch';

const whatName = {};


class Node {
  constructor() {
    // override it
  }
}


class Element extends Node {
  constructor(tag, props, children) {
    super();
    this.tag = tag;
    this.props = props;
    this.children = children;
  }

}

class TextNode extends Node {

  constructor(text) {
    super();
    this.tag = 'LText';
    this.text = text;
  }
}


class Component extends Element {
  constructor(props, children) {
    super('Component', props, children);
  }

  state = {};

  index = 0;
  componentName = null;
  el = null;

  curDom = null;
  tag = null;

  setState(newState, fn) {

    const relNode = this.el;
    new Promise((resolve, reject) => {
      this.state = {
        ...this.state,
        ...newState,
      };
      const newDom = this.render();
      const diffValue = diff(this.curDom, newDom);
      Patch.patch(relNode, diffValue);
      resolve(newDom);
    })
      .then((newDom) => {
        this.curDom = newDom;
      })
      .then(() => {
        if (fn) {
          fn();
        }
      })

  }

  render() {
    // you should override it;
  }


}


function toDom(node) {
  if (!node) {
    return;
  }
  if (node instanceof TextNode) {
    return document.createTextNode(node.text);
  }

  let newNode = node;

  if (node instanceof Component) {
    newNode = node.render();
    node.tag = newNode.tag;
    node.componentName = node.__proto__.constructor.name;
    if (!whatName[node.componentName]) {
      whatName[node.componentName] = 0;
    } else {
      whatName[node.componentName] += 1;
    }
    node.index = whatName[node.componentName];
    node.curDom = newNode;
  }


  const relNode = document.createElement(newNode.tag);
  node.el = relNode;

  for (const key in newNode.props) {

    if (key === 'onClick') {
      relNode.addEventListener('click', newNode.props[key]);
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(newNode.props, key)) {
      relNode.setAttribute(key, newNode.props[key]);
    }

  }


  const children = newNode.children || [];

  children.forEach((child) => {
    if (!child) return;
    if (child instanceof TextNode) {
      relNode.appendChild(document.createTextNode(child.text));
    } else {
      relNode.appendChild(toDom(child));
    }
  });

  return relNode;
}


function renderDom(node, element) {
  element.appendChild(toDom(node));
}

function el(tag, props, children) {
  return new Element(tag, props, children);
}

function tn(text) {
  return new TextNode(text);
}

export {
  toDom,
  renderDom,
  Component,
  Element,
  TextNode,
  el,
  tn,
};
