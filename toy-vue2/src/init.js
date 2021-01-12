import { initState } from './state'
import { compileToFunctions } from "./compiler/index.js";
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from './util/index'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options, options);

    // 初始化状态
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')
    // 页面挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function (el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el)
    vm.$options.el = el;

    // 如果没有render方法
    if (!options.render) {
      let template = options.template;
      // 如果没有模板但是有el
      if (!template && el) {
        template = el.outerHTML;
      }
      // 将模板编译成render函数
      const render = compileToFunctions(template);
      options.render = render
    }
    mountComponent(vm, el); // 组件挂载 
  }
}