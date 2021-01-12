export function createElement(tag, data = {}, ...children) {
  return vnode(tag, data, data.key, children, undefined)
}

export function createTextVnode(text) {
  return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text) {
  return {
    tag,
    data,
    key,
    children,
    text
  }
}