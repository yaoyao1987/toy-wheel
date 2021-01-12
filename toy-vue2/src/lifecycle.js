import Watcher from './observer/watcher'
import { patch } from './vdom/patch'

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    // 首次渲染需要用虚拟节点来更新真实的dom元素
    vm.$el = patch(vm.$options.el, vnode);
  }
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    handlers.forEach(handler => handlers.call(vm));
  }
}

export function mountComponent(vm, el) {
  // 默认vue是通过watcher来进行渲染的，每个组件都有一个渲染watcher
  let updateComponent = () => {
    vm._update(vm._render()) // 将虚拟节点 渲染到页面上
  }
  new Watcher(vm, updateComponent, () => { }, true) // updateComponent()
}