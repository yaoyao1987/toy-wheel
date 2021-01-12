export function patch(oldVnode, vnode) {
  // oldVnode是一个真实的元素
  const isRealElement = oldVnode.nodeType
  // 初次渲染
  if (isRealElement) {
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode; // body

    let el = createElm(vnode) // 根据虚拟节点创建真实的节点
    parentElm.insertBefore(el, oldElm.nextSibling) // 将创建的节点插到原有节点的下一个
    parentElm.removeChild(oldElm)
    return el;
  } else {
    //  diff算法
  }
}

// 根据虚拟节点创建真实的节点
function createElm(vnode) {
  let { tag, children, key, data, text } = vnode;

  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag); // 用vue的指令时，可以通过vnode拿到真实dom
    updateProperties(vnode);
    children.forEach(child => {
      return vnode.el.appendChild(createElm(child));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el
}

function updateProperties(vnode) {
  let newProps = vnode.data || {} // 获取当前老节点中的属性
  let el = vnode.el; // 当前的真实节点

  for (const key in newProps) {
    if (key === 'style') {
      for (const styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else {
      // 给这个元素添加属性 值就是对应的值
      el.setAttribute(key, newProps[key])
    }
  }
}