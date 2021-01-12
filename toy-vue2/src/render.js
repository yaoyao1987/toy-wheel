import { createElement, createTextVnode } from './vdom/index'
export function renderMixin(Vue) {
  // 创建元素的虚拟节点
  Vue.prototype._c = function () {
    return createElement(...arguments)
  }
  // 创建文本的虚拟节点
  Vue.prototype._v = function (text) {
    return createTextVnode(text)
  }
  // 转化成字符串
  Vue.prototype._s = function (val) {
    console.log('转化成字符串 val', val)
    return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
  }

  Vue.prototype._render = function () {
    const vm = this;
    const { render } = vm.$options;
    let vnode = render.call(vm);
    return vnode;
  }
}